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
