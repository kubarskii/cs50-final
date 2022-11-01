DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS room_members;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS messages;

CREATE TABLE regions
(
    id         SERIAL PRIMARY KEY,
    max_length smallint DEFAULT NULL,
    code       smallint DEFAULT NULL -- external key
);

CREATE TABLE room_members
(
    room_id int NOT NULL,
    user_id int NOT NULL
);

CREATE TABLE rooms
(
    id   SERIAL PRIMARY KEY,
    name char NOT NULL
);

CREATE TABLE users
(
    id            bigint generated always as identity,
    login         varchar NOT NULL,
    password      varchar NOT NULL,
    name            char(150) DEFAULT NULL,
    surname         char(150) DEFAULT NULL,
    phone           int       DEFAULT NULL,
    phone_region_id int       DEFAULT NULL
);

ALTER TABLE users
    ADD CONSTRAINT pkUsers PRIMARY KEY (id);

CREATE UNIQUE INDEX akUsersLogin ON users (login);

CREATE TABLE session
(
    id    bigint generated always as identity,
    user  integer     NOT NULL,
    token varchar(64) NOT NULL,
    ip    varchar(45) NOT NULL,
    data  text
);

ALTER TABLE session
    ADD CONSTRAINT pkSession PRIMARY KEY (id);

CREATE UNIQUE INDEX akSession ON session (token);

ALTER TABLE session
    ADD CONSTRAINT fkSessionUserId FOREIGN KEY (user) REFERENCES users (id) ON DELETE CASCADE;

CREATE TABLE messages
(
    id          SERIAL PRIMARY KEY,
    user_id     int  NOT NULL,
    message     text NOT NULL,
    receiver_id int
)
