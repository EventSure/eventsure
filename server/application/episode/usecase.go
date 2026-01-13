package episode

import (
	"errors"
	"eventsure-server/infrastructure/repository"
)

// UseCase handles episode use cases
type UseCase struct {
	userEpisodeRepo *repository.UserEpisodeRepository
}

// NewUseCase creates a new EpisodeUseCase
func NewUseCase() *UseCase {
	userEpisodeRepo, err := repository.NewUserEpisodeRepository()
	if err != nil {
		// Repository 초기화 실패 시 nil로 설정
		userEpisodeRepo = nil
	}

	return &UseCase{
		userEpisodeRepo: userEpisodeRepo,
	}
}

// CreateUserEpisode creates a new user_episode record in Supabase
func (uc *UseCase) CreateUserEpisode(req CreateUserEpisodeRequest) (*CreateUserEpisodeResponse, error) {
	if uc.userEpisodeRepo == nil {
		return nil, errors.New("user episode repository is not initialized")
	}

	if req.User == "" {
		return nil, errors.New("user is required")
	}
	if req.Episode == "" {
		return nil, errors.New("episode is required")
	}

	result, err := uc.userEpisodeRepo.Create(req.User, req.Episode)
	if err != nil {
		return nil, err
	}

	if result == nil {
		return nil, errors.New("failed to create user_episode")
	}

	// Convert map to response DTO
	response := &CreateUserEpisodeResponse{}

	// id는 int64로 변환
	if id, ok := result["id"].(float64); ok {
		response.ID = int64(id)
	} else if id, ok := result["id"].(int64); ok {
		response.ID = id
	}

	// user는 string
	if user, ok := result["user"].(string); ok {
		response.User = user
	}

	// episode는 string
	if episode, ok := result["episode"].(string); ok {
		response.Episode = episode
	}

	// progress는 nullable
	if progress, ok := result["progress"].(string); ok && progress != "" {
		response.Progress = &progress
	}

	// created_at은 string
	if createdAt, ok := result["created_at"].(string); ok {
		response.CreatedAt = createdAt
	}

	return response, nil
}

// GetUserEpisodes gets all episodes for a specific user
func (uc *UseCase) GetUserEpisodes(user string) (*GetUserEpisodesResponse, error) {
	if uc.userEpisodeRepo == nil {
		return nil, errors.New("user episode repository is not initialized")
	}

	if user == "" {
		return nil, errors.New("user is required")
	}

	results, err := uc.userEpisodeRepo.FindByUser(user)
	if err != nil {
		return nil, err
	}

	episodes := make([]UserEpisodeDTO, len(results))
	for i, result := range results {
		episode := UserEpisodeDTO{}

		// id는 int64로 변환
		if id, ok := result["id"].(float64); ok {
			episode.ID = int64(id)
		} else if id, ok := result["id"].(int64); ok {
			episode.ID = id
		}

		// user는 string
		if u, ok := result["user"].(string); ok {
			episode.User = u
		}

		// episode는 string
		if ep, ok := result["episode"].(string); ok {
			episode.Episode = ep
		}

		// progress는 nullable
		if progress, ok := result["progress"].(string); ok && progress != "" {
			episode.Progress = &progress
		}

		// created_at은 string
		if createdAt, ok := result["created_at"].(string); ok {
			episode.CreatedAt = createdAt
		}

		episodes[i] = episode
	}

	return &GetUserEpisodesResponse{
		Episodes: episodes,
	}, nil
}
