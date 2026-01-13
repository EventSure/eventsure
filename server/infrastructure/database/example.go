package database

import (
	"context"
	"fmt"
	"log"
)

// ExampleUsage demonstrates how to use the Supabase PostgreSQL client
func ExampleUsage() {
	// Create Supabase PostgreSQL client
	client, err := NewSupabaseClient()
	if err != nil {
		log.Fatal("Failed to connect to Supabase:", err)
	}
	defer client.Close()

	// Example: Execute a simple query
	ctx := context.Background()
	var version string
	err = client.Pool.QueryRow(ctx, "SELECT version()").Scan(&version)
	if err != nil {
		log.Fatal("Query failed:", err)
	}
	fmt.Println("PostgreSQL version:", version)

	// Example: Health check
	if err := client.HealthCheck(ctx); err != nil {
		log.Println("Health check failed:", err)
	} else {
		fmt.Println("Database connection is healthy")
	}
}

// ExampleRESTUsage demonstrates how to use the Supabase REST API client
func ExampleRESTUsage() {
	// Create Supabase REST API client
	client, err := NewSupabaseRESTClient()
	if err != nil {
		log.Fatal("Failed to create Supabase REST client:", err)
	}

	// Example: Select all rows from a table
	results, err := client.SelectAll("episodes")
	if err != nil {
		log.Fatal("Failed to select episodes:", err)
	}
	fmt.Printf("Found %d episodes\n", len(results))

	// Example: Select by ID
	episode, err := client.SelectByID("episodes", "episode-1")
	if err != nil {
		log.Println("Failed to select episode:", err)
	} else {
		fmt.Printf("Episode: %+v\n", episode)
	}

	// Example: Insert a new row
	newData := map[string]interface{}{
		"id":     "episode-new",
		"title":  "New Episode",
		"status": "active",
	}
	inserted, err := client.Insert("episodes", newData)
	if err != nil {
		log.Println("Failed to insert:", err)
	} else {
		fmt.Printf("Inserted: %+v\n", inserted)
	}

	// Example: Update rows
	updateData := map[string]interface{}{
		"status": "completed",
	}
	filter := map[string]interface{}{
		"id": "episode-1",
	}
	updated, err := client.Update("episodes", updateData, filter)
	if err != nil {
		log.Println("Failed to update:", err)
	} else {
		fmt.Printf("Updated: %+v\n", updated)
	}

	// Example: Delete rows
	deleted, err := client.Delete("episodes", filter)
	if err != nil {
		log.Println("Failed to delete:", err)
	} else {
		fmt.Printf("Deleted: %+v\n", deleted)
	}

	// Example: Using query builder directly
	var customResults []map[string]interface{}
	_, err = client.Client.From("episodes").
		Select("id,title,status", "exact", false).
		Eq("status", "active").
		Limit(10, "").
		ExecuteTo(&customResults)
	if err != nil {
		log.Println("Failed to execute custom query:", err)
	} else {
		fmt.Printf("Custom query results: %+v\n", customResults)
	}
}

// ExampleUserEpisodesSelectAll demonstrates how to select all rows from user_episodes table
// This example uses the actual table structure from Supabase:
// - id (int8, Primary Key)
// - user (varchar)
// - episode (varchar)
// - progress (varchar, nullable)
// - created_at (timestamptz)
//
// 환경 변수 설정 방법:
//
// REST API 방식 사용 시 (권장):
//
//	export SUPABASE_PROJECT_URL=https://vnxebakrejhkakhhxajq.supabase.co
//	export SUPABASE_API_KEY=sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1
//
// PostgreSQL 직접 연결 방식 사용 시:
//
//	export SUPABASE_DB_HOST=db.vnxebakrejhkakhhxajq.supabase.co
//	export SUPABASE_DB_PORT=5432
//	export SUPABASE_DB_NAME=postgres
//	export SUPABASE_DB_USER=postgres
//	export SUPABASE_DB_PASSWORD=your-database-password
//
// 또는 연결 문자열 사용:
//
//	export SUPABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.vnxebakrejhkakhhxajq.supabase.co:5432/postgres
//
// 실행 방법:
//  1. 환경 변수 설정 (위 참조 또는 ENV_SETUP.md 참조)
//  2. go run cmd/example_user_episodes/main.go
//  3. 또는 별도의 main 함수에서 database.ExampleUserEpisodesSelectAll() 호출
func ExampleUserEpisodesSelectAll() {
	// REST API 방식 (권장)
	fmt.Println("=== REST API 방식 ===")
	restClient, err := NewSupabaseRESTClient()
	if err != nil {
		log.Fatal("Failed to create Supabase REST client:", err)
	}

	// user_episodes 테이블에서 모든 데이터 조회
	userEpisodes, err := restClient.SelectAll("user_episodes")
	if err != nil {
		log.Fatal("Failed to select all user_episodes:", err)
	}

	fmt.Printf("Found %d user_episodes\n", len(userEpisodes))
	for _, row := range userEpisodes {
		fmt.Printf("ID: %v, User: %v, Episode: %v, Progress: %v, CreatedAt: %v\n",
			row["id"],
			row["user"],
			row["episode"],
			row["progress"],
			row["created_at"],
		)
	}
}
