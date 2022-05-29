CREATE extension "uuid-ossp"

CREATE TABLE users(
    user_id uuid default uuid_genrate_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password TEXT,
    PRIMARY KEY (user_id)
);

CREATE TABLE todo(
    todo_id uuid default uuid_genrate_uuid(),
    user_id uuid ,
    description TEXT NOT NULL,
    title TEXT,
    completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (todo_id)
);



