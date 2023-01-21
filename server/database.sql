CREATE DATABASE flashcards; 

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY, 
    user_name VARCHAR(30) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL,
    profile_picture varchar(100), 
    date_created TIMESTAMP DEFAULT current_timestamp 
);

CREATE TABLE classes(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    class VARCHAR(30) NOT NULL, 
    UNIQUE (username, class) 
    class_picture varchar(100), 
    date TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE decks(
    id SERIAL PRIMARY KEY, 
    class_id INTEGER, 
    name VARCHAR(30), 
    UNIQUE(class_id, name)
    date TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE cards(
    id SERIAL PRIMARY KEY, 
    deck_id INTEGER,
    question VARCHAR(1000), 
    answer VARCHAR(1000), 
    image TEXT,  
    date TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE refresh_tokens(
    token VARCHAR(200) PRIMARY KEY
);

