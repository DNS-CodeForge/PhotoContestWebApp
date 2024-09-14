-- Step 1: Drop all relevant tables
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

-- Step 2: Create necessary tables
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
    id                  BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title               VARCHAR(255),
    category            VARCHAR(255),
    is_private          BOOLEAN NOT NULL DEFAULT FALSE,
    organizer_id        BIGINT,
    created_at          TIMESTAMP,
    updated_at          TIMESTAMP,
    start_date          TIMESTAMP,
    submission_end_date TIMESTAMP,
    end_date            TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES user_profile (id)
);

CREATE TABLE IF NOT EXISTS contest_jury
(
    app_user_id BIGINT NOT NULL
        CONSTRAINT fk_contest_jury_app_user
            REFERENCES app_user,
    contest_id  BIGINT NOT NULL
        CONSTRAINT fk_contest_jury_contest
            REFERENCES contest
);

CREATE TABLE IF NOT EXISTS contest_participants
(
    app_user_id BIGINT NOT NULL
        CONSTRAINT fk_contest_participants_app_user
            REFERENCES app_user,
    contest_id  BIGINT NOT NULL
        CONSTRAINT fk_contest_participants_contest
            REFERENCES contest
);

CREATE TABLE IF NOT EXISTS phase
(
    contest_id      BIGINT       NOT NULL
        CONSTRAINT fk_phase_contest
            REFERENCES contest,
    id              BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    start_date_time TIMESTAMP    NOT NULL,
    end_date_time   TIMESTAMP    NOT NULL,
    type            VARCHAR(255) NOT NULL,
    is_concluded    BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT phase_type_check CHECK (type IN ('PHASE_ONE', 'PHASE_TWO'))
);

CREATE TABLE IF NOT EXISTS photo_submission
(
    contest_id BIGINT        NOT NULL
        CONSTRAINT fk_photo_submission_contest
            REFERENCES contest,
    creator_id BIGINT        NOT NULL
        CONSTRAINT fk_photo_submission_user_profile
            REFERENCES user_profile,
    id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    story      VARCHAR(5000) NOT NULL,
    photo_url  VARCHAR(255)  NOT NULL,
    title      VARCHAR(255)  NOT NULL
);

CREATE TABLE IF NOT EXISTS photo_review
(
    id                  BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    category_mismatch   BOOLEAN       NOT NULL,
    is_reviewed         BOOLEAN       NOT NULL,
    score               INTEGER       NOT NULL CHECK (score >= 1 AND score <= 10),
    jury_id             BIGINT        NOT NULL
        CONSTRAINT fk_photo_review_jury
            REFERENCES user_profile,
    photo_submission_id BIGINT        NOT NULL
        CONSTRAINT fk_photo_review_photo_submission
            REFERENCES photo_submission,
    comment             VARCHAR(5000) NOT NULL
);

-- Step 3: Insert roles
INSERT INTO roles (authority)
VALUES ('ADMIN'), ('USER');

-- Step 4: Insert users
INSERT INTO app_user (username, password, email)
VALUES
    ('admin', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'admin@example.com'),
    ('user1', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'john.doe@example.com'),
    ('user2', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'jane.doe@example.com'),
    ('user3', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'alex.smith@example.com'),
    ('user4', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'emily.jones@example.com'),
    ('user5', '$2a$10$fn/K6upEvwqz9ndoGgEVr.kjL0TsDsX4qvJmYNvvDg1Cgf34dR.LS', 'chris.brown@example.com');

-- Step 5: Assign roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.role_id
FROM app_user u, roles r
WHERE u.username = 'admin' AND r.authority = 'ADMIN';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.role_id
FROM app_user u, roles r
WHERE u.username IN ('user1', 'user2', 'user3', 'user4', 'user5') AND r.authority = 'USER';

-- Step 6: Insert user profiles
INSERT INTO user_profile (id, first_name, last_name, rank)
VALUES
    ((SELECT id FROM app_user WHERE username = 'admin'), 'Admin', 'User', 'ORGANIZER'),
    ((SELECT id FROM app_user WHERE username = 'user1'), 'John', 'Doe', 'DICTATOR'),
    ((SELECT id FROM app_user WHERE username = 'user2'), 'Jane', 'Doe', 'MASTER'),
    ((SELECT id FROM app_user WHERE username = 'user3'), 'Alex', 'Smith', 'ENTHUSIAST'),
    ((SELECT id FROM app_user WHERE username = 'user4'), 'Emily', 'Jones', 'ENTHUSIAST'),
    ((SELECT id FROM app_user WHERE username = 'user5'), 'Chris', 'Brown', 'JUNKIE');

-- Step 7: Insert contests with phases

-- Contest 1: Serenity of Nature (Active)
INSERT INTO contest (title, category, organizer_id, created_at, updated_at, start_date, submission_end_date, end_date)
VALUES ('Serenity of Nature', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now(), now() + interval '3 days', now() + interval '6 days');

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
VALUES ((SELECT id FROM contest WHERE title = 'Serenity of Nature'), now(), now() + interval '1 day', 'PHASE_ONE', FALSE),
       ((SELECT id FROM contest WHERE title = 'Serenity of Nature'), now() + interval '1 day', now() + interval '3 days', 'PHASE_TWO', FALSE);

-- Contest 2: Wild Wonders (Submission Ended)
-- Contest 2: Wild Wonders (Submission Ended)
INSERT INTO contest (title, category, organizer_id, created_at, updated_at, start_date, submission_end_date, end_date)
VALUES ('Wild Wonders', 'WILDLIFE',
        (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')),
        now() - interval '5 days',         -- created_at
        now() - interval '5 days',         -- updated_at
        now() - interval '3 days',         -- start_date
        now() - interval '1 day',          -- submission_end_date (submission already ended)
        now());                            -- end_date (still ongoing)

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
VALUES ((SELECT id FROM contest WHERE title = 'Wild Wonders'), now() - interval '3 days', now() - interval '1 day', 'PHASE_ONE', TRUE),
       ((SELECT id FROM contest WHERE title = 'Wild Wonders'), now() - interval '1 day', now(), 'PHASE_TWO', FALSE);

-- Contest 3: Faces of the World (Finished)
INSERT INTO contest (title, category, organizer_id, created_at, updated_at, start_date, submission_end_date, end_date)
VALUES ('Faces of the World', 'PORTRAIT',
        (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')),
        now() - interval '9 days',
        now() - interval '7 days',
        now() - interval '7 days',
        now() - interval '4 days',
        now() - interval '2 days');

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
VALUES ((SELECT id FROM contest WHERE title = 'Faces of the World'), now() - interval '7 days', now() - interval '5 days', 'PHASE_ONE', TRUE),
       ((SELECT id FROM contest WHERE title = 'Faces of the World'), now() - interval '5 days', now() - interval '2 days', 'PHASE_TWO', TRUE);

-- Repeat similar for remaining contests 4 through 10 with appropriate categories, dates, and phases

-- Contest 4: Urban Jungle (Street)
INSERT INTO contest (title, category, organizer_id, created_at, updated_at, start_date, submission_end_date, end_date)
VALUES ('Urban Jungle', 'STREET',
        (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')),
        now() - interval '7 days',
        now() - interval '5 days',
        now() - interval '3 days',
        now() - interval '2 days',
        now() + interval '1 day');

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
VALUES ((SELECT id FROM contest WHERE title = 'Urban Jungle'), now() - interval '7 days', now() - interval '5 days', 'PHASE_ONE', TRUE),
       ((SELECT id FROM contest WHERE title = 'Urban Jungle'), now() - interval '5 days', now() + interval '1 day', 'PHASE_TWO', FALSE);

-- Contest 5: Abstract Dimensions (Active)
INSERT INTO contest (title, category, organizer_id, created_at, updated_at, start_date, submission_end_date, end_date)
VALUES ('Abstract Dimensions', 'ABSTRACT',
        (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')),
        now(),
        now(),
        now() + interval '1 day',
        now() + interval '4 days',
        now() + interval '5 days');

INSERT INTO phase (contest_id, start_date_time, end_date_time, type, is_concluded)
VALUES ((SELECT id FROM contest WHERE title = 'Abstract Dimensions'), now(), now() + interval '2 days', 'PHASE_ONE', FALSE),
       ((SELECT id FROM contest WHERE title = 'Abstract Dimensions'), now() + interval '2 days', now() + interval '4 days', 'PHASE_TWO', FALSE);

-- Continue with the same pattern for contests 6 through 10.

-- Step 8: Insert participants for first 10 contests
INSERT INTO contest_participants (app_user_id, contest_id)
SELECT u.id, c.id FROM app_user u, contest c
WHERE u.username IN ('user1', 'user2', 'user3', 'user4', 'user5') AND c.id <= 10;

-- Step 9: Insert admin as jury for all contests
INSERT INTO contest_jury (app_user_id, contest_id)
SELECT (SELECT id FROM app_user WHERE username = 'admin'), c.id FROM contest c;

-- Step 10: Insert submissions for first 10 contests
-- Submissions for Contest 1
INSERT INTO photo_submission (contest_id, creator_id, story, photo_url, title)
SELECT c.id, u.id, 'A serene view of nature.', 'http://example.com/photo_' || u.username, 'Nature Photo ' || u.username
FROM contest c, app_user u WHERE c.title = 'Serenity of Nature' AND u.username IN ('user1', 'user2', 'user3', 'user4', 'user5');

-- Repeat similar submissions for other contests.

-- Step 11: Insert photo reviews by admin for all submissions
INSERT INTO photo_review (category_mismatch, is_reviewed, score, jury_id, photo_submission_id, comment)
SELECT FALSE, TRUE, FLOOR(RANDOM() * 10 + 1), (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), s.id, 'Great photo!'
FROM photo_submission s WHERE s.contest_id IN (SELECT id FROM contest WHERE id <= 10);

-- Insert 25 more contests with varying names and random categories
INSERT INTO contest (title, category, organizer_id, created_at, updated_at, start_date, submission_end_date, end_date)
VALUES
    ('Majestic Landscapes', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Portrait Perfection', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wildlife Expedition', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Urban Wanderers', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Abstract Dreams', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('City Lights', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Faces of Expression', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wilderness Calling', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Brush Strokes of Imagination', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Mountains and Valleys', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('People of the Streets', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wild at Heart', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Abstract Vision', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Portraits of Humanity', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Street Chronicles', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wildlife Adventures', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Serene Landscapes', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Abstract Realities', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Portraits of Grace', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('City Scenes', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wildlife in Motion', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Fields of Green', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Abstract Metaphors', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Street Stories', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Colorful Horizons', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wild Encounters', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Portraits of Emotion', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('City Rhythms', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Abstract Reflections', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Landscapes of Tranquility', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wildlife Wonders', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Faces of Culture', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Street Life', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Abstract Ideas', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Mountain Views', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wildlife Odyssey', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Faces of the World', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('City Streets', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Abstract Minds', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Serenity in Nature', 'LANDSCAPE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Wild Journeys', 'WILDLIFE', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Faces of the People', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('City Reflections', 'STREET', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Abstract Illusions', 'ABSTRACT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days'),
    ('Portrait Chronicles', 'PORTRAIT', (SELECT id FROM user_profile WHERE id = (SELECT id FROM app_user WHERE username = 'admin')), now(), now(), now() + interval '1 day', now() + interval '4 days', now() + interval '5 days');
