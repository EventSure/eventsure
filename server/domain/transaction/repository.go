package transaction

// Repository defines the interface for Transaction repository
type Repository interface {
	FindByID(id string) (*Transaction, error)
	FindAll() ([]*Transaction, error)
	FindByType(txType Type) ([]*Transaction, error)
	FindByEventID(eventID string) ([]*Transaction, error)
	FindByPoolID(poolID string) ([]*Transaction, error)
	Save(transaction *Transaction) error
}
