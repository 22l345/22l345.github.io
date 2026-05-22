# LifeOS Architecture (Phase 1)

## Goals

- Build a production-grade SaaS with clear separation of concerns.
- Keep iteration fast: modular domains, stable APIs, predictable migrations.
- Prioritize security, correctness, and maintainability over “quick hacks”.

## High-Level System

LifeOS is a monorepo containing:

- **Web app**: Next.js (TypeScript) for the product UI.
- **API**: FastAPI (Python) providing REST APIs (OpenAPI documented).
- **Database**: PostgreSQL as the system of record.
- **Cache/queue**: Redis for caching + Celery broker/results.
- **Background jobs**: Celery workers for scheduled reminders, indexing, and AI pipelines.

## Backend Architecture

Backend is organized into layers:

- **API layer (FastAPI routers)**: request/response schemas, auth dependencies, pagination.
- **Service layer**: business logic and orchestration across repositories/integrations.
- **Repository layer**: database reads/writes (SQLAlchemy), transaction boundaries.
- **Domain model (SQLAlchemy + Pydantic)**: durable schema + typed API contracts.

Cross-cutting concerns:

- **Structured errors**: consistent error envelope for clients.
- **Observability**: structured logging; health endpoints; later: metrics + tracing.
- **Security**: JWT access + refresh tokens, password hashing, verification flows, rate limiting.

## Frontend Architecture

Frontend is organized around:

- **App shell**: navigation, layout, settings (theme, account, preferences).
- **Feature modules**: tasks, notes, habits, goals, expenses, calendar, assistant.
- **Data fetching**: TanStack Query for server state (caching, retries, pagination).
- **Client state**: Zustand for lightweight UI state (panels, filters, transient drafts).
- **UI kit**: Tailwind + shadcn/ui components, with a shared token system.

## Data Ownership & Consistency

- PostgreSQL is the source of truth.
- Redis is used for caching and job coordination; cache is always derivable.
- Background jobs must be idempotent and safe to retry.

## AI Layer (Planned)

AI capabilities are built behind an abstraction:

- **Provider abstraction**: a thin “LLM client” wrapping OpenAI API calls.
- **Pipelines**: summarization, extraction, suggestions, semantic search indexing.
- **Vector search**: plan for pgvector (Postgres extension) or external vector DB later.

## Multi-Tenancy Model

LifeOS is multi-tenant by default: every user owns their data.

- All domain tables include `user_id` as a required foreign key.
- Queries must always scope by `user_id` (enforced in repositories and/or policies).

## Environments & Config

- Use environment-based configuration (`.env.example` in each app).
- Never commit secrets.
- Separate dev/staging/prod settings (CORS origins, cookie settings, token TTLs).

## Deployment Targets (Planned)

- **Web**: Vercel
- **API**: Railway/Render (container-based)
- **DB**: managed Postgres
- **Redis**: managed Redis

## Phase 2+ Implementation Notes

- Add Docker + Compose for local dev (API + DB + Redis + worker).
- Add Alembic migrations as the authoritative schema evolution path.
- Add auth and session management first (all features build on identity).

