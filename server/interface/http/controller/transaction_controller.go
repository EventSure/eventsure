package controller

import (
	"encoding/json"
	"net/http"
	"strconv"

	transactionusecase "eventsure-server/application/transaction"
)

// TransactionController handles HTTP requests for transactions
type TransactionController struct {
	txUseCase *transactionusecase.UseCase
}

// NewTransactionController creates a new TransactionController
func NewTransactionController(txUseCase *transactionusecase.UseCase) *TransactionController {
	return &TransactionController{
		txUseCase: txUseCase,
	}
}

// GetTransactions handles GET /api/transactions
func (c *TransactionController) GetTransactions(w http.ResponseWriter, r *http.Request) {
	var txType *string
	if t := r.URL.Query().Get("type"); t != "" {
		txType = &t
	}

	limit := 20
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	offset := 0
	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	query := transactionusecase.GetTransactionsQuery{
		Type:   txType,
		Limit:  limit,
		Offset: offset,
	}

	response, err := c.txUseCase.GetTransactions(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetTransactionStats handles GET /api/transactions/stats
func (c *TransactionController) GetTransactionStats(w http.ResponseWriter, r *http.Request) {
	response, err := c.txUseCase.GetTransactionStats()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
