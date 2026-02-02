-- Enable RLS on all tables
alter table profiles enable row level security;
alter table teams enable row level security;
alter table issues enable row level security;
alter table issue_assignees enable row level security;
alter table comments enable row level security;

-- Profiles: Users can read all profiles, update their own
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Teams: For now, all authenticated users can see all teams
create policy "Authenticated users can view teams"
  on teams for select to authenticated using (true);

-- Issues: Users can view issues in teams they belong to
create policy "Users can view issues"
  on issues for select to authenticated using (true);

create policy "Users can create issues"
  on issues for insert to authenticated with check (true);

create policy "Users can update issues"
  on issues for update to authenticated using (true);

-- Comments: Similar policies
create policy "Users can view comments"
  on comments for select to authenticated using (true);

create policy "Users can create comments"
  on comments for insert to authenticated 
  with check (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();