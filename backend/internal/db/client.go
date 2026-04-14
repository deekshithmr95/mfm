package db

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
)

var (
	client *firestore.Client
)

// Collection names
const (
	CollectionProducts = "products"
	CollectionOrders   = "orders"
	CollectionUsers    = "users"
	CollectionConfig   = "config"
)

// Init initializes the Firestore client. Call once at startup.
func Init() {
	projectID := os.Getenv("GCP_PROJECT_ID")
	if projectID == "" {
		projectID = "mysore-farmer-marketplace"
	}

	ctx := context.Background()

	// The Firestore SDK automatically detects FIRESTORE_EMULATOR_HOST
	// for local development (e.g., FIRESTORE_EMULATOR_HOST=localhost:8080)
	var err error
	client, err = firestore.NewClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}
}

// GetClient returns the Firestore client
func GetClient() *firestore.Client {
	return client
}

// Close closes the Firestore client connection
func Close() {
	if client != nil {
		client.Close()
	}
}
