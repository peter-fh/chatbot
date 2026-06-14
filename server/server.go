package server

import (
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "time"

    "github.com/jackc/pgx/v5"
    "github.com/google/uuid"
)

type DB struct {
    connection *pgx.Conn
}

type Conversation struct {
    ID		uuid.UUID   `json:"id"`
    Title	string	    `json:"title"`
    Summary	*string	    `json:"summary"`
    Timestamp	time.Time   `json:"timestamp"`
}

func DBConnect() (*DB, error) {
    url := "postgres://localhost:5432/chat?sslmode=disable"
    conn, err := pgx.Connect(context.Background(), url)
    if err != nil {
	return nil, fmt.Errorf("connection to database failed: %w\n", err)
    }

    return &DB{conn}, nil
}

func (db *DB) Close() error {
    return db.connection.Close(context.Background())
}

func (db *DB) ChatTitles() ([]Conversation, error) {
    rows, err := db.connection.Query(context.Background(),`
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
func (s *Server) ChatHandler(w http.ResponseWriter, r *http.Request) {
    titles, err := s.db.ChatTitles()
    if err != nil {
	http.Error(w,fmt.Sprintf("db error fetching chats: %v", err), http.StatusInternalServerError)
    }

    w.Header().Set("Content-Type", "application/json")

    err = json.NewEncoder(w).Encode(titles)
    if err != nil {
	http.Error(w, fmt.Sprintf("json error serializing chats: %v", err), http.StatusInternalServerError)
    }
}

func Run() {
    port := ":8080"

    server, err := CreateServer()
    if err != nil {
	panic(err)
    }

    dir := http.Dir("./static")
    http.HandleFunc("/chats", server.ChatHandler)
    http.Handle("/", http.FileServer(dir))

    fmt.Printf("Listening to port %s", port)
    if err := http.ListenAndServe(port, nil); err != nil {
	panic(err)
    }
}

