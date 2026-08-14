# Contributing

## Branching

- Work on feature branches.
- Open pull requests against `main`.
- Keep commits focused and logically grouped.

## Development Standards

- Frontend: TypeScript strict mode, ESLint, Prettier, Vitest.
- Backend: FastAPI, Ruff, pytest.
- Database changes must be migration-based under `database/migrations`.
- Never commit real secrets; use `.env.example` for required variables.

## Validation Before PR

1. Frontend lint, typecheck, tests, build.
2. Backend Ruff check/format check and pytest.
3. Verify no generated artifacts or credentials are committed.
