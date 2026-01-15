package main

import (
	"log"
	"os"
	"path/filepath"

	"eventsure-server/infrastructure/database"

	"github.com/joho/godotenv"
)

// 이 파일은 ExampleUserEpisodesSelectAll 함수를 실행하는 예제입니다.
//
// 실행 방법:
//  1. server/.env 파일을 생성하고 환경 변수를 설정합니다 (infrastructure/database/ENV_SETUP.md 참조)
//  2. go run cmd/example_user_episodes/main.go
//
// .env 파일 예시 (REST API 방식 - 권장):
//
//	SUPABASE_PROJECT_URL=https://vnxebakrejhkakhhxajq.supabase.co
//	SUPABASE_API_KEY=sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1
//
// .env 파일 예시 (PostgreSQL 직접 연결):
//
//	SUPABASE_DB_HOST=db.vnxebakrejhkakhhxajq.supabase.co
//	SUPABASE_DB_PORT=5432
//	SUPABASE_DB_NAME=postgres
//	SUPABASE_DB_USER=postgres
//	SUPABASE_DB_PASSWORD=your-database-password
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
		log.Println("Tip: Create a .env file in the server/ directory with your Supabase credentials")
		log.Println("Example .env file location: server/.env")
	}

	// user_episodes 테이블에서 모든 데이터를 조회하는 예제 실행
	database.ExampleUserEpisodesSelectAll()
}
