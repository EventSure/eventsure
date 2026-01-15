package database

import (
	"fmt"
	"log"
	"os"
)

func ExampleUserEpisodesSelectAll() {
	// REST API 방식 (권장)
	fmt.Println("=== REST API 방식 ===")

	// 환경 변수 확인
	fmt.Println("Checking environment variables...")
	supabaseURL := os.Getenv("SUPABASE_PROJECT_URL")
	supabaseKey := os.Getenv("SUPABASE_API_KEY")

	if supabaseURL == "" {
		log.Fatal("SUPABASE_PROJECT_URL is not set")
	}
	if supabaseKey == "" {
		log.Fatal("SUPABASE_API_KEY is not set")
	}

	fmt.Printf("✓ SUPABASE_PROJECT_URL: %s\n", supabaseURL)
	fmt.Printf("✓ SUPABASE_API_KEY: %s...%s\n", supabaseKey[:10], supabaseKey[len(supabaseKey)-4:])

	restClient, err := NewSupabaseRESTClient()
	if err != nil {
		log.Fatalf("Failed to create Supabase REST client: %v", err)
	}
	fmt.Println("✓ Supabase REST client created successfully")

	// 연결 테스트: 간단한 쿼리로 테스트
	fmt.Println("\nTesting connection with a simple query...")
	testResult, _, err := restClient.Client.From("user_episodes").Select("count", "exact", false).ExecuteString()
	if err != nil {
		log.Printf("Warning: Count query failed: %v", err)
	} else {
		fmt.Printf("✓ Connection test successful. Response: %s\n", testResult)
	}

	// user_episodes 테이블에서 모든 데이터 조회
	fmt.Println("\nQuerying user_episodes table...")
	userEpisodes, err := restClient.SelectAll("user_episodes")
	if err != nil {
		log.Fatalf("Failed to select all user_episodes: %v", err)
	}

	fmt.Printf("\nFound %d user_episodes\n", len(userEpisodes))

	if len(userEpisodes) == 0 {
		fmt.Println("\n⚠️  Warning: No rows found. Possible reasons:")
		fmt.Println("   1. Row Level Security (RLS) is enabled and blocking access")
		fmt.Println("   2. Table name might be incorrect")
		fmt.Println("   3. API key might not have proper permissions")
		fmt.Println("\nTrying alternative query methods...")

		// 직접 쿼리 빌더 사용하여 상세 정보 확인
		var directResult []map[string]interface{}
		_, directErr := restClient.Client.From("user_episodes").
			Select("*", "exact", false).
			ExecuteTo(&directResult)

		if directErr != nil {
			fmt.Printf("Direct query error: %v\n", directErr)
		} else {
			fmt.Printf("Direct query returned %d rows\n", len(directResult))
			if len(directResult) > 0 {
				fmt.Println("First row sample:", directResult[0])
			}
		}
	} else {
		for i, row := range userEpisodes {
			fmt.Printf("\nRow %d:\n", i+1)
			fmt.Printf("  ID: %v\n", row["id"])
			fmt.Printf("  User: %v\n", row["user"])
			fmt.Printf("  Episode: %v\n", row["episode"])
			fmt.Printf("  Progress: %v\n", row["progress"])
			fmt.Printf("  CreatedAt: %v\n", row["created_at"])
		}
	}
}
