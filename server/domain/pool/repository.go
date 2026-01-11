package pool

// Repository defines the interface for Pool repository
type Repository interface {
	FindByID(id string) (*Pool, error)
	FindAll() ([]*Pool, error)
	FindByStatus(status Status) ([]*Pool, error)
	FindByCategory(category Category) ([]*Pool, error)
	FindByStatusAndCategory(status Status, category Category) ([]*Pool, error)
	FindByEventID(eventID string) (*Pool, error)
	Save(pool *Pool) error
}
