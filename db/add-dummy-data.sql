INSERT INTO conversation (title)
VALUES
	('Chat 1'),
	('Chat 2'),
	('Chat 3'),
	('Chat 4'),
	('Chat 5'),
	('Chat 6');

-- Mock conversation metadata
UPDATE conversation
SET
    summary = CASE title
        WHEN 'Chat 1' THEN 'Planning a weekend trip and comparing destinations.'
        WHEN 'Chat 2' THEN 'Discussing homework help for math and physics.'
        WHEN 'Chat 3' THEN 'Brainstorming a startup idea and possible features.'
        WHEN 'Chat 4' THEN 'Talking about movies, favorites, and recommendations.'
        WHEN 'Chat 5' THEN 'Organizing a study schedule for exams.'
        WHEN 'Chat 6' THEN 'Casual chat about music, hobbies, and daily life.'
    END,
    timestamp = CASE title
        WHEN 'Chat 1' THEN NOW() - INTERVAL '6 days'
        WHEN 'Chat 2' THEN NOW() - INTERVAL '5 days'
        WHEN 'Chat 3' THEN NOW() - INTERVAL '4 days'
        WHEN 'Chat 4' THEN NOW() - INTERVAL '3 days'
        WHEN 'Chat 5' THEN NOW() - INTERVAL '2 days'
        WHEN 'Chat 6' THEN NOW() - INTERVAL '1 day'
    END;

-- Mock messages for each conversation
INSERT INTO message (conversation_id, role, content, timestamp)
SELECT c.id, m.role, m.content, m.timestamp
FROM conversation c
JOIN (
    VALUES
        ('Chat 1', 'user', 'I want to go somewhere relaxing for the weekend.', NOW() - INTERVAL '6 days 2 hours'),
        ('Chat 1', 'assistant', 'A cabin near a lake or a small coastal town could be great.', NOW() - INTERVAL '6 days 1 hour'),
        ('Chat 2', 'user', 'Can you help me solve this algebra problem?', NOW() - INTERVAL '5 days 3 hours'),
        ('Chat 2', 'assistant', 'Absolutely — send me the equation and we can work through it.', NOW() - INTERVAL '5 days 2 hours'),
        ('Chat 3', 'user', 'I have an idea for a note-taking app.', NOW() - INTERVAL '4 days 4 hours'),
        ('Chat 3', 'assistant', 'Nice — what problem does it solve better than existing apps?', NOW() - INTERVAL '4 days 3 hours'),
        ('Chat 4', 'user', 'What are some good sci-fi movies?', NOW() - INTERVAL '3 days 5 hours'),
        ('Chat 4', 'assistant', 'You might like Interstellar, Arrival, and Blade Runner 2049.', NOW() - INTERVAL '3 days 4 hours'),
        ('Chat 5', 'user', 'I need a better study schedule for finals week.', NOW() - INTERVAL '2 days 6 hours'),
        ('Chat 5', 'assistant', 'Let’s break your subjects into focused blocks with breaks between them.', NOW() - INTERVAL '2 days 5 hours'),
        ('Chat 6', 'user', 'I’ve been listening to a lot of indie music lately.', NOW() - INTERVAL '1 day 7 hours'),
        ('Chat 6', 'assistant', 'That’s awesome — indie has so many great subgenres and artists.', NOW() - INTERVAL '1 day 6 hours')
) AS m(title, role, content, timestamp)
ON c.title = m.title;
