package db

import (
	"context"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var (
	client    *dynamodb.Client
	tableName string
)

// Init initializes the DynamoDB client. Call once at startup.
func Init() {
	tableName = os.Getenv("DYNAMODB_TABLE")
	if tableName == "" {
		tableName = "farmers-marketplace-dev"
	}

	endpoint := os.Getenv("DYNAMODB_ENDPOINT")

	ctx := context.Background()

	if endpoint != "" {
		// Local DynamoDB (Docker)
		cfg, err := config.LoadDefaultConfig(ctx,
			config.WithRegion("us-east-1"),
			config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("local", "local", "local")),
		)
		if err != nil {
			panic("unable to load SDK config: " + err.Error())
		}
		client = dynamodb.NewFromConfig(cfg, func(o *dynamodb.Options) {
			o.BaseEndpoint = aws.String(endpoint)
		})
	} else {
		// AWS (Lambda environment auto-provides credentials)
		cfg, err := config.LoadDefaultConfig(ctx)
		if err != nil {
			panic("unable to load SDK config: " + err.Error())
		}
		client = dynamodb.NewFromConfig(cfg)
	}
}

// GetClient returns the DynamoDB client
func GetClient() *dynamodb.Client {
	return client
}

// GetTableName returns the table name
func GetTableName() string {
	return tableName
}
