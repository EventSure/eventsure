package repository

import (
	"errors"
	"sync"
	eventsureepisode "eventsure-server/domain/episode"
)

// EpisodeRepository is the in-memory implementation of Episode repository
type EpisodeRepository struct {
	episodes map[string]*eventsureepisode.Episode
	mu       sync.RWMutex
}

// NewEpisodeRepository creates a new EpisodeRepository
func NewEpisodeRepository() *EpisodeRepository {
	return &EpisodeRepository{
		episodes: make(map[string]*eventsureepisode.Episode),
	}
}

// FindByID finds an episode by ID
func (r *EpisodeRepository) FindByID(id string) (*eventsureepisode.Episode, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	ep, exists := r.episodes[id]
	if !exists {
		return nil, nil
	}
	return ep, nil
}

// FindAll finds all episodes
func (r *EpisodeRepository) FindAll() ([]*eventsureepisode.Episode, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	episodes := make([]*eventsureepisode.Episode, 0, len(r.episodes))
	for _, ep := range r.episodes {
		episodes = append(episodes, ep)
	}
	return episodes, nil
}

// FindByStatus finds episodes by status
func (r *EpisodeRepository) FindByStatus(status eventsureepisode.Status) ([]*eventsureepisode.Episode, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var episodes []*eventsureepisode.Episode
	for _, ep := range r.episodes {
		if ep.Status() == status {
			episodes = append(episodes, ep)
		}
	}
	return episodes, nil
}

// FindByCategory finds episodes by category
func (r *EpisodeRepository) FindByCategory(category eventsureepisode.Category) ([]*eventsureepisode.Episode, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var episodes []*eventsureepisode.Episode
	for _, ep := range r.episodes {
		if ep.Category() == category {
			episodes = append(episodes, ep)
		}
	}
	return episodes, nil
}

// FindByStatusAndCategory finds episodes by status and category
func (r *EpisodeRepository) FindByStatusAndCategory(status eventsureepisode.Status, category eventsureepisode.Category) ([]*eventsureepisode.Episode, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var episodes []*eventsureepisode.Episode
	for _, ep := range r.episodes {
		if ep.Status() == status && ep.Category() == category {
			episodes = append(episodes, ep)
		}
	}
	return episodes, nil
}

// Save saves an episode
func (r *EpisodeRepository) Save(ep *eventsureepisode.Episode) error {
	if ep == nil {
		return errors.New("episode cannot be nil")
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	r.episodes[ep.ID()] = ep
	return nil
}

// InitializeMockData initializes repository with mock data
func (r *EpisodeRepository) InitializeMockData(episodes []*eventsureepisode.Episode) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, ep := range episodes {
		r.episodes[ep.ID()] = ep
	}
}
