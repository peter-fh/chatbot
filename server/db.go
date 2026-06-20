package server

import (
    "context"
    "fmt"
    "time"

    "github.com/google/uuid"
    "github.com/jackc/pgx/v5/pgxpool"
)

type DB struct {
    pool *pgxpool.Pool
}

type Conversation struct {
    ID		uuid.UUID   `json:"id"`
    Title	string	    `json:"title"`
    Summary	*string	    `json:"summary"`
    Timestamp	time.Time   `json:"timestamp"`
}

type ConversationMessage struct {
    ID		    uuid.UUID	`json:"id"`
    ConversationId  uuid.UUID	`json:"conversation_id"`
    Role	    string	`json:"role"`
    Content	    string	`json:"content"`
    Timestamp	    time.Time   `json:"timestamp"`
}

func DBConnect() (*DB, error) {
    url := "postgres://localhost:5432/chat?sslmode=disable"
    conn, err := pgxpool.New(context.Background(), url)
    if err != nil {
	return nil, fmt.Errorf("connection to database failed: %w\n", err)
    }

    return &DB{conn}, nil
}

func (db *DB) Close() {
    db.pool.Close()
}

func (db *DB) ChatTitles() ([]Conversation, error) {
    rows, err := db.pool.Query(context.Background(),`
	SELECT id, title
	FROM conversation
	ORDER BY timestamp;
    `)
    if err != nil {
	return nil, err
    }
    defer rows.Close()

    var conversations []Conversation

    for rows.Next() {
	var conversation Conversation
	err = rows.Scan(&conversation.ID, &conversation.Title)
	if err != nil {
	    return nil, err
	}
	conversations = append(conversations, conversation)
    }

    return conversations, nil
}

func (db *DB) ChatMessages(conversation_id uuid.UUID) ([]ConversationMessage, error) {
    rows, err := db.pool.Query(context.Background(),`
	SELECT role, content
	FROM message
	WHERE conversation_id=$1
	ORDER BY timestamp;
	`,
	conversation_id,
	)

    if err != nil {
	return nil, err
    }
    defer rows.Close()

    var conversation []ConversationMessage
    for rows.Next() {
	var message ConversationMessage
	err = rows.Scan(&message.Role, &message.Content)
	if err != nil {
	    return nil, err
	}
	conversation = append(conversation, message)
    }

    return conversation, nil

}
