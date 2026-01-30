# Project Roadmap: Issue Tracker (Linear Clone)

**Target Level:** Senior Frontend / Product Engineer
**Core Focus:** UX/UI, Optimistic Updates, Keyboard Navigation, and High-Performance Animations.
**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Supabase, TanStack Query, Framer Motion.

## Phase 1: Foundation & Infrastructure

**Goal:** Set up a modern, type-safe development environment with strict linting.

- [ ] **Initialize Project:** Create Next.js app with TypeScript, ESLint, and Tailwind CSS.
- [ ] **Configure Design System:**
    - [ ] Install **shadcn/ui** for accessible base components.
    - [ ] Configure `globals.css` for CSS variables (focus on Dark Mode variables).
    - [ ] Set up the font family (Inter or a custom geometric sans-serif).
- [ ] **State Management Setup:**
    - [ ] Install **TanStack Query (React Query)** for server state management.
    - [ ] Install **Zustand** for complex client-side state (global modals, user preferences).
- [ ] **Iconography:** Install `lucide-react` for consistent SVG icons.

## Phase 2: Database & Authentication (Supabase)

**Goal:** Implement a multi-tenant schema with robust security.

- [ ] **Supabase Setup:** Initialize a new Supabase project.
- [ ] **Authentication:**
    - [ ] Configure GitHub and Email/Password authentication.
    - [ ] Create a `Middleware.ts` file to protect dashboard routes.
- [ ] **Schema Design (SQL/Migrations):**
    - [ ] Create `profiles` table (linked to `auth.users`).
    - [ ] Create `teams` table (workspace).
    - [ ] Create `issues` table (title, description, status, priority).
    - [ ] Create `statuses` table (Backlog, Todo, In Progress, Done).
- [ ] **Row Level Security (RLS):**
    - [ ] Write policies ensuring users can only see issues in their assigned teams.
- [ ] **Type Generation:** Configure Supabase CLI to generate TypeScript types from the database schema automatically.

## Phase 3: Application Shell & Layout

**Goal:** Create the persistent UI structure that feels like a native app.

- [ ] **Sidebar Layout:**
    - [ ] Build a collapsible sidebar with navigation links (Inbox, Issues, Views).
    - [ ] Implement active state styling.
- [ ] **User Dropdown:** Create a profile menu with theme toggle (System/Dark/Light) and logout.
- [ ] **Team Switcher:** UI to switch between different workspaces/teams.
- [ ] **Animations:** Use **Framer Motion** for subtle layout transitions when the sidebar collapses/expands.

## Phase 4: Core Issue Management

**Goal:** Build the CRUD functionality with instant feedback.

- [ ] **Issue Creation Modal:**
    - [ ] Create a global modal triggered by `C` key (keyboard shortcut).
    - [ ] Implement a rich text editor (Tiptap or simple textarea) for descriptions.
    - [ ] Use **React Hook Form** + **Zod** for validation.
- [ ] **Issue List View:**
    - [ ] Create a virtualized list (if anticipating many issues) or standard table.
    - [ ] Display issue identifier (e.g., TEAM-12), title, and priority icon.
- [ ] **Issue Detail View:**
    - [ ] Create a dynamic route `/team/[issueId]`.
    - [ ] Implement editable fields (click to edit title/description).

## Phase 5: The "Senior" UX Features (Critical)

**Goal:** Differentiate this project from a standard CRUD app using advanced UX patterns.

- [ ] **Optimistic Updates (TanStack Query):**
    - [ ] Implementation: When a user creates/updates an issue, update the UI immediately before the server responds.
    - [ ] Rollback logic: Revert UI if the server request fails.
- [ ] **Command Palette (Cmd+K):**
    - [ ] Install `cmdk` package.
    - [ ] Implement global search for Issues.
    - [ ] Implement actions (Change Theme, Create Issue, Go to Team).
- [ ] **Keyboard Shortcuts:**
    - [ ] Install `react-hotkeys-hook`.
    - [ ] Bind `C` to Create Issue.
    - [ ] Bind `Esc` to close modals.
    - [ ] Bind `Ctrl+Enter` to submit forms.
- [ ] **Toast Notifications:** Implement a custom toast system (or use `sonner`) for success/error states, stacked in the corner.

## Phase 6: Kanban Board & Drag-and-Drop

**Goal:** Demonstrate complex interaction handling.

- [ ] **Kanban Setup:**
    - [ ] Install `@dnd-kit/core` and `@dnd-kit/sortable` (Modern, accessible alternative to generic DnD).
- [ ] **Board Column Layout:** Group issues by their Status (Todo, In Progress, Done).
- [ ] **Drag Implementation:**
    - [ ] Allow dragging cards between columns.
    - [ ] Update the issue status in the database on drop.
    - [ ] **Challenge:** Ensure the UI doesn't flicker during the database update (Optimistic UI is mandatory here).

## Phase 7: Filtering & Views

**Goal:** Handle client-side vs. server-side data manipulation.

- [ ] **Filter Engine:**
    - [ ] Create a popover menu to filter by Priority, Assignee, or Status.
    - [ ] reflect filters in the URL query parameters (e.g., `?priority=high`) so views can be shared.
- [ ] **View Modes:** Toggle between List View and Board View, persisting the preference in local storage.

## Phase 8: Final Polish & Deployment

**Goal:** Production readiness.

- [ ] **Loading States:** Create Skeleton screens (shimmer effect) for initial data load.
- [ ] **Empty States:** Design helpful illustrations when a list has no issues.
- [ ] **Metadata:** Configure SEO tags and Open Graph images.
- [ ] **CI/CD:**
    - [ ] Set up GitHub Actions to run `npm run lint` and `npm run type-check` on push.
- [ ] **Deployment:** Deploy to **Vercel**. Configure environment variables.