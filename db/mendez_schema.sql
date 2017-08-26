USE heroku_6aafb0838fd5e56;

CREATE TABLE players 
(
	id int NOT NULL AUTO_INCREMENT,
	username varchar(30) NOT NULL,
	score int DEFAULT 0,
    room_id int,
	PRIMARY KEY (id)
);

CREATE TABLE rooms 
(
	id int NOT NULL AUTO_INCREMENT,
	roomName varchar(255) NOT NULL,
	gameLength int DEFAULT 1,
    currentLeaderId int DEFAULT 0,
	PRIMARY KEY (id)
);

CREATE TABLE cards 
(
	id int NOT NULL AUTO_INCREMENT,
	title varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
    role varchar(255) DEFAULT 0,
    room_id int,
    player_id int,
	PRIMARY KEY (id)
);

CREATE TABLE cards_played_this_round
(
	id int NOT NULL,
    room_id int,
    player_id int NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE cards_to_deal
(
	id int NOT NULL,
	title varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
    room_id int,
    player_id int,
	PRIMARY KEY (id)
);