package controller

import (
	"encoding/json"
	"net/http"

	statsusecase "eventsure-server/application/stats"
)

// StatsController handles HTTP requests for statistics
type StatsController struct {
	statsUseCase *statsusecase.UseCase
}

// NewStatsController creates a new StatsController
func NewStatsController(statsUseCase *statsusecase.UseCase) *StatsController {
	return &StatsController{
		statsUseCase: statsUseCase,
	}
}

// GetHomeStats handles GET /api/stats/home
func (c *StatsController) GetHomeStats(w http.ResponseWriter, r *http.Request) {
	response, err := c.statsUseCase.GetHomeStats()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
