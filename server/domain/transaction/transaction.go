package transaction

import "time"

// Transaction is an Entity in the Transaction domain
type Transaction struct {
	id          string
	txType      Type
	hash        string
	address     string
	amount      string
	currency    string
	flight      *string
	eventID     *string
	poolID      *string
	timestamp   time.Time
	blockNumber int64
	status      Status
}

// Type represents transaction type
type Type string

const (
	TypePurchase Type = "purchase"
	TypeClaim    Type = "claim"
	TypePayout   Type = "payout"
	TypeStake    Type = "stake"
)

// Status represents transaction status
type Status string

const (
	StatusPending   Status = "pending"
	StatusConfirmed Status = "confirmed"
	StatusFailed    Status = "failed"
)

// NewTransaction creates a new Transaction entity
func NewTransaction(
	id string,
	txType Type,
	hash string,
	address string,
	amount string,
	currency string,
	timestamp time.Time,
	blockNumber int64,
	status Status,
) *Transaction {
	return &Transaction{
		id:          id,
		txType:      txType,
		hash:        hash,
		address:     address,
		amount:      amount,
		currency:    currency,
		timestamp:   timestamp,
		blockNumber: blockNumber,
		status:      status,
	}
}

// ID returns transaction ID
func (t *Transaction) ID() string {
	return t.id
}

// Type returns transaction type
func (t *Transaction) Type() Type {
	return t.txType
}

// Hash returns transaction hash
func (t *Transaction) Hash() string {
	return t.hash
}

// Address returns user address
func (t *Transaction) Address() string {
	return t.address
}

// Amount returns transaction amount
func (t *Transaction) Amount() string {
	return t.amount
}

// Currency returns currency
func (t *Transaction) Currency() string {
	return t.currency
}

// Flight returns flight number
func (t *Transaction) Flight() *string {
	return t.flight
}

// SetFlight sets flight number
func (t *Transaction) SetFlight(flight string) {
	t.flight = &flight
}

// EventID returns event ID
func (t *Transaction) EventID() *string {
	return t.eventID
}

// SetEventID sets event ID
func (t *Transaction) SetEventID(eventID string) {
	t.eventID = &eventID
}

// PoolID returns pool ID
func (t *Transaction) PoolID() *string {
	return t.poolID
}

// SetPoolID sets pool ID
func (t *Transaction) SetPoolID(poolID string) {
	t.poolID = &poolID
}

// Timestamp returns transaction timestamp
func (t *Transaction) Timestamp() time.Time {
	return t.timestamp
}

// BlockNumber returns block number
func (t *Transaction) BlockNumber() int64 {
	return t.blockNumber
}

// Status returns transaction status
func (t *Transaction) Status() Status {
	return t.status
}

// UpdateStatus updates transaction status
func (t *Transaction) UpdateStatus(status Status) {
	t.status = status
}
