DROP TABLE IF EXISTS public.photo_review CASCADE;
DROP TABLE IF EXISTS public.photo_submission CASCADE;
DROP TABLE IF EXISTS public.contest_participants CASCADE;
DROP TABLE IF EXISTS public.contest_jury CASCADE;
DROP TABLE IF EXISTS public.phase CASCADE;
DROP TABLE IF EXISTS public.contest CASCADE;
DROP TABLE IF EXISTS public.user_profile CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.app_user CASCADE;

CREATE TABLE IF NOT EXISTS app_user
(
    id       BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS roles
(
    role_id   INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    authority VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS user_roles
(
    role_id INTEGER NOT NULL
    CONSTRAINT fk_user_roles_roles
    REFERENCES roles,
    user_id BIGINT  NOT NULL
    CONSTRAINT fk_user_roles_app_user
    REFERENCES app_user,
    PRIMARY KEY (role_id, user_id)
    );

CREATE TABLE public.user_profile
(
    id         BIGINT       NOT NULL
        PRIMARY KEY
        CONSTRAINT fk_user_profile_app_user
            REFERENCES public.app_user (id),
    first_name VARCHAR(26),
    last_name  VARCHAR(26),
    rank       VARCHAR(255) NOT NULL
        CONSTRAINT user_profile_rank_check
            CHECK ((rank)::text = ANY
        (ARRAY ['JUNKIE'::text, 'ENTHUSIAST'::text, 'MASTER'::text, 'DICTATOR'::text, 'ORGANIZER'::text])),
    points     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contest
(
    id           BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title        VARCHAR(255),
    category     VARCHAR(255),
    is_private   BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT contest_category_check
    CHECK ((category)::TEXT = ANY
(ARRAY [
('LANDSCAPE'::character varying)::TEXT,
('PORTRAIT'::character varying)::TEXT,
('STREET'::character varying)::TEXT,
('WILDLIFE'::character varying)::TEXT,
('ABSTRACT'::character varying)::TEXT
    ])
    ),

    organizer_id BIGINT,
    FOREIGN KEY (organizer_id) REFERENCES user_profile (id),

    created_at   TIMESTAMP,
    updated_at   TIMESTAMP,
    start_date   TIMESTAMP,
    end_date     TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS contest_jury
(
    app_user_id BIGINT NOT NULL
    CONSTRAINT fk4qk84m8cfofr3n94sxcdkqisx
    REFERENCES app_user,
    contest_id  BIGINT NOT NULL
    CONSTRAINT fkin13dngkirloewxhmwup63ru3
    REFERENCES contest
);

CREATE TABLE IF NOT EXISTS contest_participants
(
    app_user_id BIGINT NOT NULL
    CONSTRAINT fkiegpoaqf7x6o2ikg2qosmw4fd
    REFERENCES app_user,
    contest_id  BIGINT NOT NULL
    CONSTRAINT fkscq5updfr2dg1lliqs7jn9b8k
    REFERENCES contest
);

CREATE TABLE IF NOT EXISTS phase
(
    contest_id      BIGINT       NOT NULL
    CONSTRAINT fkerf0b63ljn6gmyrwbj59ss3xj
    REFERENCES contest,
    end_date_time   TIMESTAMP    NOT NULL,
    id              BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    start_date_time TIMESTAMP    NOT NULL,
    type            VARCHAR(255) NOT NULL
    CONSTRAINT phase_type_check
    CHECK ((type)::TEXT = ANY
(ARRAY [('PHASE_ONE'::CHARACTER VARYING)::TEXT,
('PHASE_TWO'::CHARACTER VARYING)::TEXT
    ])),
    is_concluded    BOOLEAN      NOT NULL DEFAULT FALSE
    );

CREATE TABLE IF NOT EXISTS photo_submission
(
    contest_id BIGINT        NOT NULL
    CONSTRAINT fk5hrhv0v7taudvhdblbcltxa0q
    REFERENCES contest,
    creator_id BIGINT        NOT NULL
    CONSTRAINT fksyhreqese5oa357jomm3ak8xn
    REFERENCES user_profile,
    id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    story      VARCHAR(5000) NOT NULL,
    photo_url  VARCHAR(255)  NOT NULL,
    title      VARCHAR(255)  NOT NULL
    );

CREATE TABLE IF NOT EXISTS photo_review
(
    category_mismatch   BOOLEAN       NOT NULL,
    is_reviewed         BOOLEAN       NOT NULL,
    score               INTEGER       NOT NULL
    CONSTRAINT photo_review_score_check
    CHECK ((score >= 1) AND (score <= 10)),
    id                  BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    jury_id             BIGINT        NOT NULL
    CONSTRAINT fkdjbta6vwrx8etkgdpqnl25nw4
    REFERENCES user_profile,
    photo_submission_id BIGINT        NOT NULL
    CONSTRAINT fkmnnhvdnh20rfv6uhy0m3h2r0j
    REFERENCES photo_submission,
    comment             VARCHAR(5000) NOT NULL
    );

INSERT INTO public.roles (authority)
VALUES ('ADMIN'),
       ('USER'),
       ('MASTERUSER');

INSERT INTO "app_user" (username, password, email)
VALUES ('admin', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'admina@example.com');

-- Step 2: Assign the ADMIN role to the new user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.role_id
FROM "app_user" u,
     roles r
WHERE u.username = 'admin'
  AND r.authority = 'ADMIN';

INSERT INTO user_profile (id, first_name, last_name, rank)
SELECT u.id, 'Admin', 'User', 'ORGANIZER'
FROM app_user u
WHERE u.username = 'admin';

-- Insert 5 new users with the provided password for all
INSERT INTO "app_user" (username, password, email)
VALUES
    ('user1', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user1@example.com'),
    ('user2', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user2@example.com'),
    ('user3', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user3@example.com'),
    ('user4', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user4@example.com'),
    ('user5', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user5@example.com');

-- Assign USER role to each user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.role_id
FROM "app_user" u, roles r
WHERE r.authority = 'USER' AND u.username IN ('user1', 'user2', 'user3', 'user4', 'user5');

-- Insert profiles for each user
INSERT INTO user_profile (id, first_name, last_name, rank)
SELECT u.id, CONCAT('User', ROW_NUMBER() OVER ()), CONCAT('Test', ROW_NUMBER() OVER ()), 'ENTHUSIAST'
FROM app_user u
WHERE u.username IN ('user1', 'user2', 'user3', 'user4', 'user5');

-- Insert admin as jury for all contests and as the organizer
-- Step 1: Insert two contests organized by admin
INSERT INTO contest (title, category, organizer_id, created_at, updated_at, start_date, end_date)
VALUES
    ('Landscape Contest', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now(), now() + interval '10 minutes'),
    ('Portrait Contest', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now(), now() + interval '10 minutes');

-- Step 2: Create phases for each contest (Phase 1 ends in 3 minutes, Phase 2 in 5 minutes)
INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
SELECT c.id, now(), now() + interval '3 minutes', 'PHASE_ONE', FALSE
FROM contest c
WHERE c.title = 'Landscape Contest';

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
SELECT c.id, now() + interval '3 minutes', now() + interval '5 minutes', 'PHASE_TWO', FALSE
FROM contest c
WHERE c.title = 'Landscape Contest';

-- Phases for the second contest
INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
SELECT c.id, now(), now() + interval '3 minutes', 'PHASE_ONE', FALSE
FROM contest c
WHERE c.title = 'Portrait Contest';

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
SELECT c.id, now() + interval '3 minutes', now() + interval '5 minutes', 'PHASE_TWO', FALSE
FROM contest c
WHERE c.title = 'Portrait Contest';

-- Step 3: Admin is a jury member for all contests
INSERT INTO contest_jury (app_user_id, contest_id)
SELECT (SELECT id FROM app_user WHERE username = 'admin'), c.id
FROM contest c;

-- Step 4: Insert all other users as participants in both contests
INSERT INTO contest_participants (app_user_id, contest_id)
SELECT u.id, c.id
FROM app_user u, contest c
WHERE u.username IN ('user1', 'user2', 'user3', 'user4', 'user5');

-- Step 5: Insert photo submissions for each user in both contests
-- Submissions for the first contest (Landscape Contest)
DROP TABLE IF EXISTS public.photo_review CASCADE;
DROP TABLE IF EXISTS public.photo_submission CASCADE;
DROP TABLE IF EXISTS public.contest_participants CASCADE;
DROP TABLE IF EXISTS public.contest_jury CASCADE;
DROP TABLE IF EXISTS public.phase CASCADE;
DROP TABLE IF EXISTS public.contest CASCADE;
DROP TABLE IF EXISTS public.user_profile CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.app_user CASCADE;

CREATE TABLE IF NOT EXISTS app_user
(
    id       BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS roles
(
    role_id   INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    authority VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS user_roles
(
    role_id INTEGER NOT NULL
    CONSTRAINT fk_user_roles_roles
    REFERENCES roles,
    user_id BIGINT  NOT NULL
    CONSTRAINT fk_user_roles_app_user
    REFERENCES app_user,
    PRIMARY KEY (role_id, user_id)
    );

CREATE TABLE public.user_profile
(
    id         BIGINT       NOT NULL
        PRIMARY KEY
        CONSTRAINT fk_user_profile_app_user
            REFERENCES public.app_user (id),
    first_name VARCHAR(26),
    last_name  VARCHAR(26),
    rank       VARCHAR(255) NOT NULL
        CONSTRAINT user_profile_rank_check
            CHECK ((rank)::text = ANY
        (ARRAY ['JUNKIE'::text, 'ENTHUSIAST'::text, 'MASTER'::text, 'DICTATOR'::text, 'ORGANIZER'::text])),
    points     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contest
(
    id           BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title        VARCHAR(255),
    category     VARCHAR(255),
    is_private   BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT contest_category_check
    CHECK ((category)::TEXT = ANY
(ARRAY [
('LANDSCAPE'::character varying)::TEXT,
('PORTRAIT'::character varying)::TEXT,
('STREET'::character varying)::TEXT,
('WILDLIFE'::character varying)::TEXT,
('ABSTRACT'::character varying)::TEXT
    ])
    ),

    organizer_id BIGINT,
    FOREIGN KEY (organizer_id) REFERENCES user_profile (id),

    created_at   TIMESTAMP,
    updated_at   TIMESTAMP,
    start_date   TIMESTAMP,
    end_date     TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS contest_jury
(
    app_user_id BIGINT NOT NULL
    CONSTRAINT fk4qk84m8cfofr3n94sxcdkqisx
    REFERENCES app_user,
    contest_id  BIGINT NOT NULL
    CONSTRAINT fkin13dngkirloewxhmwup63ru3
    REFERENCES contest
);

CREATE TABLE IF NOT EXISTS contest_participants
(
    app_user_id BIGINT NOT NULL
    CONSTRAINT fkiegpoaqf7x6o2ikg2qosmw4fd
    REFERENCES app_user,
    contest_id  BIGINT NOT NULL
    CONSTRAINT fkscq5updfr2dg1lliqs7jn9b8k
    REFERENCES contest
);

CREATE TABLE IF NOT EXISTS phase
(
    contest_id      BIGINT       NOT NULL
    CONSTRAINT fkerf0b63ljn6gmyrwbj59ss3xj
    REFERENCES contest,
    end_date_time   TIMESTAMP    NOT NULL,
    id              BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    start_date_time TIMESTAMP    NOT NULL,
    type            VARCHAR(255) NOT NULL
    CONSTRAINT phase_type_check
    CHECK ((type)::TEXT = ANY
(ARRAY [('PHASE_ONE'::CHARACTER VARYING)::TEXT,
('PHASE_TWO'::CHARACTER VARYING)::TEXT
    ])),
    is_concluded    BOOLEAN      NOT NULL DEFAULT FALSE
    );

CREATE TABLE IF NOT EXISTS photo_submission
(
    contest_id BIGINT        NOT NULL
    CONSTRAINT fk5hrhv0v7taudvhdblbcltxa0q
    REFERENCES contest,
    creator_id BIGINT        NOT NULL
    CONSTRAINT fksyhreqese5oa357jomm3ak8xn
    REFERENCES user_profile,
    id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    story      VARCHAR(5000) NOT NULL,
    photo_url  VARCHAR(255)  NOT NULL,
    title      VARCHAR(255)  NOT NULL
    );

CREATE TABLE IF NOT EXISTS photo_review
(
    category_mismatch   BOOLEAN       NOT NULL,
    is_reviewed         BOOLEAN       NOT NULL,
    score               INTEGER       NOT NULL
    CONSTRAINT photo_review_score_check
    CHECK ((score >= 1) AND (score <= 10)),
    id                  BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    jury_id             BIGINT        NOT NULL
    CONSTRAINT fkdjbta6vwrx8etkgdpqnl25nw4
    REFERENCES user_profile,
    photo_submission_id BIGINT        NOT NULL
    CONSTRAINT fkmnnhvdnh20rfv6uhy0m3h2r0j
    REFERENCES photo_submission,
    comment             VARCHAR(5000) NOT NULL
    );

INSERT INTO public.roles (authority)
VALUES ('ADMIN'),
       ('USER'),
       ('MASTERUSER');

INSERT INTO "app_user" (username, password, email)
VALUES ('admin', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'admina@example.com');

-- Step 2: Assign the ADMIN role to the new user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.role_id
FROM "app_user" u,
     roles r
WHERE u.username = 'admin'
  AND r.authority = 'ADMIN';

INSERT INTO user_profile (id, first_name, last_name, rank)
SELECT u.id, 'Admin', 'User', 'ORGANIZER'
FROM app_user u
WHERE u.username = 'admin';

-- Insert 5 new users with the provided password for all
INSERT INTO "app_user" (username, password, email)
VALUES
    ('user1', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user1@example.com'),
    ('user2', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user2@example.com'),
    ('user3', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user3@example.com'),
    ('user4', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user4@example.com'),
    ('user5', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'user5@example.com');

-- Assign USER role to each user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.role_id
FROM "app_user" u, roles r
WHERE r.authority = 'USER' AND u.username IN ('user1', 'user2', 'user3', 'user4', 'user5');

-- Insert profiles for each user
INSERT INTO user_profile (id, first_name, last_name, rank)
SELECT u.id, CONCAT('User', ROW_NUMBER() OVER ()), CONCAT('Test', ROW_NUMBER() OVER ()), 'ENTHUSIAST'
FROM app_user u
WHERE u.username IN ('user1', 'user2', 'user3', 'user4', 'user5');

-- Insert admin as jury for all contests and as the organizer
-- Step 1: Insert two contests organized by admin
INSERT INTO contest (title, category, organizer_id, created_at, updated_at, start_date, end_date)
VALUES
    ('Landscape Contest', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now(), now() + interval '10 minutes'),
    ('Portrait Contest', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now(), now() + interval '10 minutes');

-- Step 2: Create phases for each contest (Phase 1 ends in 3 minutes, Phase 2 in 5 minutes)
INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
SELECT c.id, now(), now() + interval '3 minutes', 'PHASE_ONE', FALSE
FROM contest c
WHERE c.title = 'Landscape Contest';

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
SELECT c.id, now() + interval '3 minutes', now() + interval '5 minutes', 'PHASE_TWO', FALSE
FROM contest c
WHERE c.title = 'Landscape Contest';

-- Phases for the second contest
INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
SELECT c.id, now(), now() + interval '3 minutes', 'PHASE_ONE', FALSE
FROM contest c
WHERE c.title = 'Portrait Contest';

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
SELECT c.id, now() + interval '3 minutes', now() + interval '5 minutes', 'PHASE_TWO', FALSE
FROM contest c
WHERE c.title = 'Portrait Contest';

-- Step 3: Admin is a jury member for all contests
INSERT INTO contest_jury (app_user_id, contest_id)
SELECT (SELECT id FROM app_user WHERE username = 'admin'), c.id
FROM contest c;

-- Step 4: Insert all other users as participants in both contests
INSERT INTO contest_participants (app_user_id, contest_id)
SELECT u.id, c.id
FROM app_user u, contest c
WHERE u.username IN ('user1', 'user2', 'user3', 'user4', 'user5');

-- Step 5: Insert photo submissions for each user in both contests
-- Submissions for the first contest (Landscape Contest)
INSERT INTO photo_submission (contest_id, creator_id, story, photo_url, title)
SELECT c.id, u.id, 'A beautiful landscape.', 'http://example.com/photo1.jpg', 'Amazing Landscape'
FROM contest c, user_profile u
WHERE c.title = 'Landscape Contest'
  AND u.id IN (SELECT id FROM app_user WHERE username IN ('user1', 'user2', 'user3', 'user4', 'user5'));
-- Insert reviews for Contest 1 (Landscape Contest)
-- User1 and User2 share the first position
INSERT INTO photo_review (category_mismatch, is_reviewed, score, jury_id, photo_submission_id, comment)
SELECT FALSE, TRUE, 9, (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), p.id, 'Great job, you share first place!'
FROM photo_submission p
WHERE p.contest_id = (SELECT id FROM contest WHERE title = 'Landscape Contest')
  AND p.creator_id IN (SELECT id FROM app_user WHERE username IN ('user1', 'user2'));

-- User3 gets second place
INSERT INTO photo_review (category_mismatch, is_reviewed, score, jury_id, photo_submission_id, comment)
SELECT FALSE, TRUE, 8, (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), p.id, 'Nice job, second place!'
FROM photo_submission p
WHERE p.contest_id = (SELECT id FROM contest WHERE title = 'Landscape Contest')
  AND p.creator_id = (SELECT id FROM app_user WHERE username = 'user3');

-- User4 gets third place
INSERT INTO photo_review (category_mismatch, is_reviewed, score, jury_id, photo_submission_id, comment)
SELECT FALSE, TRUE, 7, (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), p.id, 'Good effort, third place.'
FROM photo_submission p
WHERE p.contest_id = (SELECT id FROM contest WHERE title = 'Landscape Contest')
  AND p.creator_id = (SELECT id FROM app_user WHERE username = 'user4');

-- Insert reviews for Contest 2 (Portrait Contest)
-- User3 leads with more than twice the points of User1 (the second place)
INSERT INTO photo_review (category_mismatch, is_reviewed, score, jury_id, photo_submission_id, comment)
SELECT FALSE, TRUE, 10, (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), p.id, 'Amazing, you lead with more than double the score!'
FROM photo_submission p
WHERE p.contest_id = (SELECT id FROM contest WHERE title = 'Portrait Contest')
  AND p.creator_id = (SELECT id FROM app_user WHERE username = 'user3');

-- User1 is in second place
INSERT INTO photo_review (category_mismatch, is_reviewed, score, jury_id, photo_submission_id, comment)
SELECT FALSE, TRUE, 4, (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), p.id, 'Good effort, second place.'
FROM photo_submission p
WHERE p.contest_id = (SELECT id FROM contest WHERE title = 'Portrait Contest')
  AND p.creator_id = (SELECT id FROM app_user WHERE username = 'user1');

-- User2 is in third place
INSERT INTO photo_review (category_mismatch, is_reviewed, score, jury_id, photo_submission_id, comment)
SELECT FALSE, TRUE, 3, (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), p.id, 'Nice effort, third place.'
FROM photo_submission p
WHERE p.contest_id = (SELECT id FROM contest WHERE title = 'Portrait Contest')
  AND p.creator_id = (SELECT id FROM app_user WHERE username = 'user2');

-- User4 gets fourth place
INSERT INTO photo_review (category_mismatch, is_reviewed, score, jury_id, photo_submission_id, comment)
SELECT FALSE, TRUE, 2, (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), p.id, 'Good try, fourth place.'
FROM photo_submission p
WHERE p.contest_id = (SELECT id FROM contest WHERE title = 'Portrait Contest')
  AND p.creator_id = (SELECT id FROM app_user WHERE username = 'user4');

-- User5 does not get reviewed in Contest 2
