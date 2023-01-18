CREATE DATABASE flashcards; 

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY, 
    user_name VARCHAR(30), 
    password VARCHAR(20),
    profile_picture TEXT, 
    date_created TIMESTAMP DEFAULT current_timestamp 
);

CREATE TABLE classes(
    class_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    class_name VARCHAR(30), 
    date TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE decks(
    deck_id SERIAL PRIMARY KEY, 
    class_id INTEGER, 
    date TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE cards(
    card_id SERIAL PRIMARY KEY, 
    deck_id INTEGER,
    question VARCHAR(4000), 
    answer VARCHAR(4000), 
    image TEXT,  
    date TIMESTAMP DEFAULT current_timestamp
);

