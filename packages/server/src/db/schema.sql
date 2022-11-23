DROP TABLE IF EXISTS statuses ;
DROP TABLE IF EXISTS not_received_messages;
DROP TABLE IF EXISTS room_members;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

CREATE TABLE statuses
(
    id         bigint generated always as identity,
    name       varchar NOT NULL
);

ALTER TABLE statuses
    ADD CONSTRAINT pkStatusId PRIMARY KEY (id);

CREATE TABLE rooms
(
    id         bigint generated always as identity,
    name       varchar NOT NULL,
    creator_id int     NOT NULL
);

ALTER TABLE rooms
    ADD CONSTRAINT pkRoom PRIMARY KEY (id);

CREATE TABLE users
(
    id       bigint generated always as identity,
    login    varchar NOT NULL,
    password varchar NOT NULL,
    email    varchar NOT NULL,
    name     varchar DEFAULT NULL,
    surname  varchar DEFAULT NULL,
    phone    varchar DEFAULT NULL,
    salt     varchar NOT NULL
);

ALTER TABLE users
    ADD CONSTRAINT pkUsers PRIMARY KEY (id);

ALTER TABLE rooms
    ADD CONSTRAINT fkCreatorId FOREIGN KEY (creator_id) REFERENCES users (id);

CREATE TABLE room_members
(
    room_id int NOT NULL,
    user_id int NOT NULL
);

ALTER TABLE room_members
    ADD CONSTRAINT fkRoomId FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE;

ALTER TABLE room_members
    ADD CONSTRAINT fkUserId FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE room_members
    ADD CONSTRAINT uniqueOneUserPerRoom UNIQUE (room_id, user_id);


CREATE UNIQUE INDEX akUsersLogin ON users (login);

CREATE TABLE session
(
    id      bigint generated always as identity,
    user_id integer     NOT NULL,
    token   varchar NOT NULL,
    ip      varchar NOT NULL
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
    receiver_id integer   DEFAULT NULL,  -- just to highlight user
    room_id     integer NOT NULL,
    created_at  timestamp DEFAULT now(), -- works in PG
    read        boolean   DEFAULT FALSE
);

ALTER TABLE messages
    ADD CONSTRAINT pkMessage PRIMARY KEY (id);

ALTER TABLE messages
    ADD CONSTRAINT fkSenderId FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE messages
    ADD CONSTRAINT fkRoomId FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE;

ALTER TABLE messages
    ADD CONSTRAINT fkReceiver FOREIGN KEY (receiver_id) REFERENCES users (id);

-- used for messages that were not sent by websockets because of lost connection
-- must be sent immediately after new connection established
-- must be deleted right after sent to the user
CREATE TABLE not_received_messages
(
    id         bigint generated always as identity,
    user_id    bigint NOT NULL,
    message_id bigint NOT NULL
);

ALTER TABLE not_received_messages
    ADD CONSTRAINT pkUnreadMessage PRIMARY KEY (id);

ALTER TABLE not_received_messages
    ADD CONSTRAINT fkUserId FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE not_received_messages
    ADD CONSTRAINT fkMessageId FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE;
