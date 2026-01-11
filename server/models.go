package main

import "time"

// Event represents an insurance event
type Event struct {
	ID                     string    `json:"id"`
	Category               string    `json:"category"` // flightDelay, weather, tripCancel
	Status                 string    `json:"status"`   // recruiting, active, settling, completed
	Title                  string    `json:"title"`
	Subtitle               *string   `json:"subtitle,omitempty"`
	EventWindow            string    `json:"eventWindow"`
	TriggerCondition       string    `json:"triggerCondition"`
	Premium                float64   `json:"premium"`
	PremiumCurrency        string    `json:"premiumCurrency"`
	MaxPayout              float64   `json:"maxPayout"`
	PayoutCurrency         string    `json:"payoutCurrency"`
	AdditionalContributions *string  `json:"additionalContributions,omitempty"`
	PoolLogic              *string   `json:"poolLogic,omitempty"`
	Oracle                 *Oracle   `json:"oracle,omitempty"`
	PoolClosesAt           *time.Time `json:"poolClosesAt,omitempty"`
	EventEndsAt            *time.Time `json:"eventEndsAt,omitempty"`
	Icon                   string    `json:"icon"` // plane, cloud, suitcase
	CreatedAt              time.Time `json:"createdAt"`
	UpdatedAt              time.Time `json:"updatedAt"`
}

// Oracle represents oracle information
type Oracle struct {
	DataSource    string `json:"dataSource"`
	ResolutionTime string `json:"resolutionTime"`
}

// EventRules represents detailed event rules
type EventRules struct {
	CoveredEvent   CoveredEvent   `json:"coveredEvent"`
	Oracle         Oracle         `json:"oracle"`
	FinancialTerms FinancialTerms `json:"financialTerms"`
	PoolLogic      string         `json:"poolLogic"`
}

// CoveredEvent represents covered event details
type CoveredEvent struct {
	Event            string `json:"event"`
	EventWindow      string `json:"eventWindow"`
	TriggerCondition string `json:"triggerCondition"`
}

// FinancialTerms represents financial terms
type FinancialTerms struct {
	Premium                float64 `json:"premium"`
	MaxPayout              float64 `json:"maxPayout"`
	AdditionalContributions string  `json:"additionalContributions"`
}

// EventDetail extends Event with rules
type EventDetail struct {
	Event
	Rules *EventRules `json:"rules,omitempty"`
}

// Pool represents an insurance pool
type Pool struct {
	ID               string    `json:"id"`
	EventID          string    `json:"eventId"`
	Category         string    `json:"category"`
	Status           string    `json:"status"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	CoverageCondition string   `json:"coverageCondition"`
	Premium          float64   `json:"premium"`
	PremiumCurrency  string    `json:"premiumCurrency"`
	MaxPayout        float64   `json:"maxPayout"`
	PayoutCurrency   string    `json:"payoutCurrency"`
	Members          int       `json:"members"`
	PoolSize         float64   `json:"poolSize"`
	PoolTarget       float64   `json:"poolTarget"`
	EndDate          time.Time `json:"endDate"`
	Icon             string    `json:"icon"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

// Transaction represents a blockchain transaction
type Transaction struct {
	ID          string     `json:"id"`
	Type        string     `json:"type"` // purchase, claim, payout, stake
	Hash        string     `json:"hash"`
	Address     string     `json:"address"`
	Amount      string     `json:"amount"`
	Currency    string     `json:"currency"`
	Flight      *string    `json:"flight,omitempty"`
	EventID     *string    `json:"eventId,omitempty"`
	PoolID      *string    `json:"poolId,omitempty"`
	Timestamp   time.Time  `json:"timestamp"`
	BlockNumber int64      `json:"blockNumber"`
	Status      string     `json:"status"` // pending, confirmed, failed
}

// NetworkStats represents network statistics
type NetworkStats struct {
	Network    string `json:"network"`
	BlockNumber int64  `json:"blockNumber"`
	GasPrice   string `json:"gasPrice"`
	GasUnit    string `json:"gasUnit"`
}

// TransactionStats represents transaction statistics
type TransactionStats struct {
	TotalVolume24h      float64      `json:"totalVolume24h"`
	VolumeCurrency      string       `json:"volumeCurrency"`
	ActivePolicies      int          `json:"activePolicies"`
	TransactionsPerSecond float64    `json:"transactionsPerSecond"`
	NetworkStats        NetworkStats `json:"networkStats"`
}

// CurrentData represents real-time event data
type CurrentData struct {
	FlightStatus      *string   `json:"flightStatus,omitempty"`
	CurrentDelay      *string   `json:"currentDelay,omitempty"`
	ProgressToTrigger *int      `json:"progressToTrigger,omitempty"`
	TriggerThreshold  *string   `json:"triggerThreshold,omitempty"`
	IsLive            bool      `json:"isLive"`
	LastUpdated       *time.Time `json:"lastUpdated,omitempty"`
}

// EventSummary represents a summary of an event for user participation
type EventSummary struct {
	ID               string `json:"id"`
	Title            string `json:"title"`
	Subtitle         *string `json:"subtitle,omitempty"`
	TriggerCondition string `json:"triggerCondition"`
}

// UserParticipation represents user's participation in an event
type UserParticipation struct {
	EventID       string       `json:"eventId"`
	PoolID        string       `json:"poolId"`
	Status        string       `json:"status"` // inForce, completed, cancelled
	Premium       float64      `json:"premium"`
	PremiumCurrency string     `json:"premiumCurrency"`
	MaxPayout     float64      `json:"maxPayout"`
	PayoutCurrency string      `json:"payoutCurrency"`
	MaxLoss       float64      `json:"maxLoss"`
	JoinedAt      time.Time    `json:"joinedAt"`
	PoolClosesAt  time.Time    `json:"poolClosesAt"`
	EventEndsAt   time.Time    `json:"eventEndsAt"`
	Event         EventSummary `json:"event"`
	CurrentData   *CurrentData `json:"currentData,omitempty"`
}

// HomeStats represents home page statistics
type HomeStats struct {
	TVL             float64 `json:"tvl"`
	TVLCurrency     string  `json:"tvlCurrency"`
	TotalPolicies   int     `json:"totalPolicies"`
	ClaimRate       float64 `json:"claimRate"`
	ClaimRateUnit   string  `json:"claimRateUnit"`
	AveragePayoutTime int   `json:"averagePayoutTime"`
	PayoutTimeUnit  string  `json:"payoutTimeUnit"`
}

// EventsResponse represents events list response
type EventsResponse struct {
	Events []Event `json:"events"`
	Total  int     `json:"total"`
	Page   int     `json:"page"`
	Limit  int     `json:"limit"`
}

// PoolsResponse represents pools list response
type PoolsResponse struct {
	Pools []Pool `json:"pools"`
	Total int    `json:"total"`
	Page  int    `json:"page"`
	Limit int    `json:"limit"`
}

// TransactionsResponse represents transactions list response
type TransactionsResponse struct {
	Transactions []Transaction `json:"transactions"`
	Total        int           `json:"total"`
	Limit        int           `json:"limit"`
	Offset       int           `json:"offset"`
}

// UserEventsResponse represents user events response
type UserEventsResponse struct {
	Participations []UserParticipation `json:"participations"`
}

// DashboardResponse represents dashboard response
type DashboardResponse struct {
	Participation UserParticipation `json:"participation"`
	Event         EventDetail       `json:"event"`
	CurrentData   CurrentData       `json:"currentData"`
	Countdown     Countdown         `json:"countdown"`
}

// Countdown represents countdown information
type Countdown struct {
	PoolClosesIn int64 `json:"poolClosesIn"` // seconds
	EventEndsIn  int64 `json:"eventEndsIn"`  // seconds
}
