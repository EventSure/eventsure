package main

import (
	"log"
	"net/http"
	"os"

	episodeusecase "eventsure-server/application/episode"
	httprouter "eventsure-server/interface/http"
	"eventsure-server/interface/http/controller"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// Initialize use cases
	episodeUseCase := episodeusecase.NewUseCase()

	// Initialize controllers
	episodeController := controller.NewEpisodeController(episodeUseCase)

	// Initialize router
	router := httprouter.NewRouter(episodeController)

	// Setup mux
	r := mux.NewRouter()
	router.SetupRoutes(r)

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
