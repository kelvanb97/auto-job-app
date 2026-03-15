create schema if not exists app;

-- Revoke access from lower-privilege roles
revoke all on schema app from anon, authenticated;

-- Grant full access to service_role
grant usage, create on schema app to service_role;

-- Default privileges so future tables/sequences/functions automatically grant to service_role
alter default privileges in schema app
    grant all on tables to service_role;

alter default privileges in schema app
    grant all on sequences to service_role;

alter default privileges in schema app
    grant all on functions to service_role;

comment on schema app is 'Application schema accessible only via service_role.';
