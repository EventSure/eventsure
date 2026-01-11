package database

import (
	"context"
	"fmt"
	"log"
)

// ExampleUsage demonstrates how to use the Supabase client
func ExampleUsage() {
	// Create Supabase client
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
