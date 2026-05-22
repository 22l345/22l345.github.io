# Folder Structure (Phase 1 Proposal)

This repo will evolve into a monorepo so frontend, backend, and infra can ship together while staying modular.

## Top-Level

- `apps/`
  - `web/` Next.js product UI
  - `api/` FastAPI backend
- `packages/`
  - `ui/` shared UI components + Tailwind tokens (consumed by `apps/web`)
  - (later) `api-client/` generated/handwritten API client + shared types
- `infra/`
  - `docker/` Dockerfiles
  - `compose/` `docker-compose.yml` variants (dev/staging)
- `docs/` architecture, schema, API design, onboarding
- `scripts/` local scripts (db reset, seed, lint shortcuts)

## Principles

- Feature modules live close to their boundary:
  - Frontend feature modules in `apps/web/src/features/*`
  - Backend domains in `apps/api/app/domains/*`
- Keep UI components reusable:
  - shared primitives in `packages/ui`
  - feature-specific UI stays in the feature module
- Avoid cross-layer leakage:
  - no SQLAlchemy models imported into the frontend
  - all client usage through API contracts

