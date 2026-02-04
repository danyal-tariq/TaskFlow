# Project Roadmap: Issue Tracker (Linear Clone)

**Target Level:** Senior Frontend / Product Engineer
**Core Focus:** UX/UI, Optimistic Updates, Keyboard Navigation, and High-Performance Animations.
**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Supabase, TanStack Query, Framer Motion.

## Phase 1: Foundation & Infrastructure ✅

**Goal:** Set up a modern, type-safe development environment with strict linting.

- [x] **Initialize Project:** Create Next.js app with TypeScript, ESLint, and Tailwind CSS.
- [x] **Configure Design System:**
    - [x] Install **shadcn/ui** for accessible base components.
    - [x] Configure `globals.css` for CSS variables (focus on Dark Mode variables).
    - [x] Set up the font family (Inter or a custom geometric sans-serif).
- [x] **State Management Setup:**
    - [x] Install **TanStack Query (React Query)** for server state management.
    - [x] Install **Zustand** for complex client-side state (global modals, user preferences).
- [x] **Iconography:** Install `lucide-react` for consistent SVG icons.

## Phase 2: Database & Authentication (Supabase) ✅

**Goal:** Implement a multi-tenant schema with robust security.

- [x] **Supabase Setup:** Initialize a new Supabase project.
- [x] **Authentication:**
    - [x] Configure GitHub and Email/Password authentication.
    - [x] Create a `Middleware.ts` file to protect dashboard routes.
- [x] **Schema Design (SQL/Migrations):**
    - [x] Create `profiles` table (linked to `auth.users`).
    - [x] Create `teams` table (workspace).
    - [x] Create `issues` table (title, description, status, priority).
    - [x] Create `statuses` table (Backlog, Todo, In Progress, Done).
- [x] **Row Level Security (RLS):**
    - [x] Write policies ensuring users can only see issues in their assigned teams.
- [x] **Type Generation:** Configure Supabase CLI to generate TypeScript types from the database schema automatically.

## Phase 3: Application Shell & Layout ✅

**Goal:** Create the persistent UI structure that feels like a native app.

- [x] **Sidebar Layout:**
    - [x] Build a collapsible sidebar with navigation links (Inbox, Issues, Views).
    - [x] Implement active state styling.
- [x] **User Dropdown:** Create a profile menu with theme toggle (System/Dark/Light) and logout.
- [x] **Team Switcher:** UI to switch between different workspaces/teams.
- [x] **Animations:** Use **Framer Motion** for subtle layout transitions when the sidebar collapses/expands.

## Phase 4: Core Issue Management ✅

**Goal:** Build the CRUD functionality with instant feedback.

- [x] **Issue Creation Modal:**
    - [x] Create a global modal triggered by `C` key (keyboard shortcut).
    - [x] Implement a rich text editor (Tiptap or simple textarea) for descriptions.
    - [x] Use **React Hook Form** + **Zod** for validation.
- [x] **Issue List View:**
    - [x] Create a virtualized list (if anticipating many issues) or standard table.
    - [x] Display issue identifier (e.g., TEAM-12), title, and priority icon.
- [x] **Issue Detail View:**
    - [x] Create a dynamic route `/team/[issueId]`.
    - [x] Implement editable fields (click to edit title/description).

## Phase 5: The "Senior" UX Features (Critical)

**Goal:** Differentiate this project from a standard CRUD app using advanced UX patterns.

- [x] **Optimistic Updates (TanStack Query):**
    - [x] Implementation: When a user creates/updates an issue, update the UI immediately before the server responds.
    - [x] Rollback logic: Revert UI if the server request fails.
- [ ] **Command Palette (Cmd+K):**
    - [ ] Install `cmdk` package.
    - [ ] Implement global search for Issues.
    - [ ] Implement actions (Change Theme, Create Issue, Go to Team).
- [x] **Keyboard Shortcuts:**
    - [x] ~~Install `react-hotkeys-hook`~~ (Built custom hook).
    - [x] Bind `C` to Create Issue.
    - [x] Bind `Esc` to close modals.
    - [x] Bind `Ctrl+Enter` to submit forms.
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

- [x] **Loading States:** Create Skeleton screens (shimmer effect) for initial data load.
- [x] **Empty States:** Design helpful illustrations when a list has no issues.
- [ ] **Metadata:** Configure SEO tags and Open Graph images.
- [ ] **CI/CD:**
    - [ ] Set up GitHub Actions to run `npm run lint` and `npm run type-check` on push.
- [ ] **Deployment:** Deploy to **Vercel**. Configure environment variables.