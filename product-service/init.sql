BEGIN;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE products (id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
                                                   title TEXT NOT NULL,
                                                              description TEXT, price INT);


CREATE TABLE stocks
  (product_id uuid PRIMARY KEY REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
                                                                                   count INT);


INSERT INTO products (title, description, price)
VALUES ('test_title_1',
        'test_description_1',
        33), ('test_title_2',
              'test_description_2',
              25), ('test_title_3',
                    'test_description_3',
                    52), ('test_title_4',
                          'test_description_4',
                          11);


INSERT INTO stocks (product_id, count)
VALUES (
          (SELECT id
           FROM products
           WHERE title='test_title_1'
           LIMIT 1), 3), (
                            (SELECT id
                             FROM products
                             WHERE title='test_title_2'
                             LIMIT 1), 2), (
                                              (SELECT id
                                               FROM products
                                               WHERE title='test_title_3'
                                               LIMIT 1), 3), (
                                                                (SELECT id
                                                                 FROM products
                                                                 WHERE title='test_title_4'
                                                                 LIMIT 1), 7);


COMMIT;

