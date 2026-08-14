BEGIN;

CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, email)
);

CREATE TABLE stores (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  stable_identifier TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, stable_identifier)
);

CREATE TABLE store_members (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (store_id, user_id)
);

CREATE TABLE customers (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  phone TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  storage_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size BIGINT NOT NULL CHECK (size > 0),
  sha256 TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE (tenant_id, storage_key)
);

CREATE TABLE devices (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OFFLINE',
  last_seen_at TIMESTAMPTZ
);

CREATE TABLE printers (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OFFLINE'
);

CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  color_mode TEXT NOT NULL,
  paper_size TEXT NOT NULL,
  duplex BOOLEAN NOT NULL DEFAULT FALSE,
  price_per_page NUMERIC(10,2) NOT NULL CHECK (price_per_page >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (store_id, color_mode, paper_size, duplex)
);

CREATE TABLE print_jobs (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  document_id UUID REFERENCES documents(id) ON DELETE RESTRICT,
  copies INTEGER NOT NULL CHECK (copies > 0),
  pages INTEGER NOT NULL CHECK (pages > 0),
  page_range TEXT,
  color_mode TEXT NOT NULL,
  duplex BOOLEAN NOT NULL DEFAULT FALSE,
  paper_size TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
  tax NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  discount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status TEXT NOT NULL,
  print_status TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE print_job_events (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  print_job_id UUID NOT NULL REFERENCES print_jobs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  print_job_id UUID NOT NULL REFERENCES print_jobs(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL,
  provider_order_id TEXT,
  provider_payment_id TEXT,
  status TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  idempotency_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, idempotency_key)
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
  status TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  idempotency_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, idempotency_key)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  result TEXT NOT NULL,
  request_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_print_jobs_tenant_store_status ON print_jobs (tenant_id, store_id, print_status);
CREATE INDEX idx_payments_tenant_status ON payments (tenant_id, status);
CREATE INDEX idx_refunds_tenant_status ON refunds (tenant_id, status);
CREATE INDEX idx_audit_logs_tenant_created_at ON audit_logs (tenant_id, created_at DESC);

COMMIT;
