DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS room_members;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS rooms;

CREATE TABLE regions
(
    id         SERIAL PRIMARY KEY,
    max_length smallint DEFAULT NULL,
    code       smallint DEFAULT NULL -- external key
);

CREATE TABLE rooms
(
    id   bigint generated always as identity,
    name varchar NOT NULL
);

ALTER TABLE rooms
    ADD CONSTRAINT pkRoom PRIMARY KEY (id);

CREATE TABLE users
(
    id              bigint generated always as identity,
    login           varchar NOT NULL,
    password        varchar NOT NULL,
    email           varchar NOT NULL,
    name            varchar DEFAULT NULL,
    surname         varchar DEFAULT NULL,
    phone           int     DEFAULT NULL,
    phone_region_id int     DEFAULT NULL
);

ALTER TABLE users
    ADD CONSTRAINT pkUsers PRIMARY KEY (id);

CREATE TABLE room_members
(
    room_id int NOT NULL,
    user_id int NOT NULL
);

ALTER TABLE room_members
    ADD CONSTRAINT fkRoomId FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE;

ALTER TABLE room_members
    ADD CONSTRAINT fkUserId FOREIGN KEY (user_id) REFERENCES users (id);



CREATE UNIQUE INDEX akUsersLogin ON users (login);

CREATE TABLE session
(
    id      bigint generated always as identity,
    user_id integer     NOT NULL,
    token   varchar(64) NOT NULL,
    ip      varchar(45) NOT NULL,
    data    text
);

ALTER TABLE session
    ADD CONSTRAINT pkSession PRIMARY KEY (id);

CREATE UNIQUE INDEX akSession ON session (token);

ALTER TABLE session
    ADD CONSTRAINT fkSessionUserId FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

CREATE TABLE messages
(
    id          bigint generated always as identity,
    user_id     integer NOT NULL,
    message     text    NOT NULL,
    receiver_id integer DEFAULT NULL, -- just to highlight user
    room_id     integer NOT NULL
);

ALTER TABLE messages
    ADD CONSTRAINT pkMessage PRIMARY KEY (id);

ALTER TABLE messages
    ADD CONSTRAINT fkSenderId FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE messages
    ADD CONSTRAINT fkRoomId FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE;

ALTER TABLE messages
    ADD CONSTRAINT fkReceiver FOREIGN KEY (receiver_id) REFERENCES users (id);
