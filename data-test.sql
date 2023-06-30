DROP DATABASE IF EXISTS usersdb_test;

CREATE DATABASE usersdb_test;

-- \c usersdb_test; connects to usersdb_test
\c usersdb_test;             

DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL
);