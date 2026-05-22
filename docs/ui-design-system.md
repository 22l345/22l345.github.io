# UI Design System (Phase 1)

Goal: a calm, premium, minimal UI with strong hierarchy and predictable spacing, supporting light/dark modes.

## Foundations

- Tailwind CSS with CSS variables for theme tokens.
- shadcn/ui as the component baseline.
- Framer Motion for subtle transitions (page, panels, list reordering).

## Color Tokens (Planned)

Use semantic tokens (not raw colors) so themes can evolve:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--muted`, `--muted-foreground`
- `--primary`, `--primary-foreground`
- `--accent`, `--accent-foreground`
- `--border`, `--ring`
- status: `--success`, `--warning`, `--danger`

## Typography (Planned)

Hierarchy:

- Display: dashboard headers
- H1/H2: page titles / section headers
- Body: primary content
- Caption: metadata, timestamps

Rules:

- never use more than 2 font families
- use consistent leading for readability

## Spacing & Layout

- 8px spacing grid (Tailwind defaults)
- Max content width for reading views (notes)
- Dense but breathable lists (tasks)
- Persistent left sidebar on desktop, bottom nav on mobile

## Component Architecture

- Primitives: buttons, inputs, dropdowns, dialogs, popovers
- Composites: task row, note card, habit heatmap, goal progress
- Shell: app layout, sidebar, command palette, quick add modal

## Motion

Use motion to reduce cognitive load:

- 150–250ms transitions for panel open/close
- subtle hover states, focus rings
- list reordering animations (kanban, priorities)

