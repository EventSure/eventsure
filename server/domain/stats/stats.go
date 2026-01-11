package stats

// Stats is a Value Object for statistics
type Stats struct {
	tvl              float64
	tvlCurrency      string
	totalPolicies    int
	claimRate        float64
	claimRateUnit    string
	averagePayoutTime int
	payoutTimeUnit   string
}

// NewStats creates a new Stats value object
func NewStats(
	tvl float64,
	tvlCurrency string,
	totalPolicies int,
	claimRate float64,
	claimRateUnit string,
	averagePayoutTime int,
	payoutTimeUnit string,
) *Stats {
	return &Stats{
		tvl:              tvl,
		tvlCurrency:      tvlCurrency,
		totalPolicies:    totalPolicies,
		claimRate:        claimRate,
		claimRateUnit:    claimRateUnit,
		averagePayoutTime: averagePayoutTime,
		payoutTimeUnit:   payoutTimeUnit,
	}
}

// TVL returns total value locked
func (s *Stats) TVL() float64 {
	return s.tvl
}

// TVLCurrency returns TVL currency
func (s *Stats) TVLCurrency() string {
	return s.tvlCurrency
}

// TotalPolicies returns total policies
func (s *Stats) TotalPolicies() int {
	return s.totalPolicies
}

// ClaimRate returns claim rate
func (s *Stats) ClaimRate() float64 {
	return s.claimRate
}

// ClaimRateUnit returns claim rate unit
func (s *Stats) ClaimRateUnit() string {
	return s.claimRateUnit
}

// AveragePayoutTime returns average payout time
func (s *Stats) AveragePayoutTime() int {
	return s.averagePayoutTime
}

// PayoutTimeUnit returns payout time unit
func (s *Stats) PayoutTimeUnit() string {
	return s.payoutTimeUnit
}
