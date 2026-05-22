# API Design (Phase 1)

FastAPI will expose a versioned REST API with OpenAPI documentation.

## Base Conventions

- Base path: `/api/v1`
- Auth: `Authorization: Bearer <access_token>`
- JSON everywhere (`application/json`)
- All resources are scoped to the authenticated user.

## Response Envelopes (Planned)

Success:

```json
{ "data": { }, "meta": { } }
```

Error:

```json
{ "error": { "code": "string", "message": "string", "details": { } } }
```

## Pagination / Filtering / Sorting

For list endpoints:

- `limit` (default 20, max 100)
- `cursor` (opaque) OR `offset` (when cursor not feasible)
- `sort` (e.g. `-created_at`, `due_at`)
- `q` for full-text query (where applicable)
- domain filters (e.g. `status=`, `project_id=`)

## Authentication Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/request-password-reset`
- `POST /auth/reset-password`
- `POST /auth/request-email-verification`
- `POST /auth/verify-email`

## Tasks & Projects

- `GET /projects`
- `POST /projects`
- `PATCH /projects/{project_id}`
- `DELETE /projects/{project_id}`

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/{task_id}`
- `PATCH /tasks/{task_id}`
- `DELETE /tasks/{task_id}`

## Notes & Knowledge

- `GET /notes`
- `POST /notes`
- `GET /notes/{note_id}`
- `PATCH /notes/{note_id}`
- `DELETE /notes/{note_id}`

- `GET /folders`
- `POST /folders`

## Habits

- `GET /habits`
- `POST /habits`
- `POST /habits/{habit_id}/checkins` (create a habit entry)
- `GET /habits/{habit_id}/analytics`

## Goals

- `GET /goals`
- `POST /goals`
- `PATCH /goals/{goal_id}`

## Expenses

- `GET /transactions`
- `POST /transactions`
- `GET /categories`
- `POST /categories`
- `GET /budgets`
- `POST /budgets`

## Calendar

- `GET /events`
- `POST /events`
- `PATCH /events/{event_id}`
- `GET /reminders`

## AI Assistant (Planned)

- `POST /assistant/chat`
- `POST /assistant/summarize`
- `POST /assistant/suggest`

## Health & Meta

- `GET /healthz` (liveness)
- `GET /readyz` (readiness)

