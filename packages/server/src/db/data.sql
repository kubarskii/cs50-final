INSERT INTO users (login,
                   password,
                   name,
                   email,
                   surname,
                   phone,
                   salt)
VALUES ('admin',
        '3563c4267dc7f63e883447ced257c847d90684621775b126aefd05ccb0ef625ab52bce5e0226a7090e8fb493a0248dfdadfb139c247215dd576ac127c3196c26',
        'Aleksandr',
        'sasha.kub95@gmail.com',
        'Kubarskii',
        '905518111928',
        'c3ce59eb91bfdd32029decc96e74992a');

INSERT INTO room_types (name)
VALUES ('chat'),
       ('group'),
       ('channel');
