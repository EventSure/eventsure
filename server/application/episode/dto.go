package episode

// CreateUserEpisodeRequest represents request for creating user_episode
type CreateUserEpisodeRequest struct {
	User    string `json:"user"`
	Episode string `json:"episode"`
}

// CreateUserEpisodeResponse represents response for creating user_episode
type CreateUserEpisodeResponse struct {
	ID        int64   `json:"id"`
	User      string  `json:"user"`
	Episode   string  `json:"episode"`
	Progress  *string `json:"progress,omitempty"`
	CreatedAt string  `json:"created_at"`
}
