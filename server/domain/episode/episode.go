package episode

import (
	"time"
)

// Episode is the Aggregate Root for the Episode domain
type Episode struct {
	id                      string
	category                Category
	status                  Status
	title                   string
	subtitle                *string
	eventWindow             string
	triggerCondition        string
	premium                 float64
	premiumCurrency         string
	maxPayout               float64
	payoutCurrency          string
	additionalContributions *string
	poolLogic               *string
	oracle                  *Oracle
	poolClosesAt            *time.Time
	eventEndsAt             *time.Time
	icon                    Icon
	createdAt               time.Time
	updatedAt               time.Time
}

// Category represents episode category
type Category string

const (
	CategoryFlightDelay Category = "flightDelay"
	CategoryWeather     Category = "weather"
	CategoryTripCancel  Category = "tripCancel"
)

// Status represents episode status
type Status string

const (
	StatusRecruiting Status = "recruiting"
	StatusActive     Status = "active"
	StatusSettling   Status = "settling"
	StatusCompleted  Status = "completed"
)

// Icon represents episode icon type
type Icon string

const (
	IconPlane    Icon = "plane"
	IconCloud    Icon = "cloud"
	IconSuitcase Icon = "suitcase"
)

// Oracle represents oracle information
type Oracle struct {
	dataSource     string
	resolutionTime string
}

// NewOracle creates a new Oracle
func NewOracle(dataSource, resolutionTime string) *Oracle {
	return &Oracle{
		dataSource:     dataSource,
		resolutionTime: resolutionTime,
	}
}

// DataSource returns oracle data source
func (o *Oracle) DataSource() string {
	if o == nil {
		return ""
	}
	return o.dataSource
}

// ResolutionTime returns oracle resolution time
func (o *Oracle) ResolutionTime() string {
	if o == nil {
		return ""
	}
	return o.resolutionTime
}

// NewEpisode creates a new Episode aggregate root
func NewEpisode(
	id string,
	category Category,
	status Status,
	title string,
	eventWindow string,
	triggerCondition string,
	premium float64,
	premiumCurrency string,
	maxPayout float64,
	payoutCurrency string,
	icon Icon,
) *Episode {
	now := time.Now()
	return &Episode{
		id:               id,
		category:         category,
		status:           status,
		title:            title,
		eventWindow:      eventWindow,
		triggerCondition: triggerCondition,
		premium:          premium,
		premiumCurrency:  premiumCurrency,
		maxPayout:        maxPayout,
		payoutCurrency:   payoutCurrency,
		icon:             icon,
		createdAt:        now,
		updatedAt:        now,
	}
}

// ID returns episode ID
func (e *Episode) ID() string {
	return e.id
}

// Category returns episode category
func (e *Episode) Category() Category {
	return e.category
}

// Status returns episode status
func (e *Episode) Status() Status {
	return e.status
}

// Title returns episode title
func (e *Episode) Title() string {
	return e.title
}

// Subtitle returns episode subtitle
func (e *Episode) Subtitle() *string {
	return e.subtitle
}

// SetSubtitle sets episode subtitle
func (e *Episode) SetSubtitle(subtitle string) {
	e.subtitle = &subtitle
}

// EventWindow returns event window
func (e *Episode) EventWindow() string {
	return e.eventWindow
}

// TriggerCondition returns trigger condition
func (e *Episode) TriggerCondition() string {
	return e.triggerCondition
}

// Premium returns premium amount
func (e *Episode) Premium() float64 {
	return e.premium
}

// PremiumCurrency returns premium currency
func (e *Episode) PremiumCurrency() string {
	return e.premiumCurrency
}

// MaxPayout returns max payout amount
func (e *Episode) MaxPayout() float64 {
	return e.maxPayout
}

// PayoutCurrency returns payout currency
func (e *Episode) PayoutCurrency() string {
	return e.payoutCurrency
}

// AdditionalContributions returns additional contributions
func (e *Episode) AdditionalContributions() *string {
	return e.additionalContributions
}

// SetAdditionalContributions sets additional contributions
func (e *Episode) SetAdditionalContributions(contributions string) {
	e.additionalContributions = &contributions
}

// PoolLogic returns pool logic description
func (e *Episode) PoolLogic() *string {
	return e.poolLogic
}

// SetPoolLogic sets pool logic description
func (e *Episode) SetPoolLogic(logic string) {
	e.poolLogic = &logic
}

// Oracle returns oracle information
func (e *Episode) Oracle() *Oracle {
	return e.oracle
}

// SetOracle sets oracle information
func (e *Episode) SetOracle(oracle *Oracle) {
	e.oracle = oracle
}

// PoolClosesAt returns pool closes time
func (e *Episode) PoolClosesAt() *time.Time {
	return e.poolClosesAt
}

// SetPoolClosesAt sets pool closes time
func (e *Episode) SetPoolClosesAt(t time.Time) {
	e.poolClosesAt = &t
}

// EventEndsAt returns event ends time
func (e *Episode) EventEndsAt() *time.Time {
	return e.eventEndsAt
}

// SetEventEndsAt sets event ends time
func (e *Episode) SetEventEndsAt(t time.Time) {
	e.eventEndsAt = &t
}

// Icon returns episode icon
func (e *Episode) Icon() Icon {
	return e.icon
}

// CreatedAt returns created at time
func (e *Episode) CreatedAt() time.Time {
	return e.createdAt
}

// UpdatedAt returns updated at time
func (e *Episode) UpdatedAt() time.Time {
	return e.updatedAt
}

// UpdateStatus updates episode status
func (e *Episode) UpdateStatus(status Status) {
	e.status = status
	e.updatedAt = time.Now()
}
