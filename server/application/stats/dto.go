package stats

import eventsurestats "eventsure-server/domain/stats"

// StatsDTO represents Stats data transfer object
type StatsDTO struct {
	TVL               float64 `json:"tvl"`
	TVLCurrency       string  `json:"tvlCurrency"`
	TotalPolicies     int     `json:"totalPolicies"`
	ClaimRate         float64 `json:"claimRate"`
	ClaimRateUnit     string  `json:"claimRateUnit"`
	AveragePayoutTime int     `json:"averagePayoutTime"`
	PayoutTimeUnit    string  `json:"payoutTimeUnit"`
}

// ToDTO converts domain Stats to DTO
func ToDTO(stats *eventsurestats.Stats) StatsDTO {
	return StatsDTO{
		TVL:               stats.TVL(),
		TVLCurrency:       stats.TVLCurrency(),
		TotalPolicies:     stats.TotalPolicies(),
		ClaimRate:         stats.ClaimRate(),
		ClaimRateUnit:     stats.ClaimRateUnit(),
		AveragePayoutTime: stats.AveragePayoutTime(),
		PayoutTimeUnit:    stats.PayoutTimeUnit(),
	}
}
