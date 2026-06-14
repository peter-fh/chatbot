CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS conversation;

CREATE TABLE conversation (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title VARCHAR(128) NOT NULL,
	summary TEXT,
	timestamp TIMESTAMPTZ
);

CREATE TABLE message (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	conversation_id UUID REFERENCES conversation(id),
	role VARCHAR(128) NOT NULL,
	content TEXT,
	timestamp TIMESTAMPTZ
);

INSERT INTO conversation (title)
VALUES
	('Chat 1'),
	('Chat 2'),
	('Chat 3'),
	('Chat 4'),
	('Chat 5'),
	('Chat 6');

