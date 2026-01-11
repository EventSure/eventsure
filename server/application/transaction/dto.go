package transaction

import (
	"time"
	eventsuretransaction "eventsure-server/domain/transaction"
)

// TransactionDTO represents Transaction data transfer object
type TransactionDTO struct {
	ID          string     `json:"id"`
	Type        string     `json:"type"`
	Hash        string     `json:"hash"`
	Address     string     `json:"address"`
	Amount      string     `json:"amount"`
	Currency    string     `json:"currency"`
	Flight      *string    `json:"flight,omitempty"`
	EventID     *string    `json:"eventId,omitempty"`
	PoolID      *string    `json:"poolId,omitempty"`
	Timestamp   time.Time  `json:"timestamp"`
	BlockNumber int64      `json:"blockNumber"`
	Status      string     `json:"status"`
}

// TransactionsResponseDTO represents transactions list response
type TransactionsResponseDTO struct {
	Transactions []TransactionDTO `json:"transactions"`
	Total        int              `json:"total"`
	Limit        int              `json:"limit"`
	Offset       int              `json:"offset"`
}

// NetworkStatsDTO represents network statistics data transfer object
type NetworkStatsDTO struct {
	Network     string `json:"network"`
	BlockNumber int64  `json:"blockNumber"`
	GasPrice    string `json:"gasPrice"`
	GasUnit     string `json:"gasUnit"`
}

// TransactionStatsDTO represents transaction statistics data transfer object
type TransactionStatsDTO struct {
	TotalVolume24h        float64          `json:"totalVolume24h"`
	VolumeCurrency        string           `json:"volumeCurrency"`
	ActivePolicies        int              `json:"activePolicies"`
	TransactionsPerSecond float64          `json:"transactionsPerSecond"`
	NetworkStats          NetworkStatsDTO  `json:"networkStats"`
}

// ToDTO converts domain Transaction to DTO
func ToDTO(tx *eventsuretransaction.Transaction) TransactionDTO {
	return TransactionDTO{
		ID:          tx.ID(),
		Type:        string(tx.Type()),
		Hash:        tx.Hash(),
		Address:     tx.Address(),
		Amount:      tx.Amount(),
		Currency:    tx.Currency(),
		Flight:      tx.Flight(),
		EventID:     tx.EventID(),
		PoolID:      tx.PoolID(),
		Timestamp:   tx.Timestamp(),
		BlockNumber: tx.BlockNumber(),
		Status:      string(tx.Status()),
	}
}
