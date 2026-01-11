package pool

import (
	"time"
	eventsurepool "eventsure-server/domain/pool"
)

// PoolDTO represents Pool data transfer object
type PoolDTO struct {
	ID                string    `json:"id"`
	EventID           string    `json:"eventId"`
	Category          string    `json:"category"`
	Status            string    `json:"status"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	CoverageCondition string    `json:"coverageCondition"`
	Premium           float64   `json:"premium"`
	PremiumCurrency   string    `json:"premiumCurrency"`
	MaxPayout         float64   `json:"maxPayout"`
	PayoutCurrency    string    `json:"payoutCurrency"`
	Members           int       `json:"members"`
	PoolSize          float64   `json:"poolSize"`
	PoolTarget        float64   `json:"poolTarget"`
	EndDate           time.Time `json:"endDate"`
	Icon              string    `json:"icon"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

// PoolsResponseDTO represents pools list response
type PoolsResponseDTO struct {
	Pools []PoolDTO `json:"pools"`
	Total int       `json:"total"`
	Page  int       `json:"page"`
	Limit int       `json:"limit"`
}

// ToDTO converts domain Pool to DTO
func ToDTO(pool *eventsurepool.Pool) PoolDTO {
	return PoolDTO{
		ID:                pool.ID(),
		EventID:           pool.EventID(),
		Category:          string(pool.Category()),
		Status:            string(pool.Status()),
		Title:             pool.Title(),
		Description:       pool.Description(),
		CoverageCondition: pool.CoverageCondition(),
		Premium:           pool.Premium(),
		PremiumCurrency:   pool.PremiumCurrency(),
		MaxPayout:         pool.MaxPayout(),
		PayoutCurrency:    pool.PayoutCurrency(),
		Members:           pool.Members(),
		PoolSize:          pool.PoolSize(),
		PoolTarget:        pool.PoolTarget(),
		EndDate:           pool.EndDate(),
		Icon:              string(pool.Icon()),
		CreatedAt:         pool.CreatedAt(),
		UpdatedAt:         pool.UpdatedAt(),
	}
}
