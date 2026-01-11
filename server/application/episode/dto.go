package episode

import (
	"time"
	eventsureepisode "eventsure-server/domain/episode"
)

// EpisodeDTO represents Episode data transfer object
type EpisodeDTO struct {
	ID                     string     `json:"id"`
	Category               string     `json:"category"`
	Status                 string     `json:"status"`
	Title                  string     `json:"title"`
	Subtitle               *string    `json:"subtitle,omitempty"`
	EventWindow            string     `json:"eventWindow"`
	TriggerCondition       string     `json:"triggerCondition"`
	Premium                float64    `json:"premium"`
	PremiumCurrency        string     `json:"premiumCurrency"`
	MaxPayout              float64    `json:"maxPayout"`
	PayoutCurrency         string     `json:"payoutCurrency"`
	AdditionalContributions *string   `json:"additionalContributions,omitempty"`
	PoolLogic              *string    `json:"poolLogic,omitempty"`
	Oracle                 *OracleDTO `json:"oracle,omitempty"`
	PoolClosesAt           *time.Time `json:"poolClosesAt,omitempty"`
	EventEndsAt            *time.Time `json:"eventEndsAt,omitempty"`
	Icon                   string     `json:"icon"`
	CreatedAt              time.Time  `json:"createdAt"`
	UpdatedAt              time.Time  `json:"updatedAt"`
}

// OracleDTO represents oracle data transfer object
type OracleDTO struct {
	DataSource    string `json:"dataSource"`
	ResolutionTime string `json:"resolutionTime"`
}

// EpisodeDetailDTO extends EpisodeDTO with rules
type EpisodeDetailDTO struct {
	EpisodeDTO
	Rules *EpisodeRulesDTO `json:"rules,omitempty"`
}

// EpisodeRulesDTO represents episode rules data transfer object
type EpisodeRulesDTO struct {
	CoveredEvent   CoveredEventDTO   `json:"coveredEvent"`
	Oracle         OracleDTO         `json:"oracle"`
	FinancialTerms FinancialTermsDTO `json:"financialTerms"`
	PoolLogic      string            `json:"poolLogic"`
}

// CoveredEventDTO represents covered event data transfer object
type CoveredEventDTO struct {
	Event            string `json:"event"`
	EventWindow      string `json:"eventWindow"`
	TriggerCondition string `json:"triggerCondition"`
}

// FinancialTermsDTO represents financial terms data transfer object
type FinancialTermsDTO struct {
	Premium                float64 `json:"premium"`
	MaxPayout              float64 `json:"maxPayout"`
	AdditionalContributions string  `json:"additionalContributions"`
}

// EpisodesResponseDTO represents episodes list response
type EpisodesResponseDTO struct {
	Episodes []EpisodeDTO `json:"episodes"`
	Total    int          `json:"total"`
	Page     int          `json:"page"`
	Limit    int          `json:"limit"`
}

// ToDTO converts domain Episode to DTO
func ToDTO(ep *eventsureepisode.Episode) EpisodeDTO {
	var oracle *OracleDTO
	if ep.Oracle() != nil {
		oracle = &OracleDTO{
			DataSource:    ep.Oracle().DataSource(),
			ResolutionTime: ep.Oracle().ResolutionTime(),
		}
	}

	var subtitle *string
	if ep.Subtitle() != nil {
		subtitle = ep.Subtitle()
	}

	return EpisodeDTO{
		ID:                     ep.ID(),
		Category:               string(ep.Category()),
		Status:                 string(ep.Status()),
		Title:                  ep.Title(),
		Subtitle:               subtitle,
		EventWindow:            ep.EventWindow(),
		TriggerCondition:       ep.TriggerCondition(),
		Premium:                ep.Premium(),
		PremiumCurrency:        ep.PremiumCurrency(),
		MaxPayout:              ep.MaxPayout(),
		PayoutCurrency:         ep.PayoutCurrency(),
		AdditionalContributions: ep.AdditionalContributions(),
		PoolLogic:              ep.PoolLogic(),
		Oracle:                 oracle,
		PoolClosesAt:           ep.PoolClosesAt(),
		EventEndsAt:            ep.EventEndsAt(),
		Icon:                   string(ep.Icon()),
		CreatedAt:              ep.CreatedAt(),
		UpdatedAt:              ep.UpdatedAt(),
	}
}

// ToDetailDTO converts domain Episode to EpisodeDetailDTO
func ToDetailDTO(ep *eventsureepisode.Episode) EpisodeDetailDTO {
	episodeDTO := ToDTO(ep)

	var oracle OracleDTO
	if ep.Oracle() != nil {
		oracle = OracleDTO{
			DataSource:    ep.Oracle().DataSource(),
			ResolutionTime: ep.Oracle().ResolutionTime(),
		}
	} else {
		oracle = OracleDTO{
			DataSource:    "N/A",
			ResolutionTime: "N/A",
		}
	}

	additionalContributions := "none"
	if ep.AdditionalContributions() != nil {
		additionalContributions = *ep.AdditionalContributions()
	}

	poolLogic := "none"
	if ep.PoolLogic() != nil {
		poolLogic = *ep.PoolLogic()
	}

	return EpisodeDetailDTO{
		EpisodeDTO: episodeDTO,
		Rules: &EpisodeRulesDTO{
			CoveredEvent: CoveredEventDTO{
				Event:            ep.Title(),
				EventWindow:      ep.EventWindow(),
				TriggerCondition: ep.TriggerCondition(),
			},
			Oracle: oracle,
			FinancialTerms: FinancialTermsDTO{
				Premium:                ep.Premium(),
				MaxPayout:              ep.MaxPayout(),
				AdditionalContributions: additionalContributions,
			},
			PoolLogic: poolLogic,
		},
	}
}
