package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	episodeusecase "eventsure-server/application/episode"
	httprouter "eventsure-server/interface/http"
	"eventsure-server/interface/http/controller"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load .env file
	workDir, err := os.Getwd()
	if err == nil {
		// 가능한 .env 파일 경로들
		possiblePaths := []string{
			filepath.Join(workDir, ".env"),             // 현재 디렉토리
			filepath.Join(workDir, "..", ".env"),       // 상위 디렉토리
			filepath.Join(workDir, "..", "..", ".env"), // 상위 상위 디렉토리
		}

		for _, envPath := range possiblePaths {
			if err := godotenv.Load(envPath); err == nil {
				log.Printf("Loaded .env file from: %s\n", envPath)
				break
			}
		}
	}

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
