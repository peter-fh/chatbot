package server

import (
    "context"
    "fmt"
    "net/http"
    "time"

    "github.com/google/uuid"
    "github.com/jackc/pgx/v5/pgxpool"
    "github.com/gin-gonic/gin"
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

func DBExec() {
    db, err := DBConnect()
    if err != nil {
	panic(err)
    }

    titles, err := db.ChatTitles()
    if err != nil {
	panic(err)
    }

    fmt.Println(titles)

}

type Server struct {
    db *DB
}

func CreateServer() (*Server, error) {
    db, err := DBConnect()
    if err != nil {
	return nil, err
    }

    return &Server{db}, nil
}

func (s *Server) ChatHandler(c *gin.Context) {
    titles, err := s.db.ChatTitles()
    if err != nil {
	c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error fetching chats: %v", err)})
	return
    }
    c.JSON(http.StatusOK, titles)
}


func (s *Server) ChatHandlerById(c *gin.Context) {
    param := c.Param("id")

    id, err := uuid.Parse(param)
    if err != nil {
	c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("fetching specific conversation with invalid uuid: %v", param)})
	return
    }

    messages, err := s.db.ChatMessages(id)
    if err != nil {
	c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("db error fetching messages: %v", err)})
	return
    }

    c.JSON(http.StatusOK, messages)
}


func (s *Server) FileServer(w http.ResponseWriter, r *http.Request) {
}

func Run() {
    port := ":8080"

    server, err := CreateServer()
    if err != nil {
	panic(err)
    }
    r := gin.Default()

    api := r.Group("/api")
    {
	api.GET("/chats", server.ChatHandler)
	api.GET("/chats/:id", server.ChatHandlerById)
    }

    // Static files
    r.Static("/assets", "./static/assets")

    r.GET("/", func(c *gin.Context) {
	c.File("./static/index.html")
    })
    // Catch-all for React Router
    r.NoRoute(func(c *gin.Context) {
	c.File("./static/index.html")
    })

    r.Run(port)
}

