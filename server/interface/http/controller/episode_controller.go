package controller

import (
	"encoding/json"
	"net/http"

	episodeusecase "eventsure-server/application/episode"
)

// EpisodeController handles HTTP requests for episodes
type EpisodeController struct {
	episodeUseCase *episodeusecase.UseCase
}

// NewEpisodeController creates a new EpisodeController
func NewEpisodeController(episodeUseCase *episodeusecase.UseCase) *EpisodeController {
	return &EpisodeController{
		episodeUseCase: episodeUseCase,
	}
}

// CreateUserEpisode handles POST /api/user-episodes
func (c *EpisodeController) CreateUserEpisode(w http.ResponseWriter, r *http.Request) {
	var req episodeusecase.CreateUserEpisodeRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := c.episodeUseCase.CreateUserEpisode(req)
	if err != nil {
		if err.Error() == "user is required" || err.Error() == "episode is required" {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// GetUserEpisodes handles GET /api/user-episodes?user=xxx
func (c *EpisodeController) GetUserEpisodes(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user")
	if user == "" {
		http.Error(w, "user query parameter is required", http.StatusBadRequest)
		return
	}

	response, err := c.episodeUseCase.GetUserEpisodes(user)
	if err != nil {
		if err.Error() == "user is required" {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
