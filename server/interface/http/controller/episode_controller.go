package controller

import (
	"encoding/json"
	"net/http"

	episodeusecase "eventsure-server/application/episode"

	"github.com/gorilla/mux"
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

// GetEpisodes handles GET /api/episodes
func (c *EpisodeController) GetEpisodes(w http.ResponseWriter, r *http.Request) {
	var status *string
	var category *string

	if s := r.URL.Query().Get("status"); s != "" {
		status = &s
	}
	if cat := r.URL.Query().Get("category"); cat != "" {
		category = &cat
	}

	query := episodeusecase.GetEpisodesQuery{
		Status:   status,
		Category: category,
	}

	response, err := c.episodeUseCase.GetEpisodes(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetEpisodeDetail handles GET /api/episodes/{episodeId}
func (c *EpisodeController) GetEpisodeDetail(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	episodeID := vars["episodeId"]

	response, err := c.episodeUseCase.GetEpisodeDetail(episodeID)
	if err != nil {
		if err.Error() == "episode not found" {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
