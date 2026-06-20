package server

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

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

type LLMMessage struct{
    Role string	    `json:"role"`
    Content string  `json:"content"`
}

type OpenRouterRequest struct {
    Model	string	    `json:"model"`
    Messages	[]LLMMessage`json:"messages"`
    Stream	bool	    `json:"stream"`
}

type ChatRequest struct {
    Messages []LLMMessage `json:"messages"`
}

// The following struct and documentations are AI generated
// The streaming response chunks look like this:
// data: {"choices":[{"delta":{"content":"hello"}}]}
type StreamChunk struct {
	Choices []struct {
		Delta struct {
			Content string `json:"content"`
		} `json:"delta"`
	} `json:"choices"`
}

func (s *Server) ChatStream(c *gin.Context) {
    var req ChatRequest
    if err := c.ShouldBindJSON(&req); err != nil {
	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	return
    }
    fmt.Printf("request: %v\n", req)
    url := "https://openrouter.ai/api/v1/chat/completions"
    body, _ := json.Marshal(OpenRouterRequest{
	Model: "deepseek/deepseek-v4-flash",
	Messages: req.Messages,
	Stream: true,
    })
    request, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
    if err != nil {
	c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("error on creating request to openrouter: %v", err)})
	return
    }

    request.Header.Set("Content-Type", "application/json")
    request.Header.Set("Authorization", "Bearer " + os.Getenv("OPENROUTER_API_KEY"))

    client := http.Client{}
    response, err := client.Do(request)
    if err != nil {
	c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("http error on request to openrouter: %v", err)})
	return
    }

    defer response.Body.Close()

    c.Header("Content-Type", "text/event-stream")
    c.Header("Cache-Control", "no-cache")
    c.Header("Connection", "keep-alive")
    c.Header("Transfer-Encoding", "chunked")

    scanner := bufio.NewScanner(response.Body)

    // The internals of this function are AI generated
    c.Stream(func(w io.Writer) bool {
	if !scanner.Scan() {
	    fmt.Fprintf(w, "data: {\"done\":true}\n\n")
	    return false
	}
	
	line := scanner.Text()

	// OpenRouter sends lines like "data: {...}" and blank lines
	if !strings.HasPrefix(line, "data: ") {
	    return true // skip blank lines or other lines
	}

	payload := strings.TrimPrefix(line, "data: ")

	// OpenRouter signals end of stream with [DONE]
	if payload == "[DONE]" {
	    fmt.Fprintf(w, "data: {\"done\":true}\n\n")
	    return false
	}

	var chunk StreamChunk
	if err := json.Unmarshal([]byte(payload), &chunk); err != nil {
	    return true // skip malformed chunks
	}


	if len(chunk.Choices) > 0 {
	    text := chunk.Choices[0].Delta.Content
	    if text != "" {
		data, _ := json.Marshal(gin.H{"text": text})
		fmt.Fprintf(w, "data: %s\n\n", data)
	    }
	}

	return true
    })

}

func Run() {
    port := ":8080"

    err := godotenv.Load()
    if err != nil {
	panic(err)
    }

    server, err := CreateServer()
    if err != nil {
	panic(err)
    }
    r := gin.Default()

    api := r.Group("/api")
    {
	api.GET("/chats", server.ChatHandler)
	api.GET("/chats/:id", server.ChatHandlerById)
	api.POST("/chat/stream", server.ChatStream)
    }

    r.Static("/assets", "./static/assets")
    r.GET("/", func(c *gin.Context) {
	c.File("./static/index.html")
    })
    r.NoRoute(func(c *gin.Context) {
	c.File("./static/index.html")
    })

    r.Run(port)
}

