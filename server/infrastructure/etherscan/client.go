package etherscan

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"
)

const (
	// EtherscanAPIBaseURL is the base URL for Etherscan API
	EtherscanAPIBaseURL = "https://api.etherscan.io/v2/api"
	// DefaultChainID is Ethereum mainnet
	DefaultChainID = "1"
)

// EtherscanClient represents an Etherscan API client
type EtherscanClient struct {
	apiKey  string
	chainID string
	baseURL string
	client  *http.Client
}

// NewEtherscanClient creates a new Etherscan API client
func NewEtherscanClient() (*EtherscanClient, error) {
	apiKey := os.Getenv("ETHERSCAN_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("ETHERSCAN_API_KEY must be set")
	}

	chainID := os.Getenv("ETHERSCAN_CHAIN_ID")
	if chainID == "" {
		chainID = DefaultChainID
	}

	return &EtherscanClient{
		apiKey:  apiKey,
		chainID: chainID,
		baseURL: EtherscanAPIBaseURL,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}, nil
}

// InternalTransaction represents an internal transaction
type InternalTransaction struct {
	BlockNumber     string `json:"blockNumber"`
	TimeStamp       string `json:"timeStamp"`
	Hash            string `json:"hash"`
	From            string `json:"from"`
	To              string `json:"to"`
	Value           string `json:"value"`
	ContractAddress string `json:"contractAddress"`
	Input           string `json:"input"`
	Type            string `json:"type"`
	Gas             string `json:"gas"`
	GasUsed         string `json:"gasUsed"`
	TraceID         string `json:"traceId"`
	IsError         string `json:"isError"`
	ErrCode         string `json:"errCode"`
}

// InternalTransactionsResponse represents the response for internal transactions
type InternalTransactionsResponse struct {
	Status  string                `json:"status"`
	Message string                `json:"message"`
	Result  []InternalTransaction `json:"result"`
}

// GetInternalTransactionsParams represents parameters for GetInternalTransactions
type GetInternalTransactionsParams struct {
	Address    string
	StartBlock *int64
	EndBlock   *int64
	Page       *int
	Offset     *int
	Sort       string // "asc" or "desc"
}

// GetInternalTransactions retrieves the internal transaction history of a specified address
func (c *EtherscanClient) GetInternalTransactions(params GetInternalTransactionsParams) (*InternalTransactionsResponse, error) {
	queryParams := url.Values{}
	queryParams.Set("apikey", c.apiKey)
	queryParams.Set("chainid", c.chainID)
	queryParams.Set("module", "account")
	queryParams.Set("action", "txlistinternal")
	queryParams.Set("address", params.Address)

	if params.StartBlock != nil {
		queryParams.Set("startblock", strconv.FormatInt(*params.StartBlock, 10))
	} else {
		queryParams.Set("startblock", "0")
	}

	if params.EndBlock != nil {
		queryParams.Set("endblock", strconv.FormatInt(*params.EndBlock, 10))
	} else {
		queryParams.Set("endblock", "9999999999")
	}

	if params.Page != nil {
		queryParams.Set("page", strconv.Itoa(*params.Page))
	} else {
		queryParams.Set("page", "1")
	}

	if params.Offset != nil {
		queryParams.Set("offset", strconv.Itoa(*params.Offset))
	} else {
		queryParams.Set("offset", "1")
	}

	if params.Sort != "" {
		queryParams.Set("sort", params.Sort)
	} else {
		queryParams.Set("sort", "desc")
	}

	reqURL := fmt.Sprintf("%s?%s", c.baseURL, queryParams.Encode())

	resp, err := c.client.Get(reqURL)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status code %d: %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var result InternalTransactionsResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if result.Status != "1" {
		return nil, fmt.Errorf("etherscan API error: %s", result.Message)
	}

	return &result, nil
}

// EventLog represents an event log
type EventLog struct {
	Address          string   `json:"address"`
	Topics           []string `json:"topics"`
	Data             string   `json:"data"`
	BlockNumber      string   `json:"blockNumber"`
	BlockHash        string   `json:"blockHash"`
	TimeStamp        string   `json:"timeStamp"`
	GasPrice         string   `json:"gasPrice"`
	GasUsed          string   `json:"gasUsed"`
	LogIndex         string   `json:"logIndex"`
	TransactionHash  string   `json:"transactionHash"`
	TransactionIndex string   `json:"transactionIndex"`
}

// EventLogsResponse represents the response for event logs
type EventLogsResponse struct {
	Status  string     `json:"status"`
	Message string     `json:"message"`
	Result  []EventLog `json:"result"`
}

// GetEventLogsParams represents parameters for GetEventLogs
type GetEventLogsParams struct {
	Address   string
	FromBlock *int64
	ToBlock   *int64
	Page      *int
	Offset    *int
}

// GetEventLogs retrieves event logs from a specific address
func (c *EtherscanClient) GetEventLogs(params GetEventLogsParams) (*EventLogsResponse, error) {
	queryParams := url.Values{}
	queryParams.Set("apikey", c.apiKey)
	queryParams.Set("chainid", c.chainID)
	queryParams.Set("module", "logs")
	queryParams.Set("action", "getLogs")
	queryParams.Set("address", params.Address)

	if params.FromBlock != nil {
		queryParams.Set("fromBlock", strconv.FormatInt(*params.FromBlock, 10))
	} else {
		queryParams.Set("fromBlock", "0")
	}

	if params.ToBlock != nil {
		queryParams.Set("toBlock", strconv.FormatInt(*params.ToBlock, 10))
	} else {
		queryParams.Set("toBlock", "latest")
	}

	if params.Page != nil {
		queryParams.Set("page", strconv.Itoa(*params.Page))
	} else {
		queryParams.Set("page", "1")
	}

	if params.Offset != nil {
		queryParams.Set("offset", strconv.Itoa(*params.Offset))
	} else {
		queryParams.Set("offset", "1000")
	}

	reqURL := fmt.Sprintf("%s?%s", c.baseURL, queryParams.Encode())

	resp, err := c.client.Get(reqURL)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status code %d: %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var result EventLogsResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if result.Status != "1" {
		return nil, fmt.Errorf("etherscan API error: %s", result.Message)
	}

	return &result, nil
}
