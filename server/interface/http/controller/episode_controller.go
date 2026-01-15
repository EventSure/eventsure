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

// GetUserEpisodes handles GET /api/user-episodes?user=xxx or GET /api/user-episodes?episode=xxx
func (c *EpisodeController) GetUserEpisodes(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user")
	episode := r.URL.Query().Get("episode")

	// user 쿼리 파라미터가 있으면 user의 episodes 조회
	if user != "" {
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
		return
	}

	// episode 쿼리 파라미터가 있으면 episode의 users 조회
	if episode != "" {
		response, err := c.episodeUseCase.GetEpisodeUsers(episode)
		if err != nil {
			if err.Error() == "episode is required" {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// 둘 다 없으면 에러
	http.Error(w, "user or episode query parameter is required", http.StatusBadRequest)
}

// GetEpisodes handles GET /api/episodes
// Returns all episode contract addresses from Etherscan
func (c *EpisodeController) GetEpisodes(w http.ResponseWriter, r *http.Request) {
	response, err := c.episodeUseCase.GetAllEpisodes()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetEpisodeEvents handles GET /api/episodes/{episode}/events
// Returns all events for a specific episode contract address
func (c *EpisodeController) GetEpisodeEvents(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	episode := vars["episode"]

	if episode == "" {
		http.Error(w, "episode parameter is required", http.StatusBadRequest)
		return
	}

	response, err := c.episodeUseCase.GetEpisodeEvents(episode)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
