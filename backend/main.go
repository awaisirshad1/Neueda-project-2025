package main

import (
    "fmt"
    "log"
    "net/http"

    "Project2025/chatbot"
)

func main() {
    http.HandleFunc("/chat", chatbot.ChatHandler)
    fmt.Println("Server started at :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
