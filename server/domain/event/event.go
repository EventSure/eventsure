package event

import (
	"time"
)

// Event is the Aggregate Root for the Event domain
type Event struct {
	id                     string
	category               Category
	status                 Status
	title                  string
	subtitle               *string
	eventWindow            string
	triggerCondition       string
	premium                float64
	premiumCurrency        string
	maxPayout              float64
	payoutCurrency         string
	additionalContributions *string
	poolLogic              *string
	oracle                 *Oracle
	poolClosesAt           *time.Time
	eventEndsAt            *time.Time
	icon                   Icon
	createdAt              time.Time
	updatedAt              time.Time
}

// Category represents event category
type Category string

const (
	CategoryFlightDelay Category = "flightDelay"
	CategoryWeather     Category = "weather"
	CategoryTripCancel  Category = "tripCancel"
)

// Status represents event status
type Status string

const (
	StatusRecruiting Status = "recruiting"
	StatusActive     Status = "active"
	StatusSettling   Status = "settling"
	StatusCompleted  Status = "completed"
)

// Icon represents event icon type
type Icon string

const (
	IconPlane    Icon = "plane"
	IconCloud    Icon = "cloud"
	IconSuitcase Icon = "suitcase"
)

// Oracle represents oracle information
type Oracle struct {
	dataSource    string
	resolutionTime string
}

// NewOracle creates a new Oracle
func NewOracle(dataSource, resolutionTime string) *Oracle {
	return &Oracle{
		dataSource:    dataSource,
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

// NewEvent creates a new Event aggregate root
func NewEvent(
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
) *Event {
	now := time.Now()
	return &Event{
		id:              id,
		category:        category,
		status:          status,
		title:           title,
		eventWindow:     eventWindow,
		triggerCondition: triggerCondition,
		premium:         premium,
		premiumCurrency: premiumCurrency,
		maxPayout:       maxPayout,
		payoutCurrency:  payoutCurrency,
		icon:            icon,
		createdAt:       now,
		updatedAt:       now,
	}
}

// ID returns event ID
func (e *Event) ID() string {
	return e.id
}

// Category returns event category
func (e *Event) Category() Category {
	return e.category
}

// Status returns event status
func (e *Event) Status() Status {
	return e.status
}

// Title returns event title
func (e *Event) Title() string {
	return e.title
}

// Subtitle returns event subtitle
func (e *Event) Subtitle() *string {
	return e.subtitle
}

// SetSubtitle sets event subtitle
func (e *Event) SetSubtitle(subtitle string) {
	e.subtitle = &subtitle
}

// EventWindow returns event window
func (e *Event) EventWindow() string {
	return e.eventWindow
}

// TriggerCondition returns trigger condition
func (e *Event) TriggerCondition() string {
	return e.triggerCondition
}

// Premium returns premium amount
func (e *Event) Premium() float64 {
	return e.premium
}

// PremiumCurrency returns premium currency
func (e *Event) PremiumCurrency() string {
	return e.premiumCurrency
}

// MaxPayout returns max payout amount
func (e *Event) MaxPayout() float64 {
	return e.maxPayout
}

// PayoutCurrency returns payout currency
func (e *Event) PayoutCurrency() string {
	return e.payoutCurrency
}

// AdditionalContributions returns additional contributions
func (e *Event) AdditionalContributions() *string {
	return e.additionalContributions
}

// SetAdditionalContributions sets additional contributions
func (e *Event) SetAdditionalContributions(contributions string) {
	e.additionalContributions = &contributions
}

// PoolLogic returns pool logic description
func (e *Event) PoolLogic() *string {
	return e.poolLogic
}

// SetPoolLogic sets pool logic description
func (e *Event) SetPoolLogic(logic string) {
	e.poolLogic = &logic
}

// Oracle returns oracle information
func (e *Event) Oracle() *Oracle {
	return e.oracle
}

// SetOracle sets oracle information
func (e *Event) SetOracle(oracle *Oracle) {
	e.oracle = oracle
}

// PoolClosesAt returns pool closes time
func (e *Event) PoolClosesAt() *time.Time {
	return e.poolClosesAt
}

// SetPoolClosesAt sets pool closes time
func (e *Event) SetPoolClosesAt(t time.Time) {
	e.poolClosesAt = &t
}

// EventEndsAt returns event ends time
func (e *Event) EventEndsAt() *time.Time {
	return e.eventEndsAt
}

// SetEventEndsAt sets event ends time
func (e *Event) SetEventEndsAt(t time.Time) {
	e.eventEndsAt = &t
}

// Icon returns event icon
func (e *Event) Icon() Icon {
	return e.icon
}

// CreatedAt returns created at time
func (e *Event) CreatedAt() time.Time {
	return e.createdAt
}

// UpdatedAt returns updated at time
func (e *Event) UpdatedAt() time.Time {
	return e.updatedAt
}

// UpdateStatus updates event status
func (e *Event) UpdateStatus(status Status) {
	e.status = status
	e.updatedAt = time.Now()
}
