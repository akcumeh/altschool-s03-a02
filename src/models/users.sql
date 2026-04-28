CREATE TABLE users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    username text NOT NULL,
    email text NOT NULL UNIQUE,
    date_of_birth date NOT NULL,
    created_at timestamptz DEFAULT now()
);

