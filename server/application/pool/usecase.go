package pool

import (
	eventsurepool "eventsure-server/domain/pool"
)

// UseCase handles pool use cases
type UseCase struct {
	poolRepo eventsurepool.Repository
}

// NewUseCase creates a new PoolUseCase
func NewUseCase(poolRepo eventsurepool.Repository) *UseCase {
	return &UseCase{
		poolRepo: poolRepo,
	}
}

// GetPoolsQuery represents query for getting pools
type GetPoolsQuery struct {
	Status   *string
	Category *string
}

// GetPools handles getting pools list
func (uc *UseCase) GetPools(query GetPoolsQuery) (*PoolsResponseDTO, error) {
	var pools []*eventsurepool.Pool
	var err error

	if query.Status != nil && query.Category != nil {
		status := eventsurepool.Status(*query.Status)
		category := eventsurepool.Category(*query.Category)
		pools, err = uc.poolRepo.FindByStatusAndCategory(status, category)
	} else if query.Status != nil {
		status := eventsurepool.Status(*query.Status)
		pools, err = uc.poolRepo.FindByStatus(status)
	} else if query.Category != nil {
		category := eventsurepool.Category(*query.Category)
		pools, err = uc.poolRepo.FindByCategory(category)
	} else {
		pools, err = uc.poolRepo.FindAll()
	}

	if err != nil {
		return nil, err
	}

	poolDTOs := make([]PoolDTO, len(pools))
	for i, pool := range pools {
		poolDTOs[i] = ToDTO(pool)
	}

	return &PoolsResponseDTO{
		Pools: poolDTOs,
		Total: len(poolDTOs),
		Page:  1,
		Limit: 20,
	}, nil
}
