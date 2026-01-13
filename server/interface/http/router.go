package http

import (
	"eventsure-server/interface/http/controller"
	"eventsure-server/interface/http/middleware"

	"github.com/gorilla/mux"
)

// Router sets up HTTP routes
type Router struct {
	episodeController     *controller.EpisodeController
	poolController        *controller.PoolController
	transactionController *controller.TransactionController
	statsController       *controller.StatsController
}

// NewRouter creates a new Router
func NewRouter(
	episodeController *controller.EpisodeController,
	poolController *controller.PoolController,
	transactionController *controller.TransactionController,
	statsController *controller.StatsController,
) *Router {
	return &Router{
		episodeController:     episodeController,
		poolController:        poolController,
		transactionController: transactionController,
		statsController:       statsController,
	}
}

// SetupRoutes sets up all routes
func (r *Router) SetupRoutes(mux *mux.Router) {
	api := mux.PathPrefix("/api").Subrouter()

	// Apply logging middleware to all API routes
	api.Use(middleware.LoggingMiddleware)

	// Phase 1: 필수 엔드포인트
	api.HandleFunc("/pools", r.poolController.GetPools).Methods("GET")
	api.HandleFunc("/stats/home", r.statsController.GetHomeStats).Methods("GET")

	// Phase 2: 중요 엔드포인트
	api.HandleFunc("/transactions", r.transactionController.GetTransactions).Methods("GET")
	api.HandleFunc("/transactions/stats", r.transactionController.GetTransactionStats).Methods("GET")

	// User Episode endpoints
	api.HandleFunc("/user-episodes", r.episodeController.CreateUserEpisode).Methods("POST")
	api.HandleFunc("/user-episodes", r.episodeController.GetUserEpisodes).Methods("GET")
	// TODO: User endpoints will be added later
}
