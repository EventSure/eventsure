package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	r := mux.NewRouter()
	api := r.PathPrefix("/api").Subrouter()

	// Phase 1: 필수 엔드포인트
	api.HandleFunc("/events", getEvents).Methods("GET")
	api.HandleFunc("/events/{eventId}", getEventDetail).Methods("GET")
	api.HandleFunc("/pools", getPools).Methods("GET")
	api.HandleFunc("/stats/home", getHomeStats).Methods("GET")

	// Phase 2: 중요 엔드포인트
	api.HandleFunc("/transactions", getTransactions).Methods("GET")
	api.HandleFunc("/transactions/stats", getTransactionStats).Methods("GET")
	api.HandleFunc("/users/me/events", getMyEvents).Methods("GET")
	api.HandleFunc("/users/me/events/{eventId}/dashboard", getEventDashboard).Methods("GET")

	// CORS 설정
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
