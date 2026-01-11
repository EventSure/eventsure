package episode

// Repository defines the interface for Episode repository
type Repository interface {
	FindByID(id string) (*Episode, error)
	FindAll() ([]*Episode, error)
	FindByStatus(status Status) ([]*Episode, error)
	FindByCategory(category Category) ([]*Episode, error)
	FindByStatusAndCategory(status Status, category Category) ([]*Episode, error)
	Save(episode *Episode) error
}
