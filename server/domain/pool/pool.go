package pool

import "time"

// Pool is the Aggregate Root for the Pool domain
type Pool struct {
	id               string
	eventID          string
	category         Category
	status           Status
	title            string
	description      string
	coverageCondition string
	premium          float64
	premiumCurrency  string
	maxPayout        float64
	payoutCurrency   string
	members          int
	poolSize         float64
	poolTarget       float64
	endDate          time.Time
	icon             Icon
	createdAt        time.Time
	updatedAt        time.Time
}

// Category represents pool category
type Category string

const (
	CategoryFlightDelay Category = "flightDelay"
	CategoryWeather     Category = "weather"
	CategoryTripCancel  Category = "tripCancel"
)

// Status represents pool status
type Status string

const (
	StatusRecruiting Status = "recruiting"
	StatusActive     Status = "active"
	StatusSettling   Status = "settling"
)

// Icon represents pool icon type
type Icon string

const (
	IconPlane    Icon = "plane"
	IconCloud    Icon = "cloud"
	IconSuitcase Icon = "suitcase"
)

// NewPool creates a new Pool aggregate root
func NewPool(
	id string,
	eventID string,
	category Category,
	status Status,
	title string,
	description string,
	coverageCondition string,
	premium float64,
	premiumCurrency string,
	maxPayout float64,
	payoutCurrency string,
	poolTarget float64,
	endDate time.Time,
	icon Icon,
) *Pool {
	now := time.Now()
	return &Pool{
		id:                id,
		eventID:           eventID,
		category:          category,
		status:            status,
		title:             title,
		description:       description,
		coverageCondition: coverageCondition,
		premium:           premium,
		premiumCurrency:   premiumCurrency,
		maxPayout:         maxPayout,
		payoutCurrency:    payoutCurrency,
		members:           0,
		poolSize:          0,
		poolTarget:        poolTarget,
		endDate:           endDate,
		icon:              icon,
		createdAt:         now,
		updatedAt:         now,
	}
}

// ID returns pool ID
func (p *Pool) ID() string {
	return p.id
}

// EventID returns associated event ID
func (p *Pool) EventID() string {
	return p.eventID
}

// Category returns pool category
func (p *Pool) Category() Category {
	return p.category
}

// Status returns pool status
func (p *Pool) Status() Status {
	return p.status
}

// Title returns pool title
func (p *Pool) Title() string {
	return p.title
}

// Description returns pool description
func (p *Pool) Description() string {
	return p.description
}

// CoverageCondition returns coverage condition
func (p *Pool) CoverageCondition() string {
	return p.coverageCondition
}

// Premium returns premium amount
func (p *Pool) Premium() float64 {
	return p.premium
}

// PremiumCurrency returns premium currency
func (p *Pool) PremiumCurrency() string {
	return p.premiumCurrency
}

// MaxPayout returns max payout amount
func (p *Pool) MaxPayout() float64 {
	return p.maxPayout
}

// PayoutCurrency returns payout currency
func (p *Pool) PayoutCurrency() string {
	return p.payoutCurrency
}

// Members returns number of members
func (p *Pool) Members() int {
	return p.members
}

// PoolSize returns current pool size
func (p *Pool) PoolSize() float64 {
	return p.poolSize
}

// PoolTarget returns pool target amount
func (p *Pool) PoolTarget() float64 {
	return p.poolTarget
}

// EndDate returns end date
func (p *Pool) EndDate() time.Time {
	return p.endDate
}

// Icon returns pool icon
func (p *Pool) Icon() Icon {
	return p.icon
}

// CreatedAt returns created at time
func (p *Pool) CreatedAt() time.Time {
	return p.createdAt
}

// UpdatedAt returns updated at time
func (p *Pool) UpdatedAt() time.Time {
	return p.updatedAt
}

// AddMember adds a member to the pool
func (p *Pool) AddMember(contribution float64) {
	p.members++
	p.poolSize += contribution
	p.updatedAt = time.Now()
}

// UpdateStatus updates pool status
func (p *Pool) UpdateStatus(status Status) {
	p.status = status
	p.updatedAt = time.Now()
}
