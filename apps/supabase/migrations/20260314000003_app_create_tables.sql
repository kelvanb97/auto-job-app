-- =============================================================
-- SHARED: updated_at trigger function
-- =============================================================

create or replace function app.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- =============================================================
-- COMPANY
-- =============================================================

create table app.company (
  id            uuid primary key default gen_random_uuid(),

  -- core info
  name          text not null,
  website       text,
  linkedin_url  text,

  -- context
  size          text,
  stage         text,
  industry      text,

  -- timestamps
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),

  -- notes
  notes         text
);

create trigger set_updated_at
before update on app.company
for each row
execute function app.set_updated_at();

create index idx_company_name on app.company (name);


-- =============================================================
-- ROLE
-- =============================================================

create table app.role (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references app.company(id) on delete cascade,

  -- core info
  title         text not null,
  url           text,
  source_url    text,
  application_url text,
  description   text,
  source        text,       -- 'greenhouse', 'lever', 'wellfound', 'remoteok', etc.
  location_type text,       -- 'remote', 'hybrid', 'onsite'
  location      text,       -- 'Seattle, WA' etc. if onsite/hybrid
  salary_min    integer,
  salary_max    integer,

  -- status
  status        text not null default 'pending',
  -- pending → applied → wont_do

  -- timestamps
  posted_at     timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),

  -- notes
  notes         text
);

create trigger set_updated_at
before update on app.role
for each row
execute function app.set_updated_at();

create index idx_role_company_id on app.role (company_id);
create index idx_role_status on app.role (status);
create index idx_role_status_created_at on app.role (status, created_at desc);
create index idx_role_url on app.role (url);


-- =============================================================
-- SCORE
-- =============================================================

create table app.score (
  id          uuid primary key default gen_random_uuid(),
  role_id     uuid unique references app.role(id) on delete cascade,

  -- scoring
  score       integer not null,   -- 0-100
  positive    text[],             -- array of reasons
  negative    text[],             -- array of reasons

  -- timestamps
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create trigger set_updated_at
before update on app.score
for each row
execute function app.set_updated_at();

create index idx_score_role_id on app.score (role_id);


-- =============================================================
-- PERSON
-- =============================================================

create table app.person (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references app.company(id) on delete set null,

  -- core info
  name          text not null,
  title         text,
  email         text,
  linkedin_url  text,

  -- timestamps
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),

  -- notes
  notes         text
);

create trigger set_updated_at
before update on app.person
for each row
execute function app.set_updated_at();

create index idx_person_company_id on app.person (company_id);


-- =============================================================
-- ROLE_PERSON (join table)
-- =============================================================

create table app.role_person (
  role_id       uuid references app.role(id) on delete cascade,
  person_id     uuid references app.person(id) on delete cascade,
  relationship  text,   -- 'recruiter', 'hiring_manager', 'engineer', 'referral', etc.
  primary key (role_id, person_id)
);

create index idx_role_person_role_id on app.role_person (role_id);
create index idx_role_person_person_id on app.role_person (person_id);


-- =============================================================
-- INTERACTION
-- =============================================================

create table app.interaction (
  id          uuid primary key default gen_random_uuid(),
  role_id     uuid references app.role(id) on delete cascade,
  person_id   uuid references app.person(id) on delete set null,

  -- core info
  type        text not null,  -- 'linkedin_touch', 'email', 'call', 'interview', 'note'
  notes       text,

  -- timestamps
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create trigger set_updated_at
before update on app.interaction
for each row
execute function app.set_updated_at();

create index idx_interaction_role_id on app.interaction (role_id);
create index idx_interaction_person_id on app.interaction (person_id);


-- =============================================================
-- APPLICATION
-- =============================================================

create table app.application (
  id                uuid primary key default gen_random_uuid(),
  role_id           uuid references app.role(id) on delete cascade,

  -- status
  status            text not null default 'submitted',
  -- submitted → outreach_sent → phone_screen → interview → offer → rejected

  -- documents
  resume_path        text,
  cover_letter_path  text,

  -- timestamps
  submitted_at      timestamptz default now(),
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),

  -- notes
  notes             text
);

create trigger set_updated_at
before update on app.application
for each row
execute function app.set_updated_at();

create index idx_application_role_id on app.application (role_id);
create index idx_application_status on app.application (status);
