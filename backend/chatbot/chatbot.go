package main

import (
    "context"
    "fmt"
    "net/http"
    "os"
	"encoding/json"
	"log"

    "github.com/sashabaranov/go-openai"
)

func chatHandler(w http.ResponseWriter, r *http.Request) {
    // Only allow POST requests
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    type ChatRequest struct {
        Question     string `json:"question"`
        LoanAmount   string `json:"loanAmount"`
        TermYears    string `json:"termYears"`
        InterestRate string `json:"interestRate"`
        DownPayment  string `json:"downPayment"`
    }

    // Decode JSON payload
    var req ChatRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    // Check that the question is not empty
    if req.Question == "" {
        http.Error(w, "Question cannot be empty", http.StatusBadRequest)
        return
    }

    // Create OpenAI client
    apiKey := os.Getenv("OPENAI_API_KEY")
    client := openai.NewClient(apiKey)

    // Moderation check for safety
    moderationReq := openai.ModerationRequest{
        Model: openai.ModerationTextLatest,
        Input: req.Question,
    }
    moderationResp, err := client.Moderations(context.Background(), moderationReq)
    if err != nil {
        log.Printf("Moderation API error: %v", err)
        http.Error(w, "Error checking question safety", http.StatusInternalServerError)
        return
    }

    // Check if the question is flagged as unsafe
    if len(moderationResp.Results) > 0 && moderationResp.Results[0].Flagged {
        log.Printf(
			"User question flagged as unsafe: %s | LoanAmount: %s | TermYears: %s | InterestRate: %s | DownPayment: %s",
			req.Question, req.LoanAmount, req.TermYears, req.InterestRate, req.DownPayment,
		)
        http.Error(w, "Your question was flagged as potentially unsafe or inappropriate. Please rephrase.", http.StatusBadRequest)
        return
    }

    // Build context info for GPT
    contextInfo := fmt.Sprintf(
        "Loan amount: %s, Term: %s, Interest rate: %s, Down payment: %s.",
        req.LoanAmount, req.TermYears, req.InterestRate, req.DownPayment,
    )

    // Call OpenAI GPT
    resp, err := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: openai.GPT4o,
            Messages: []openai.ChatCompletionMessage{
                {
                    Role: openai.ChatMessageRoleSystem,
                    Content: "You are MortgageMoose, a knowledgeable, friendly, and professional mortgage advisor chatbot for a bank. MortgageMoose helps users understand mortgage concepts, loan terms, down payments, interest rates, and other related topics. Always provide clear and concise explanations, including how mortgage calculations work conceptually. If a user asks something unrelated to mortgages or real estate (like personal questions, news, sports, politics, or unrelated financial products), politely refuse to answer and redirect them back to mortgage-related topics. Use simple language and structured answers (like bullet points or short paragraphs) when helpful. If a user says hello or greets you, respond with a short, friendly greeting back as MortgageMoose, then invite them to ask mortgage questions. Feel free to add a touch of humor or moose-themed friendliness if it fits the conversation!",
                },
                {
                    Role: openai.ChatMessageRoleSystem,
                    Content: "Mortgage details: " + contextInfo,
                },
                {
                    Role:    openai.ChatMessageRoleUser,
                    Content: req.Question,
                },
            },
        },
    )
    if err != nil {
        http.Error(w, fmt.Sprintf("OpenAI error: %v", err), http.StatusInternalServerError)
        return
    }

    // Prepare JSON response
    type ChatResponse struct {
        Answer string `json:"answer"`
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(ChatResponse{Answer: resp.Choices[0].Message.Content})
}
