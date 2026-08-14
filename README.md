# QRPrint

Offline-first print-shop platform built as a modular monolith.

## Repository Layout

- `apps/web` — React + Vite + TypeScript customer/merchant/ops frontend shell
- `apps/print-agent` — Python print agent foundation (Windows-focused)
- `backend` — FastAPI backend with API/application/domain/infrastructure layers
- `database/migrations` — versioned PostgreSQL schema migrations
- `docs` — architecture, API, database, deployment, security, operations and ADRs

## Quick Start

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
uvicorn app.main:app --reload
```

### Quality Checks

```bash
cd apps/web && npm run lint && npm run typecheck && npm run test -- --run && npm run build
cd backend && ruff check . && ruff format --check . && pytest
```

## MVP Foundation Status

This reset establishes Phase 0 and initial Phase 1 foundations:

- strict TypeScript + lint/format/test tooling
- FastAPI layered backend skeleton
- print-job state machine + optimistic version handling
- initial multi-tenant PostgreSQL schema migration
- CI workflow with frontend/backend quality gates

Further vertical slices (customer flow, merchant flow, payments, print agent sync) build on this base.
