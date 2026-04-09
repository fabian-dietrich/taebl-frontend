# Taebl — Frontend

React client for [Taebl](https://taebl.fabiandietri.ch), a restaurant reservation management interface.

**Backend repo:** [taebl-backend](https://github.com/fabian-dietrich/taebl-backend)

## Live demo

[taebl.fabiandietri.ch](https://taebl.fabiandietri.ch)

> The live site runs in **demo mode** — you can create, edit, and delete reservations, but all changes are session-only and reset on page reload. No data is written to the database.

## Tech stack

React 19, Mantine 8, TypeScript, Vite.

## Features

- Schedule grid showing 12 tables × 12 half-hour time slots (17:00–22:30)
- Today/tomorrow day toggle
- Click any empty cell to create a reservation, click an occupied cell to edit or cancel
- Booking conflict detection with overlap checking
- Duration-aware reservations that span multiple time slots
- Demo mode with client-side state management — initial data loads from the API, then all mutations happen in-memory

## Local setup

```
bun install
bun run dev   # starts Vite dev server on localhost:5173
```

Note: The frontend fetches seed data from the production API on load. For fully local development, update `API_BASE_URL` in `src/services/api.ts` to point at a local backend instance.
