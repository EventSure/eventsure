package event

// Repository defines the interface for Event repository
type Repository interface {
	FindByID(id string) (*Event, error)
	FindAll() ([]*Event, error)
	FindByStatus(status Status) ([]*Event, error)
	FindByCategory(category Category) ([]*Event, error)
	FindByStatusAndCategory(status Status, category Category) ([]*Event, error)
	Save(event *Event) error
}
