package event

import (
	"time"
	eventsureevent "eventsure-server/domain/event"
)

// EventDTO represents Event data transfer object
type EventDTO struct {
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

// EventDetailDTO extends EventDTO with rules
type EventDetailDTO struct {
	EventDTO
	Rules *EventRulesDTO `json:"rules,omitempty"`
}

// EventRulesDTO represents event rules data transfer object
type EventRulesDTO struct {
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

// EventsResponseDTO represents events list response
type EventsResponseDTO struct {
	Events []EventDTO `json:"events"`
	Total  int        `json:"total"`
	Page   int        `json:"page"`
	Limit  int        `json:"limit"`
}

// ToDTO converts domain Event to DTO
func ToDTO(event *eventsureevent.Event) EventDTO {
	var oracle *OracleDTO
	if event.Oracle() != nil {
		oracle = &OracleDTO{
			DataSource:    event.Oracle().DataSource(),
			ResolutionTime: event.Oracle().ResolutionTime(),
		}
	}

	var subtitle *string
	if event.Subtitle() != nil {
		subtitle = event.Subtitle()
	}

	return EventDTO{
		ID:                     event.ID(),
		Category:               string(event.Category()),
		Status:                 string(event.Status()),
		Title:                  event.Title(),
		Subtitle:               subtitle,
		EventWindow:            event.EventWindow(),
		TriggerCondition:       event.TriggerCondition(),
		Premium:                event.Premium(),
		PremiumCurrency:        event.PremiumCurrency(),
		MaxPayout:              event.MaxPayout(),
		PayoutCurrency:         event.PayoutCurrency(),
		AdditionalContributions: event.AdditionalContributions(),
		PoolLogic:              event.PoolLogic(),
		Oracle:                 oracle,
		PoolClosesAt:           event.PoolClosesAt(),
		EventEndsAt:            event.EventEndsAt(),
		Icon:                   string(event.Icon()),
		CreatedAt:              event.CreatedAt(),
		UpdatedAt:              event.UpdatedAt(),
	}
}

// ToDetailDTO converts domain Event to EventDetailDTO
func ToDetailDTO(event *eventsureevent.Event) EventDetailDTO {
	eventDTO := ToDTO(event)

	var oracle OracleDTO
	if event.Oracle() != nil {
		oracle = OracleDTO{
			DataSource:    event.Oracle().DataSource(),
			ResolutionTime: event.Oracle().ResolutionTime(),
		}
	} else {
		oracle = OracleDTO{
			DataSource:    "N/A",
			ResolutionTime: "N/A",
		}
	}

	additionalContributions := "none"
	if event.AdditionalContributions() != nil {
		additionalContributions = *event.AdditionalContributions()
	}

	poolLogic := "none"
	if event.PoolLogic() != nil {
		poolLogic = *event.PoolLogic()
	}

	return EventDetailDTO{
		EventDTO: eventDTO,
		Rules: &EventRulesDTO{
			CoveredEvent: CoveredEventDTO{
				Event:            event.Title(),
				EventWindow:      event.EventWindow(),
				TriggerCondition: event.TriggerCondition(),
			},
			Oracle: oracle,
			FinancialTerms: FinancialTermsDTO{
				Premium:                event.Premium(),
				MaxPayout:              event.MaxPayout(),
				AdditionalContributions: additionalContributions,
			},
			PoolLogic: poolLogic,
		},
	}
}
