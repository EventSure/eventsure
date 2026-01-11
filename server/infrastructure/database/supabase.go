package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// SupabaseClient represents a Supabase database client
type SupabaseClient struct {
	Pool *pgxpool.Pool
}

// NewSupabaseClient creates a new Supabase database client
func NewSupabaseClient() (*SupabaseClient, error) {
	// Get connection string from environment variables
	supabaseURL := os.Getenv("SUPABASE_URL")
	// supabaseKey := os.Getenv("SUPABASE_KEY") // Reserved for future Supabase API usage
	supabaseDBPassword := os.Getenv("SUPABASE_DB_PASSWORD")
	supabaseDBHost := os.Getenv("SUPABASE_DB_HOST")
	supabaseDBPort := os.Getenv("SUPABASE_DB_PORT")
	supabaseDBName := os.Getenv("SUPABASE_DB_NAME")
	supabaseDBUser := os.Getenv("SUPABASE_DB_USER")

	// Build connection string
	// Format: postgresql://[user]:[password]@[host]:[port]/[database]
	var connString string
	if supabaseDBHost != "" {
		// Direct database connection (recommended for server-side)
		if supabaseDBPort == "" {
			supabaseDBPort = "5432"
		}
		if supabaseDBUser == "" {
			supabaseDBUser = "postgres"
		}
		if supabaseDBName == "" {
			supabaseDBName = "postgres"
		}
		connString = fmt.Sprintf(
			"postgresql://%s:%s@%s:%s/%s?sslmode=require",
			supabaseDBUser,
			supabaseDBPassword,
			supabaseDBHost,
			supabaseDBPort,
			supabaseDBName,
		)
	} else if supabaseURL != "" {
		// Using Supabase connection pooler (alternative)
		// Extract database connection details from Supabase URL
		// This is a fallback if direct DB connection is not available
		connString = fmt.Sprintf(
			"%s?sslmode=require",
			supabaseURL,
		)
	} else {
		return nil, fmt.Errorf("SUPABASE_DB_HOST or SUPABASE_URL must be set")
	}

	// Create connection pool configuration
	config, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return nil, fmt.Errorf("failed to parse connection string: %w", err)
	}

	// Configure pool settings
	config.MaxConns = 25
	config.MinConns = 5
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = time.Minute * 30
	config.HealthCheckPeriod = time.Minute

	// Create connection pool
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &SupabaseClient{
		Pool: pool,
	}, nil
}

// Close closes the database connection pool
func (c *SupabaseClient) Close() {
	if c.Pool != nil {
		c.Pool.Close()
	}
}

// HealthCheck checks if the database connection is healthy
func (c *SupabaseClient) HealthCheck(ctx context.Context) error {
	if c.Pool == nil {
		return fmt.Errorf("database pool is nil")
	}
	return c.Pool.Ping(ctx)
}
