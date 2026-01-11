package main

import (
	"log"
	"net/http"
	"os"

	eventusecase "eventsure-server/application/event"
	poolusecase "eventsure-server/application/pool"
	statsusecase "eventsure-server/application/stats"
	transactionusecase "eventsure-server/application/transaction"
	httprouter "eventsure-server/interface/http"
	"eventsure-server/interface/http/controller"
	"eventsure-server/infrastructure/mock"
	"eventsure-server/infrastructure/repository"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// Initialize repositories
	eventRepo := repository.NewEventRepository()
	poolRepo := repository.NewPoolRepository()
	txRepo := repository.NewTransactionRepository()

	// Initialize mock data
	events := mock.CreateMockEvents()
	pools := mock.CreateMockPools()
	transactions := mock.CreateMockTransactions()

	eventRepo.InitializeMockData(events)
	poolRepo.InitializeMockData(pools)
	txRepo.InitializeMockData(transactions)

	// Initialize use cases
	eventUseCase := eventusecase.NewUseCase(eventRepo)
	poolUseCase := poolusecase.NewUseCase(poolRepo)
	txUseCase := transactionusecase.NewUseCase(txRepo)
	statsUseCase := statsusecase.NewUseCase()

	// Initialize controllers
	eventController := controller.NewEventController(eventUseCase)
	poolController := controller.NewPoolController(poolUseCase)
	txController := controller.NewTransactionController(txUseCase)
	statsController := controller.NewStatsController(statsUseCase)

	// Initialize router
	router := httprouter.NewRouter(
		eventController,
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
