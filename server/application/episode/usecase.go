package episode

import (
	"errors"
	eventsureepisode "eventsure-server/domain/episode"
)

// UseCase handles episode use cases
type UseCase struct {
	episodeRepo eventsureepisode.Repository
}

// NewUseCase creates a new EpisodeUseCase
func NewUseCase(episodeRepo eventsureepisode.Repository) *UseCase {
	return &UseCase{
		episodeRepo: episodeRepo,
	}
}

// GetEpisodesQuery represents query for getting episodes
type GetEpisodesQuery struct {
	Status   *string
	Category *string
}

// GetEpisodes handles getting episodes list
func (uc *UseCase) GetEpisodes(query GetEpisodesQuery) (*EpisodesResponseDTO, error) {
	var episodes []*eventsureepisode.Episode
	var err error

	if query.Status != nil && query.Category != nil {
		status := eventsureepisode.Status(*query.Status)
		category := eventsureepisode.Category(*query.Category)
		episodes, err = uc.episodeRepo.FindByStatusAndCategory(status, category)
	} else if query.Status != nil {
		status := eventsureepisode.Status(*query.Status)
		episodes, err = uc.episodeRepo.FindByStatus(status)
	} else if query.Category != nil {
		category := eventsureepisode.Category(*query.Category)
		episodes, err = uc.episodeRepo.FindByCategory(category)
	} else {
		episodes, err = uc.episodeRepo.FindAll()
	}

	if err != nil {
		return nil, err
	}

	episodeDTOs := make([]EpisodeDTO, len(episodes))
	for i, ep := range episodes {
		episodeDTOs[i] = ToDTO(ep)
	}

	return &EpisodesResponseDTO{
		Episodes: episodeDTOs,
		Total:    len(episodeDTOs),
		Page:     1,
		Limit:    20,
	}, nil
}

// GetEpisodeDetail handles getting episode detail by ID
func (uc *UseCase) GetEpisodeDetail(episodeID string) (*EpisodeDetailDTO, error) {
	ep, err := uc.episodeRepo.FindByID(episodeID)
	if err != nil {
		return nil, err
	}

	if ep == nil {
		return nil, errors.New("episode not found")
	}

	detailDTO := ToDetailDTO(ep)
	return &detailDTO, nil
}
