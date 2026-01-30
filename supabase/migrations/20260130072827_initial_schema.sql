-- profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text
);

-- teams (workspaces)
create table teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null
);

-- issues
create table issues (
  id uuid default gen_random_uuid() primary key,
  identifier text not null,
  title text not null,
  description text,
  status text check (status in ('backlog','todo','in_progress','done','canceled')),
  priority text check (priority in ('no_priority','low','medium','high','urgent')),
  team_id uuid references teams on delete cascade,
  creator_id uuid references profiles on delete cascade,
  sort_order float
);

-- issue_assignees (many-to-many for multiple assignees)
create table issue_assignees (
  id uuid default gen_random_uuid() primary key,
  issue_id uuid references issues on delete cascade not null,
  assignee_id uuid references profiles on delete cascade not null,
  unique(issue_id, assignee_id)
);

-- comments
create table comments (
  id uuid default gen_random_uuid() primary key,
  issue_id uuid references issues on delete cascade not null,
  user_id uuid references profiles on delete cascade not null,
  body text not null
);