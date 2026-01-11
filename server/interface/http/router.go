package http

import (
	"eventsure-server/interface/http/controller"

	"github.com/gorilla/mux"
)

// Router sets up HTTP routes
type Router struct {
	eventController       *controller.EventController
	poolController        *controller.PoolController
	transactionController *controller.TransactionController
	statsController       *controller.StatsController
}

// NewRouter creates a new Router
func NewRouter(
	eventController *controller.EventController,
	poolController *controller.PoolController,
	transactionController *controller.TransactionController,
	statsController *controller.StatsController,
) *Router {
	return &Router{
		eventController:       eventController,
		poolController:        poolController,
		transactionController: transactionController,
		statsController:       statsController,
	}
}

// SetupRoutes sets up all routes
func (r *Router) SetupRoutes(mux *mux.Router) {
	api := mux.PathPrefix("/api").Subrouter()

	// Phase 1: 필수 엔드포인트
	api.HandleFunc("/events", r.eventController.GetEvents).Methods("GET")
	api.HandleFunc("/events/{eventId}", r.eventController.GetEventDetail).Methods("GET")
	api.HandleFunc("/pools", r.poolController.GetPools).Methods("GET")
	api.HandleFunc("/stats/home", r.statsController.GetHomeStats).Methods("GET")

	// Phase 2: 중요 엔드포인트
	api.HandleFunc("/transactions", r.transactionController.GetTransactions).Methods("GET")
	api.HandleFunc("/transactions/stats", r.transactionController.GetTransactionStats).Methods("GET")
	// TODO: User endpoints will be added later
}
