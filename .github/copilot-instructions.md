# TaskFlow - Copilot Instructions

> A high-performance, keyboard-centric issue tracker (Linear clone) emphasizing **Optimistic UI**, **Speed**, and **Productivity**.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router), TypeScript (Strict) |
| Styling | Tailwind CSS 4, shadcn/ui, lucide-react |
| Server State | TanStack Query v5 |
| Client State | Zustand |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| DnD | @dnd-kit |
| Commands | cmdk |
| Testing | Playwright |

## Core UX Principles

1. **Optimistic UI First** - Every mutation updates UI instantly via `onMutate`. Rollback on failure. No spinners for small actions.
2. **Keyboard Centric** - Navigate, create (`C`), search (`Cmd+K`) without mouse.
3. **URL as State** - Filters, views, modals reflected in URL for shareability.

## Database Schema

```sql
-- profiles (extends auth.users)
id: uuid PK, email: text, full_name: text, avatar_url: text

-- teams (workspaces)
id: uuid PK, name: text, slug: text UNIQUE

-- issues
id: uuid PK, identifier: text, title: text, description: text,
status: enum('backlog','todo','in_progress','done','canceled'),
priority: enum('no_priority','low','medium','high','urgent'),
team_id: FK->teams, creator_id: FK->profiles,
sort_order: float  -- For Kanban ordering

-- issue_assignees (many-to-many for multiple assignees)
id: uuid PK, issue_id: FK->issues, assignee_id: FK->profiles,
unique(issue_id, assignee_id)

-- comments
id: uuid PK, issue_id: FK->issues, user_id: FK->profiles, body: text
```

## Folder Structure

```
src/
├── app/
│   ├── (auth)/             # Login/Register (grouped)
│   ├── (dashboard)/        # Protected routes
│   │   ├── [teamSlug]/     # Dynamic team route
│   │   │   ├── issues/     # List/Kanban view
│   │   │   └── settings/
│   │   └── layout.tsx      # Sidebar + Shell
│   └── api/                # Route Handlers
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── layout/             # Sidebar, Header, Shell
│   ├── issues/             # IssueCard, IssueList, IssueBoard
│   └── modals/             # CreateIssueModal, CommandMenu
├── hooks/                  # useKeyboardShortcut, useOptimisticIssue
├── lib/                    # Supabase client, utils
├── server/                 # Server Actions, DB queries
├── stores/                 # Zustand stores
└── types/                  # Global TS definitions
```

## Coding Standards

- **Server Components** for data fetching; `"use client"` only for interactivity
- **No `any`** - Always export interfaces/types
- **Tailwind utilities** - Avoid CSS modules unless complex animations
- **Absolute imports** - Use `@/components/...`
- **Icons** - Always use `lucide-react`

## Critical Pattern: Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateIssue,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ['issues', teamSlug] })
    const previous = queryClient.getQueryData(['issues', teamSlug])
    queryClient.setQueryData(['issues', teamSlug], (old) => /* update */)
    return { previous }
  },
  onError: (err, vars, context) => {
    queryClient.setQueryData(['issues', teamSlug], context?.previous)
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['issues'] })
})
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `C` | Create issue modal |
| `Cmd/Ctrl+K` | Command palette |
| `Esc` | Close modals |
| `Ctrl+Enter` | Submit forms |

## Development Commands

```bash
npm run dev              # Next.js dev server
npx supabase start       # Local Supabase (Docker required)
npx supabase db push     # Apply migrations
npx supabase gen types typescript --project-id <id> > src/types/database.ts
```

## Key Decisions

- **Theme Toggle:** Support System/Light/Dark themes with user preference persistence
- **Virtualization:** Consider for issue lists if count exceeds ~100
- **DnD flickering:** Kanban board MUST use optimistic updates to prevent visual jumps
