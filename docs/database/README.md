# Database

- Engine: PostgreSQL
- Migrations: SQL files in `database/migrations`
- Multi-tenant model: tenant isolation via `tenant_id` foreign keys across tenant-owned entities.
