# TaskFlow — Issue Tracker

TaskFlow is a keyboard-centric issue tracker focused on optimistic UI, speed, and productivity.

Built with Next.js, TypeScript, Tailwind CSS and Supabase. It provides a small set of accessible UI primitives, a command palette, and optimistic mutations for a snappy developer and user experience.

## Quick Start

Prerequisites:
- Node.js 18+
- npm
- Docker (optional, for local Supabase)

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Optional: start local Supabase and push migrations:

```bash
npx supabase start
npx supabase db push
```

## Tech Stack

- Next.js (App Router)
- TypeScript (strict)
- Tailwind CSS 4
- Supabase (Postgres + Auth + RLS)
- TanStack Query + Zustand
- React Hook Form + Zod
- sonner (toasts), cmdk (command palette)

## Key Features

- Command palette (Cmd/Ctrl+K) with search and quick actions
- Global Create Issue modal (keyboard `C`) with optimistic updates
- Toast notifications for mutation lifecycle (loading → success/error)
- Issue list, detail view with inline editing and simple metadata

## Important Files / Folders

- `src/app` — Next.js routes and layouts
- `src/components` — UI components and small shadcn-like primitives
- `src/components/layout` — Header, Sidebar, Command Palette wrappers
- `src/components/issues` — Issue list, card, detail and modal components
- `src/hooks` — Query and mutation hooks, keyboard helpers
- `src/server/actions` — Server-side CRUD actions for issues
- `src/lib/validations` — Zod schemas for input validation
- `src/stores` — Zustand UI store

## Environment

Create a `.env.local` with required variables (example):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing & Lint

- Lint: `npm run lint`
- Playwright is available for e2e tests if configured

## Contributing

1. Fork and create a feature branch: `feature/<short-desc>`
2. Keep commits small and focused (1–2 line messages).
3. Open a PR with a short description and testing notes.

## License

MIT

---

I