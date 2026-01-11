package main

import (
	"log"
	"net/http"
	"os"

	episodeusecase "eventsure-server/application/episode"
	poolusecase "eventsure-server/application/pool"
	statsusecase "eventsure-server/application/stats"
	transactionusecase "eventsure-server/application/transaction"
	"eventsure-server/infrastructure/mock"
	"eventsure-server/infrastructure/repository"
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

	// Initialize repositories
	episodeRepo := repository.NewEpisodeRepository()
	poolRepo := repository.NewPoolRepository()
	txRepo := repository.NewTransactionRepository()

	// Initialize mock data
	episodes := mock.CreateMockEpisodes()
	pools := mock.CreateMockPools()
	transactions := mock.CreateMockTransactions()

	episodeRepo.InitializeMockData(episodes)
	poolRepo.InitializeMockData(pools)
	txRepo.InitializeMockData(transactions)

	// Initialize use cases
	episodeUseCase := episodeusecase.NewUseCase(episodeRepo)
	poolUseCase := poolusecase.NewUseCase(poolRepo)
	txUseCase := transactionusecase.NewUseCase(txRepo)
	statsUseCase := statsusecase.NewUseCase()

	// Initialize controllers
	episodeController := controller.NewEpisodeController(episodeUseCase)
	poolController := controller.NewPoolController(poolUseCase)
	txController := controller.NewTransactionController(txUseCase)
	statsController := controller.NewStatsController(statsUseCase)

	// Initialize router
	router := httprouter.NewRouter(
		episodeController,
		poolController,
		txController,
		statsController,
	)

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
