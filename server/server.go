package server

import (
	"fmt"
	"net/http"
)

func Run() {
    port := ":8080"

    dir := http.Dir("./static")
    handler := http.FileServer(dir)

    fmt.Printf("Listening to port %s", port)
    if err := http.ListenAndServe(port, handler); err != nil {
	panic(err)
    }
}

