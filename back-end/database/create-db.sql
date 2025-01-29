-- creating database for the project

-- source C:/Users/ellir/Hybridisovellukset/personal-assignment-S2025/back-end/database/create-db.sql;

DROP DATABASE IF EXISTS traveltime;
CREATE DATABASE traveltime;
USE traveltime;

-- create user levels

CREATE TABLE UserLevels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

-- users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    user_level_id INT,
    profile_picture VARCHAR(255) DEFAULT 'default.jpg',
    profile_info VARCHAR(150) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id) ON DELETE CASCADE
);

-- tags table
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE
);

-- posts table
-- lat&long are fetched from a map API to display the post on a map
CREATE TABLE TravelPosts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- reference to users table
    post_image VARCHAR(255), -- image of the post
    continent VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) DEFAULT NULL, 
    longitude DECIMAL(9, 6) DEFAULT NULL, 
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- postTags table
CREATE TABLE PostTags (
    post_id INT NOT NULL, -- reference to travelPosts table
    tag_id INT NOT NULL, -- reference to tags table
    FOREIGN KEY (post_id) REFERENCES travelPosts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE,
    UNIQUE (post_id, tag_id) -- post can have a tag only once
);

-- likes table
CREATE TABLE Likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES TravelPosts(post_id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id) -- user can like a post only once
);

-- comments table
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    comment VARCHAR(300) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES TravelPosts(post_id) ON DELETE CASCADE
);

-- follows table
CREATE TABLE Follows (
    follow_id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT,
    following_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (follower_id, following_id) -- user can follow another user only once
);

-- notifications table

CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_text TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    notification_type ENUM('Follows', 'Comment') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Indexes for faster search

CREATE INDEX idx_city ON TravelPosts(city);
CREATE INDEX idx_country ON TravelPosts(country);
CREATE INDEX idx_continent ON TravelPosts(continent);
CREATE INDEX idx_tag_name ON Tags(tag_name);

CREATE INDEX idx_created_at_post ON TravelPosts(created_at);

SELECT * FROM Tags WHERE tag_name = 'history';

-- indexes for foreign keys

CREATE INDEX idx_user_id_posts ON TravelPosts(user_id); -- for user_id in travelPosts table
CREATE INDEX idx_post_id_comments ON Comments(post_id); -- for comments on specific post
CREATE INDEX idx_user_id_likes ON Likes(user_id); -- for likes by specific user
CREATE INDEX idx_post_id_likes ON Likes(post_id);
CREATE INDEX idx_follower_id_follows ON Follows(follower_id); -- for followers lookup

-- index to join posts and tags

CREATE INDEX idx_post_id_post_tags ON PostTags(post_id);

-- Inserting data

INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('User'), ('Guest');

-- tags 

INSERT into Tags (tag_name) VALUES ('food'), ('culture'), ('nature'), ('history'), ('adventure'), ('beach'), ('city'), ('mountain'), ('shopping'), ('relaxing'), ('sightseeing'), ('nightlife'), ('hiking'), ('cycling'), ('diving'), ('skiing'), ('surfing'), ('fishing'), ('wildlife'), ('photography'), ('roadtrip');

-- users

INSERT INTO Users (username, password_hash, email, user_level_id) VALUES ('ellir', '$2y$10$3', 'elli@metropolia.fi', 1);

-- transactions

-- creating a user

START TRANSACTION;

INSERT INTO Users (username, password_hash, email, user_level_id) VALUES ('popo', '$2y$10$3', 'popokissa@metropolia.fi', 2);

COMMIT;

-- inserting a post with a tag

START TRANSACTION;

-- insert a new travel post

INSERT INTO TravelPosts (user_id, post_image, continent, country, city, start_date, end_date, description) VALUES (2, 'Rome.jpg', 'Europe', 'Italy', 'Rome', '2023-01-05', '2023-01-10', 'This is a trip to Rome');

-- get the post_id of the inserted post

SET @post_id = LAST_INSERT_ID();

-- insert tags for the posts
INSERT INTO PostTags (post_id, tag_id) VALUES 

(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'shopping')),
(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'food')),
(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'city'));

-- commit the transaction
COMMIT;

START TRANSACTION;

-- insert a new travel post

INSERT INTO TravelPosts (user_id, post_image, continent, country, city, start_date, end_date, description) VALUES (1, 'NewYork.jpg', 'North America', 'USA', 'New York', '2018-07-31', '2018-08-05', 'This is a trip to New York');

-- get the post_id of the inserted post

SET @post_id = LAST_INSERT_ID();

-- insert tags for the posts
INSERT INTO PostTags (post_id, tag_id) VALUES 

(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'shopping')),
(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'nightlife')),
(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'city'));

-- commit the transaction
COMMIT;

START TRANSACTION;

-- insert a new travel post

INSERT INTO TravelPosts (user_id, post_image, continent, country, city, start_date, end_date, description) VALUES (1, 'Hanoi.jpg', 'Asia', 'Vietnam', 'Hanoi', '2023-05-15', '2023-05-28', 'This is a trip to Hanoi');


-- get the post_id of the inserted post

SET @post_id = LAST_INSERT_ID();

-- insert tags for the posts
INSERT INTO PostTags (post_id, tag_id) VALUES 

(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'history')),
(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'food')),
(@post_id, (SELECT tag_id FROM Tags WHERE tag_name = 'city'));

-- commit the transaction
COMMIT;

-- notifications

INSERT INTO Notifications (user_id, notification_text, notification_type) VALUES (2, 'User ellir commented on your post', 'Comment');

-- views 

-- a view that joins the trips and tags tables, showing all trips along with their associated tags

CREATE VIEW post_tags_view AS
SELECT 
    TravelPosts.post_id,
    TravelPosts.post_image,
    TravelPosts.continent,
    TravelPosts.country,
    TravelPosts.city,
    TravelPosts.latitude,
    TravelPosts.longitude,
    TravelPosts.start_date,
    TravelPosts.end_date,
    TravelPosts.description,
    TravelPosts.created_at,
    GROUP_CONCAT(Tags.tag_name) AS Tags
FROM TravelPosts
LEFT JOIN PostTags ON TravelPosts.post_id = PostTags.post_id
LEFT JOIN Tags ON PostTags.tag_id = Tags.tag_id
GROUP BY TravelPosts.post_id;

SELECT * FROM post_tags_view WHERE city = 'Hanoi';

-- who user is following

CREATE VIEW user_followings AS
SELECT u.username, f.created_at, f.follower_id, f.following_id
FROM Users u
JOIN Follows f ON u.user_id = f.following_id;

SELECT * FROM user_followings WHERE follower_id = 2; -- -- Shows who user 2 is following

-- Check if user exists
SELECT COUNT(*) FROM Users WHERE user_id = 1;

-- create a view that shows all the posts that a user has liked

CREATE VIEW user_likes AS
SELECT u.username, l.created_at, l.user_id, l.post_id
FROM Users u
JOIN Likes l ON u.user_id = l.user_id;

SELECT * FROM user_likes WHERE user_id = 1;

-- create a view that shows all the notifications for a user

CREATE VIEW user_notifications AS
SELECT 
    u.user_id,
    u.username,
    n.notification_text,
    n.is_seen,
    n.notification_type,
    n.created_at
FROM 
    Users u
JOIN 
    Notifications n ON u.user_id = n.user_id;


SELECT * from user_notifications WHERE username = 'popo';

-- count notifications that user has received

SELECT COUNT(*) FROM Notifications WHERE user_id = 1;
