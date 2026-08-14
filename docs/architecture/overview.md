# Architecture Overview

QRPrint uses a modular monolith architecture:

1. `apps/web`: React UI organized by domain modules.
2. `backend`: FastAPI with API → application → domain → infrastructure boundaries.
3. `database`: PostgreSQL schema with tenant-aware data model.
4. `apps/print-agent`: local polling/queueing print agent.

Initial boundary rule: business rules (pricing/state transitions/payment rules) live in backend domain/application layers, not in route handlers.
