package database

import (
	"fmt"
	"os"
	"strconv"

	supabase "github.com/supabase-community/supabase-go"
)

// SupabaseRESTClient represents a Supabase REST API client
type SupabaseRESTClient struct {
	Client *supabase.Client
}

// NewSupabaseRESTClient creates a new Supabase REST API client
// Uses Project URL and API Key for authentication
func NewSupabaseRESTClient() (*SupabaseRESTClient, error) {
	// Get Supabase project URL and API key from environment variables
	supabaseURL := os.Getenv("SUPABASE_PROJECT_URL")
	supabaseKey := os.Getenv("SUPABASE_API_KEY")

	if supabaseURL == "" {
		return nil, fmt.Errorf("SUPABASE_PROJECT_URL or SUPABASE_URL must be set")
	}
	if supabaseKey == "" {
		return nil, fmt.Errorf("SUPABASE_API_KEY, SUPABASE_ANON_KEY, or SUPABASE_PUBLISHABLE_KEY must be set")
	}

	// Create Supabase client
	client, err := supabase.NewClient(supabaseURL, supabaseKey, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create Supabase client: %w", err)
	}

	return &SupabaseRESTClient{
		Client: client,
	}, nil
}

// From returns a query builder for the specified table
// Use client.Client.From() directly for advanced queries

// Helper function to convert interface{} to string for filter operations
func toString(value interface{}) string {
	switch v := value.(type) {
	case string:
		return v
	case int:
		return strconv.Itoa(v)
	case int64:
		return strconv.FormatInt(v, 10)
	case float64:
		return strconv.FormatFloat(v, 'f', -1, 64)
	case bool:
		return strconv.FormatBool(v)
	default:
		return fmt.Sprintf("%v", v)
	}
}

// Example usage methods

// SelectAll selects all rows from a table
func (c *SupabaseRESTClient) SelectAll(table string) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	_, err := c.Client.From(table).Select("*", "exact", false).ExecuteTo(&result)
	if err != nil {
		return nil, fmt.Errorf("failed to select from %s: %w", table, err)
	}
	return result, nil
}

// SelectByID selects a row by ID
func (c *SupabaseRESTClient) SelectByID(table string, id string) (map[string]interface{}, error) {
	var result []map[string]interface{}
	_, err := c.Client.From(table).Select("*", "exact", false).Eq("id", id).Single().ExecuteTo(&result)
	if err != nil {
		return nil, fmt.Errorf("failed to select from %s by id %s: %w", table, id, err)
	}
	if len(result) == 0 {
		return nil, fmt.Errorf("no row found with id %s", id)
	}
	return result[0], nil
}

// Insert inserts a new row into a table
func (c *SupabaseRESTClient) Insert(table string, data interface{}) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	_, err := c.Client.From(table).Insert(data, false, "", "", "").ExecuteTo(&result)
	if err != nil {
		return nil, fmt.Errorf("failed to insert into %s: %w", table, err)
	}
	return result, nil
}

// Update updates rows in a table
func (c *SupabaseRESTClient) Update(table string, data interface{}, filter map[string]interface{}) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	query := c.Client.From(table).Update(data, "", "")

	// Apply filters
	for key, value := range filter {
		query = query.Eq(key, toString(value))
	}

	_, err := query.ExecuteTo(&result)
	if err != nil {
		return nil, fmt.Errorf("failed to update %s: %w", table, err)
	}
	return result, nil
}

// Delete deletes rows from a table
func (c *SupabaseRESTClient) Delete(table string, filter map[string]interface{}) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	query := c.Client.From(table).Delete("", "")

	// Apply filters
	for key, value := range filter {
		query = query.Eq(key, toString(value))
	}

	_, err := query.ExecuteTo(&result)
	if err != nil {
		return nil, fmt.Errorf("failed to delete from %s: %w", table, err)
	}
	return result, nil
}
