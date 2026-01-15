package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"eventsure-server/infrastructure/etherscan"

	"github.com/joho/godotenv"
)

// 이 파일은 Etherscan API 클라이언트 예제를 실행하는 파일입니다.
//
// 실행 방법:
//  1. server/.env 파일을 생성하고 환경 변수를 설정합니다
//  2. go run cmd/example_etherscan/main.go
//
// .env 파일 예시:
//
//	ETHERSCAN_API_KEY=your_etherscan_api_key_here
//	ETHERSCAN_CHAIN_ID=1  # 선택사항 (기본값: 1 - Ethereum mainnet)
//
// 예제 함수:
//   - ExampleGetInternalTransactions: 주소의 내부 트랜잭션 조회
//   - ExampleGetEventLogs: 주소의 이벤트 로그 조회
func main() {
	// .env 파일 로드 (server/ 디렉토리에서 찾음)
	// 여러 위치에서 .env 파일 찾기 시도
	workDir, err := os.Getwd()
	if err != nil {
		log.Fatal("Failed to get working directory:", err)
	}

	// 가능한 .env 파일 경로들
	possiblePaths := []string{
		filepath.Join(workDir, ".env"),             // 현재 디렉토리
		filepath.Join(workDir, "..", ".env"),       // 상위 디렉토리 (server/)
		filepath.Join(workDir, "..", "..", ".env"), // 상위 상위 디렉토리
	}

	var envLoaded bool
	for _, envPath := range possiblePaths {
		if err := godotenv.Load(envPath); err == nil {
			log.Printf("Loaded .env file from: %s\n", envPath)
			envLoaded = true
			break
		}
	}

	if !envLoaded {
		log.Println("Warning: .env file not found. Using environment variables only.")
		log.Println("Tip: Create a .env file in the server/ directory with your Etherscan API key")
		log.Println("Example .env file location: server/.env")
		log.Println("Required environment variable: ETHERSCAN_API_KEY")
	}

	// 실행할 예제 선택 (명령줄 인자로 선택 가능)
	example := "all"
	if len(os.Args) > 1 {
		example = os.Args[1]
	}

	switch example {
	case "internal", "internal-transactions":
		etherscan.ExampleGetInternalTransactions()
	case "logs", "event-logs":
		etherscan.ExampleGetEventLogs()
	case "all", "":
		fmt.Println("Running all examples...")
		etherscan.ExampleGetInternalTransactions()
		fmt.Println("\n" + strings.Repeat("=", 80))
		etherscan.ExampleGetEventLogs()
	default:
		log.Fatalf("Unknown example: %s\nAvailable examples: internal, logs, all", example)
	}
}
