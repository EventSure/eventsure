package repository

import (
	"errors"
	"sync"
	eventsuretransaction "eventsure-server/domain/transaction"
)

// TransactionRepository is the in-memory implementation of Transaction repository
type TransactionRepository struct {
	transactions map[string]*eventsuretransaction.Transaction
	mu           sync.RWMutex
}

// NewTransactionRepository creates a new TransactionRepository
func NewTransactionRepository() *TransactionRepository {
	return &TransactionRepository{
		transactions: make(map[string]*eventsuretransaction.Transaction),
	}
}

// FindByID finds a transaction by ID
func (r *TransactionRepository) FindByID(id string) (*eventsuretransaction.Transaction, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	tx, exists := r.transactions[id]
	if !exists {
		return nil, nil
	}
	return tx, nil
}

// FindAll finds all transactions
func (r *TransactionRepository) FindAll() ([]*eventsuretransaction.Transaction, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	transactions := make([]*eventsuretransaction.Transaction, 0, len(r.transactions))
	for _, tx := range r.transactions {
		transactions = append(transactions, tx)
	}
	return transactions, nil
}

// FindByType finds transactions by type
func (r *TransactionRepository) FindByType(txType eventsuretransaction.Type) ([]*eventsuretransaction.Transaction, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var transactions []*eventsuretransaction.Transaction
	for _, tx := range r.transactions {
		if tx.Type() == txType {
			transactions = append(transactions, tx)
		}
	}
	return transactions, nil
}

// FindByEventID finds transactions by event ID
func (r *TransactionRepository) FindByEventID(eventID string) ([]*eventsuretransaction.Transaction, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var transactions []*eventsuretransaction.Transaction
	for _, tx := range r.transactions {
		if tx.EventID() != nil && *tx.EventID() == eventID {
			transactions = append(transactions, tx)
		}
	}
	return transactions, nil
}

// FindByPoolID finds transactions by pool ID
func (r *TransactionRepository) FindByPoolID(poolID string) ([]*eventsuretransaction.Transaction, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var transactions []*eventsuretransaction.Transaction
	for _, tx := range r.transactions {
		if tx.PoolID() != nil && *tx.PoolID() == poolID {
			transactions = append(transactions, tx)
		}
	}
	return transactions, nil
}

// Save saves a transaction
func (r *TransactionRepository) Save(transaction *eventsuretransaction.Transaction) error {
	if transaction == nil {
		return errors.New("transaction cannot be nil")
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	r.transactions[transaction.ID()] = transaction
	return nil
}

// InitializeMockData initializes repository with mock data
func (r *TransactionRepository) InitializeMockData(transactions []*eventsuretransaction.Transaction) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, tx := range transactions {
		r.transactions[tx.ID()] = tx
	}
}
