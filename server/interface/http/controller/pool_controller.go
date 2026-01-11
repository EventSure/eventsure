package controller

import (
	"encoding/json"
	"net/http"

	poolusecase "eventsure-server/application/pool"
)

// PoolController handles HTTP requests for pools
type PoolController struct {
	poolUseCase *poolusecase.UseCase
}

// NewPoolController creates a new PoolController
func NewPoolController(poolUseCase *poolusecase.UseCase) *PoolController {
	return &PoolController{
		poolUseCase: poolUseCase,
	}
}

// GetPools handles GET /api/pools
func (c *PoolController) GetPools(w http.ResponseWriter, r *http.Request) {
	var status *string
	var category *string

	if s := r.URL.Query().Get("status"); s != "" {
		status = &s
	}
	if cat := r.URL.Query().Get("category"); cat != "" {
		category = &cat
	}

	query := poolusecase.GetPoolsQuery{
		Status:   status,
		Category: category,
	}

	response, err := c.poolUseCase.GetPools(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
