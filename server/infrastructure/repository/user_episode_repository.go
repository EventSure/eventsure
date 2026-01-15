package repository

import (
	"eventsure-server/infrastructure/database"
)

// UserEpisodeRepository handles user_episodes table operations using Supabase
type UserEpisodeRepository struct {
	supabaseClient *database.SupabaseRESTClient
}

// NewUserEpisodeRepository creates a new UserEpisodeRepository
func NewUserEpisodeRepository() (*UserEpisodeRepository, error) {
	client, err := database.NewSupabaseRESTClient()
	if err != nil {
		return nil, err
	}

	return &UserEpisodeRepository{
		supabaseClient: client,
	}, nil
}

// Create inserts a new user_episode record
// user_episodes table structure:
// - id (int8, Primary Key, auto-generated)
// - user (varchar)
// - episode (varchar)
// - progress (varchar, nullable)
// - created_at (timestamptz, auto-generated)
func (r *UserEpisodeRepository) Create(user, episode string) (map[string]interface{}, error) {
	data := map[string]interface{}{
		"user":    user,
		"episode": episode,
		// progress는 nullable이므로 생략 가능
		// id와 created_at은 자동 생성됨
	}

	result, err := r.supabaseClient.Insert("user_episodes", data)
	if err != nil {
		return nil, err
	}

	if len(result) == 0 {
		return nil, nil
	}

	return result[0], nil
}

// FindByUser finds all user_episodes for a specific user
func (r *UserEpisodeRepository) FindByUser(user string) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	_, err := r.supabaseClient.Client.From("user_episodes").
		Select("*", "exact", false).
		Eq("user", user).
		ExecuteTo(&result)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// FindByEpisode finds all user_episodes for a specific episode
func (r *UserEpisodeRepository) FindByEpisode(episode string) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	_, err := r.supabaseClient.Client.From("user_episodes").
		Select("*", "exact", false).
		Eq("episode", episode).
		ExecuteTo(&result)
	if err != nil {
		return nil, err
	}
	return result, nil
}
