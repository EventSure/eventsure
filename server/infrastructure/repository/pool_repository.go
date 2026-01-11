package repository

import (
	"errors"
	"sync"
	eventsurepool "eventsure-server/domain/pool"
)

// PoolRepository is the in-memory implementation of Pool repository
type PoolRepository struct {
	pools map[string]*eventsurepool.Pool
	mu    sync.RWMutex
}

// NewPoolRepository creates a new PoolRepository
func NewPoolRepository() *PoolRepository {
	return &PoolRepository{
		pools: make(map[string]*eventsurepool.Pool),
	}
}

// FindByID finds a pool by ID
func (r *PoolRepository) FindByID(id string) (*eventsurepool.Pool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	pool, exists := r.pools[id]
	if !exists {
		return nil, nil
	}
	return pool, nil
}

// FindAll finds all pools
func (r *PoolRepository) FindAll() ([]*eventsurepool.Pool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	pools := make([]*eventsurepool.Pool, 0, len(r.pools))
	for _, pool := range r.pools {
		pools = append(pools, pool)
	}
	return pools, nil
}

// FindByStatus finds pools by status
func (r *PoolRepository) FindByStatus(status eventsurepool.Status) ([]*eventsurepool.Pool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var pools []*eventsurepool.Pool
	for _, pool := range r.pools {
		if pool.Status() == status {
			pools = append(pools, pool)
		}
	}
	return pools, nil
}

// FindByCategory finds pools by category
func (r *PoolRepository) FindByCategory(category eventsurepool.Category) ([]*eventsurepool.Pool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var pools []*eventsurepool.Pool
	for _, pool := range r.pools {
		if pool.Category() == category {
			pools = append(pools, pool)
		}
	}
	return pools, nil
}

// FindByStatusAndCategory finds pools by status and category
func (r *PoolRepository) FindByStatusAndCategory(status eventsurepool.Status, category eventsurepool.Category) ([]*eventsurepool.Pool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var pools []*eventsurepool.Pool
	for _, pool := range r.pools {
		if pool.Status() == status && pool.Category() == category {
			pools = append(pools, pool)
		}
	}
	return pools, nil
}

// FindByEventID finds a pool by event ID
func (r *PoolRepository) FindByEventID(eventID string) (*eventsurepool.Pool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, pool := range r.pools {
		if pool.EventID() == eventID {
			return pool, nil
		}
	}
	return nil, nil
}

// Save saves a pool
func (r *PoolRepository) Save(pool *eventsurepool.Pool) error {
	if pool == nil {
		return errors.New("pool cannot be nil")
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	r.pools[pool.ID()] = pool
	return nil
}

// InitializeMockData initializes repository with mock data
func (r *PoolRepository) InitializeMockData(pools []*eventsurepool.Pool) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, pool := range pools {
		r.pools[pool.ID()] = pool
	}
}
