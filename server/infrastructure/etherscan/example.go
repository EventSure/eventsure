package etherscan

import (
	"fmt"
	"log"
	"os"
)

// ExampleGetInternalTransactions demonstrates how to get internal transactions by address
func ExampleGetInternalTransactions() {
	fmt.Println("=== Get Internal Transactions by Address ===")

	// 환경 변수 확인
	fmt.Println("Checking environment variables...")
	apiKey := os.Getenv("ETHERSCAN_API_KEY")
	chainID := os.Getenv("ETHERSCAN_CHAIN_ID")

	if apiKey == "" {
		log.Fatal("ETHERSCAN_API_KEY is not set")
	}

	if chainID == "" {
		chainID = "1"
		fmt.Println("ETHERSCAN_CHAIN_ID not set, using default: 1 (Ethereum mainnet)")
	}

	fmt.Printf("✓ ETHERSCAN_API_KEY: %s...%s\n", apiKey[:10], apiKey[len(apiKey)-4:])
	fmt.Printf("✓ ETHERSCAN_CHAIN_ID: %s\n", chainID)

	// Etherscan 클라이언트 생성
	client, err := NewEtherscanClient()
	if err != nil {
		log.Fatalf("Failed to create Etherscan client: %v", err)
	}
	fmt.Println("✓ Etherscan client created successfully")

	// 예제 주소 (Etherscan 예제에서 사용된 주소)
	address := "0x4Bf598243d0851067F98Ca231d1574bEEcD33954"
	fmt.Printf("\nQuerying internal transactions for address: %s\n", address)

	// 내부 트랜잭션 조회
	params := GetInternalTransactionsParams{
		Address: address,
		Sort:    "desc",
	}

	response, err := client.GetInternalTransactions(params)
	if err != nil {
		log.Fatalf("Failed to get internal transactions: %v", err)
	}

	fmt.Printf("\nStatus: %s\n", response.Status)
	fmt.Printf("Message: %s\n", response.Message)
	fmt.Printf("Found %d internal transactions\n", len(response.Result))

	if len(response.Result) > 0 {
		fmt.Println("\nFirst few internal transactions:")
		maxShow := 3
		if len(response.Result) < maxShow {
			maxShow = len(response.Result)
		}
		for i := 0; i < maxShow; i++ {
			tx := response.Result[i]
			fmt.Printf("\nTransaction %d:\n", i+1)
			fmt.Printf("  Block Number: %s\n", tx.BlockNumber)
			fmt.Printf("  Time Stamp: %s\n", tx.TimeStamp)
			fmt.Printf("  Hash: %s\n", tx.Hash)
			fmt.Printf("  From: %s\n", tx.From)
			fmt.Printf("  To: %s\n", tx.To)
			fmt.Printf("  Value: %s\n", tx.Value)
			fmt.Printf("  Contract Address: %s\n", tx.ContractAddress)
			fmt.Printf("  Type: %s\n", tx.Type)
			fmt.Printf("  Is Error: %s\n", tx.IsError)
		}
	} else {
		fmt.Println("\n⚠️  No internal transactions found for this address")
	}
}

// ExampleGetEventLogs demonstrates how to get event logs by address
func ExampleGetEventLogs() {
	fmt.Println("=== Get Event Logs by Address ===")

	// 환경 변수 확인
	fmt.Println("Checking environment variables...")
	apiKey := os.Getenv("ETHERSCAN_API_KEY")
	chainID := os.Getenv("ETHERSCAN_CHAIN_ID")

	if apiKey == "" {
		log.Fatal("ETHERSCAN_API_KEY is not set")
	}

	if chainID == "" {
		chainID = "1"
		fmt.Println("ETHERSCAN_CHAIN_ID not set, using default: 1 (Ethereum mainnet)")
	}

	fmt.Printf("✓ ETHERSCAN_API_KEY: %s...%s\n", apiKey[:10], apiKey[len(apiKey)-4:])
	fmt.Printf("✓ ETHERSCAN_CHAIN_ID: %s\n", chainID)

	// Etherscan 클라이언트 생성
	client, err := NewEtherscanClient()
	if err != nil {
		log.Fatalf("Failed to create Etherscan client: %v", err)
	}
	fmt.Println("✓ Etherscan client created successfully")

	// 예제 주소 (Etherscan 예제에서 사용된 주소)
	address := "0xD3a43B1F7B41745AFf8ACf85Bb81855f2890617A"
	fmt.Printf("\nQuerying event logs for address: %s\n", address)

	// 이벤트 로그 조회
	params := GetEventLogsParams{
		Address: address,
	}

	response, err := client.GetEventLogs(params)
	if err != nil {
		log.Fatalf("Failed to get event logs: %v", err)
	}

	fmt.Printf("\nStatus: %s\n", response.Status)
	fmt.Printf("Message: %s\n", response.Message)
	fmt.Printf("Found %d event logs\n", len(response.Result))

	if len(response.Result) > 0 {
		fmt.Println("\nFirst few event logs:")
		maxShow := 3
		if len(response.Result) < maxShow {
			maxShow = len(response.Result)
		}
		for i := 0; i < maxShow; i++ {
			log := response.Result[i]
			fmt.Printf("\nEvent Log %d:\n", i+1)
			fmt.Printf("  Address: %s\n", log.Address)
			fmt.Printf("  Block Number: %s\n", log.BlockNumber)
			fmt.Printf("  Block Hash: %s\n", log.BlockHash)
			fmt.Printf("  Transaction Hash: %s\n", log.TransactionHash)
			fmt.Printf("  Time Stamp: %s\n", log.TimeStamp)
			fmt.Printf("  Topics Count: %d\n", len(log.Topics))
			if len(log.Topics) > 0 {
				fmt.Printf("  First Topic: %s\n", log.Topics[0])
			}
			eventSignature := IdentifyEpisodeEvent(log.Topics[0])
			fmt.Printf("  Identified Event: %s\n", eventSignature)
			fmt.Printf("  Data: %s\n", log.Data)
			fmt.Printf("  Gas Price: %s\n", log.GasPrice)
			fmt.Printf("  Gas Used: %s\n", log.GasUsed)
		}
	} else {
		fmt.Println("\n⚠️  No event logs found for this address")
	}
}
