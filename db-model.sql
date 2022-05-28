create extension "uuid-ossp"

create table users(
    user_id uuid default uuid_genrate_uuid()
);