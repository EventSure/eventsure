package stats

import eventsurestats "eventsure-server/domain/stats"

// UseCase handles stats use cases
type UseCase struct {
	// In real implementation, would have repositories to calculate stats
}

// NewUseCase creates a new StatsUseCase
func NewUseCase() *UseCase {
	return &UseCase{}
}

// GetHomeStats handles getting home page statistics
func (uc *UseCase) GetHomeStats() (*StatsDTO, error) {
	// This is a mock implementation
	// In real implementation, this would calculate from actual data
	stats := eventsurestats.NewStats(
		2500000,
		"USD",
		15000,
		98,
		"percent",
		300,
		"seconds",
	)

	dto := ToDTO(stats)
	return &dto, nil
}
