package http

import (
	"net/http"

	"eventsure-server/interface/http/controller"
	"eventsure-server/interface/http/middleware"

	"github.com/gorilla/mux"
)

// Router sets up HTTP routes
type Router struct {
	episodeController *controller.EpisodeController
}

// NewRouter creates a new Router
func NewRouter(episodeController *controller.EpisodeController) *Router {
	return &Router{
		episodeController: episodeController,
	}
}

// SetupRoutes sets up all routes
func (r *Router) SetupRoutes(mux *mux.Router) {
	// Health check endpoint (for Railway/deployment health checks)
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	api := mux.PathPrefix("/api").Subrouter()

	// Apply logging middleware to all API routes
	api.Use(middleware.LoggingMiddleware)

	// User Episode endpoints
	api.HandleFunc("/user-episodes", r.episodeController.CreateUserEpisode).Methods("POST")
	api.HandleFunc("/user-episodes", r.episodeController.GetUserEpisodes).Methods("GET")
	// TODO: User endpoints will be added later
}
