-- creating database for the project

-- source C:\Users\ellir\Hybridisovellukset\personal-assignment-S2025\back-end\database\create-db.sql;

DROP DATABASE IF EXISTS traveltime;
CREATE DATABASE traveltime;
USE traveltime;

-- users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    profile_picture VARCHAR(255) DEFAULT 'default.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- places table
CREATE TABLE places (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    continent VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    UNIQUE (latitude, longitude) -- place can be added only once
);

-- tags table
CREATE TABLE tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE
);

-- trip_tags table
CREATE TABLE trip_tags (
    trip_id INT NOT NULL, -- reference to trips table
    tag_id INT NOT NULL, -- reference to tags table
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE,
    UNIQUE (trip_id, tag_id) -- trip can have a tag only once
);

-- trips table
CREATE TABLE trips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- reference to users table
    place_id INT NOT NULL, -- reference to places table
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    trip_image VARCHAR(255), -- image of the trip
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) 
);

-- likes table
CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    UNIQUE (user_id, trip_id) -- user can like a trip only once
);

-- comments table
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    comment VARCHAR(300) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

-- follows table
CREATE TABLE follows (
    follow_id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT,
    following_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (follower_id, following_id) -- user can follow another user only once
);

-- Indexes for faster search

CREATE INDEX idx_city ON places(city);
CREATE INDEX idx_country ON places(country);
CREATE INDEX idx_continent ON places(continent);
CREATE INDEX idx_tag_name ON tags(tag_name);

CREATE INDEX idx_created_at_trips ON trips(created_at);

SELECT * FROM places WHERE city = 'Hanoi';

SELECT * FROM tags WHERE tag_name = 'history';

-- indexes for foreign keys

CREATE INDEX idx_user_id_trips ON trips(user_id); -- for user_id in trips table
CREATE INDEX idx_place_id_trips ON trips(place_id); -- for place_id in trips table
CREATE INDEX idx_user_id_comments ON comments(user_id); -- for comments by specific user
CREATE INDEX idx_trip_id_comments ON comments(trip_id); -- for comments on specific trip 
CREATE INDEX idx_user_id_likes ON likes(user_id); -- for likes by specific user
CREATE INDEX idx_trip_id_likes ON likes(trip_id);
CREATE INDEX idx_follower_id_follows ON follows(follower_id); -- for followers lookup

-- index to join trips and tags

CREATE INDEX idx_trip_id_trip_tags ON trip_tags(trip_id);

-- Inserting data

-- tags 

INSERT into tags (tag_name) VALUES ('food'), ('culture'), ('nature'), ('history'), ('adventure'), ('beach'), ('city'), ('mountain'), ('shopping'), ('relaxing'), ('sightseeing'), ('nightlife'), ('hiking'), ('cycling'), ('diving'), ('skiing'), ('surfing'), ('fishing'), ('wildlife'), ('photography'), ('roadtrip');

-- users

INSERT INTO users (username, password_hash, email) VALUES ('ellir', '$2y$10$3', 'elli@metropolia.fi');

-- transactions

-- inserting a trip with a tag

START TRANSACTION;

-- insert a new trip

INSERT INTO trips (user_id, place_id, description, start_date, end_date, trip_image) VALUES (1, 1, 'This is a trip to Hanoi', '2023-05-15', '2023-05-28', 'Hanoi.jpg');

-- get the trip_id of the inserted trip

SET @trip_id = LAST_INSERT_ID();

-- insert tags for the trip
INSERT INTO trip_tags (trip_id, tag_id) VALUES (@trip_id, (SELECT tag_id FROM tags WHERE tag_name = 'history')),
(@trip_id, (SELECT tag_id FROM tags WHERE tag_name = 'food')),
(@trip_id, (SELECT tag_id FROM tags WHERE tag_name = 'city'));

-- commit the transaction
COMMIT;

-- creating a user

START TRANSACTION;

INSERT INTO users (username, password_hash, email) VALUES ('admin', '$2y$10$3', 'popokissa@metropolia.fi');

COMMIT;

-- views 

-- a view that joins the trips and tags tables, showing all trips along with their associated tags

CREATE VIEW trip_tags_view AS
SELECT 
    trips.trip_id,
    trips.description,
    trips.start_date,
    trips.end_date,
    places.city,
    places.country,
    GROUP_CONCAT(tags.tag_name) AS tags
FROM trips
JOIN places ON trips.place_id = places.place_id
JOIN trip_tags ON trips.trip_id = trip_tags.trip_id
JOIN tags ON trip_tags.tag_id = tags.tag_id
GROUP BY trips.trip_id;

SELECT * FROM trip_tags_view WHERE city = 'Hanoi';

-- who user is following

CREATE VIEW user_followings AS
SELECT u.username, f.created_at, f.follower_id, f.following_id
FROM users u
JOIN follows f ON u.user_id = f.following_id;

SELECT * FROM user_followings WHERE follower_id = 2; -- -- Shows who user 2 is following

-- Check if user exists
SELECT COUNT(*) FROM users WHERE user_id = 1;

-- Check if place exists
SELECT COUNT(*) FROM places WHERE place_id = 1;