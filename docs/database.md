# Database Design (Phase 1)

PostgreSQL is the primary system of record. The schema is normalized, user-scoped, and designed to evolve via Alembic migrations.

## Identity & Security

### `users`

Core identity table.

Key fields (planned):

- `id` (PK)
- `email` (unique, indexed)
- `password_hash`
- `email_verified_at` (nullable)
- `created_at`, `updated_at`

### `auth_sessions` (refresh tokens)

Stores refresh-token sessions, rotation metadata, and revocation.

- `id` (PK)
- `user_id` (FK → users.id, indexed)
- `refresh_token_hash` (indexed)
- `revoked_at` (nullable)
- `created_at`, `last_used_at`

### `email_verification_tokens`, `password_reset_tokens`

Short-lived, one-time-use tokens with `expires_at` and `used_at`.

## Core Domains (Planned Tables)

All domain tables include:

- `id` (PK)
- `user_id` (FK → users.id, indexed)
- `created_at`, `updated_at`

### Tasks & Projects

- `projects`: name, description, sort order, archived flag
- `tasks`: project_id (nullable), title, notes, status, priority, due_at, completed_at, recurrence_rule (nullable)
- `task_subtasks`: parent_task_id, title, completed_at
- `labels`: name, color
- `task_labels`: join table (task_id, label_id)

Indexes:

- `tasks (user_id, status, due_at)`
- `tasks (user_id, project_id, updated_at)`
- `task_labels (task_id, label_id)` unique composite

### Notes & Knowledge Base

- `notes`: title, body_markdown, folder_id (nullable), pinned flag
- `folders`: parent_id (nullable), name
- `tags`: name
- `note_tags`: join table (note_id, tag_id)
- `note_links`: backlinks graph (from_note_id, to_note_id)

Search:

- later: full-text index (`tsvector`) on note title/body
- later: semantic embeddings table (see “AI & Search”)

### Habits

- `habits`: name, schedule (days of week / cadence), target_count, active flag
- `habit_entries`: habit_id, occurred_on (date), value (int/bool), unique (habit_id, occurred_on)

Indexes:

- `habit_entries (user_id, occurred_on)`
- unique constraint on `(habit_id, occurred_on)`

### Goals

- `goals`: name, description, start_at, target_at, status
- `milestones`: goal_id, name, target_value, current_value, completed_at

### Expenses

- `categories`: name, kind (income/expense)
- `transactions`: occurred_at, amount_cents, currency, category_id, note, merchant (nullable)
- `budgets`: month (YYYY-MM), category_id, limit_cents

Indexes:

- `transactions (user_id, occurred_at desc)`
- `transactions (user_id, category_id, occurred_at desc)`

### Calendar & Reminders

- `events`: start_at, end_at, title, description, timezone, source (manual/import)
- `reminders`: event_id (nullable), task_id (nullable), remind_at, channel, status

### Notifications

- `notifications`: type, payload_json, read_at (nullable)

## AI & Search (Planned)

### `documents` / `embeddings`

For semantic search and retrieval:

- `documents`: (note/task/etc) reference + canonical text snapshot
- `embeddings`: document_id, vector, model, created_at

Implementation options:

- Postgres `pgvector` extension (preferred first step)
- External vector DB later if needed

## Relationship Summary (ERD Narrative)

- A `user` owns many `projects`, `tasks`, `notes`, `habits`, `goals`, `transactions`, `events`.
- `project` has many `tasks`.
- `task` has many `labels` via `task_labels`.
- `note` has many `tags` via `note_tags`.
- `note_links` creates a directed graph for backlinks.
- `habit` has many `habit_entries` with one entry per day (or per occurrence) depending on schedule.

## Migration Strategy

- Use Alembic migrations for every schema change (no manual SQL in production).
- Make changes in safe steps:
  - additive schema (new nullable columns/tables)
  - backfill via background job/one-off script
  - then enforce constraints (NOT NULL, unique)
- Index concurrently where possible in production (planned).

