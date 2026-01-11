package transaction

import (
	eventsuretransaction "eventsure-server/domain/transaction"
)

// UseCase handles transaction use cases
type UseCase struct {
	txRepo eventsuretransaction.Repository
}

// NewUseCase creates a new TransactionUseCase
func NewUseCase(txRepo eventsuretransaction.Repository) *UseCase {
	return &UseCase{
		txRepo: txRepo,
	}
}

// GetTransactionsQuery represents query for getting transactions
type GetTransactionsQuery struct {
	Type   *string
	Limit  int
	Offset int
}

// GetTransactions handles getting transactions list
func (uc *UseCase) GetTransactions(query GetTransactionsQuery) (*TransactionsResponseDTO, error) {
	var transactions []*eventsuretransaction.Transaction
	var err error

	if query.Type != nil {
		txType := eventsuretransaction.Type(*query.Type)
		transactions, err = uc.txRepo.FindByType(txType)
	} else {
		transactions, err = uc.txRepo.FindAll()
	}

	if err != nil {
		return nil, err
	}

	// Pagination
	total := len(transactions)
	start := query.Offset
	end := query.Offset + query.Limit
	if start > total {
		start = total
	}
	if end > total {
		end = total
	}

	var result []*eventsuretransaction.Transaction
	if start < end {
		result = transactions[start:end]
	} else {
		result = []*eventsuretransaction.Transaction{}
	}

	txDTOs := make([]TransactionDTO, len(result))
	for i, tx := range result {
		txDTOs[i] = ToDTO(tx)
	}

	return &TransactionsResponseDTO{
		Transactions: txDTOs,
		Total:        total,
		Limit:        query.Limit,
		Offset:       query.Offset,
	}, nil
}

// GetTransactionStats handles getting transaction statistics
func (uc *UseCase) GetTransactionStats() (*TransactionStatsDTO, error) {
	// This is a mock implementation
	// In real implementation, this would calculate from actual data
	return &TransactionStatsDTO{
		TotalVolume24h:        1234567,
		VolumeCurrency:        "USD",
		ActivePolicies:        15234,
		TransactionsPerSecond: 12.5,
		NetworkStats: NetworkStatsDTO{
			Network:     "Mantle Network",
			BlockNumber: 12345678,
			GasPrice:    "0.02",
			GasUnit:     "gwei",
		},
	}, nil
}
