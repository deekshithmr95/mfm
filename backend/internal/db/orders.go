package db

import (
	"context"
	"fmt"

	"farmers-marketplace-backend/internal/models"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

// PutOrder stores an order (primary row + customer denormalized row)
func PutOrder(ctx context.Context, order models.Order) (models.Order, error) {
	if order.ID == "" {
		order.ID = uuid.New().String()
	}

	av, err := attributevalue.MarshalMap(order)
	if err != nil {
		return order, fmt.Errorf("failed to marshal order: %w", err)
	}

	// Primary row: ORDER#<id> / ORDER#<id>
	av["PK"] = &types.AttributeValueMemberS{Value: "ORDER#" + order.ID}
	av["SK"] = &types.AttributeValueMemberS{Value: "ORDER#" + order.ID}
	av["entityType"] = &types.AttributeValueMemberS{Value: "Order"}

	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      av,
	})
	if err != nil {
		return order, err
	}

	// Denormalized: CUSTOMER#<customerId> / ORDER#<id>
	av["PK"] = &types.AttributeValueMemberS{Value: "CUSTOMER#" + order.CustomerID}
	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      av,
	})

	return order, err
}

// GetOrder retrieves a single order by ID
func GetOrder(ctx context.Context, orderID string) (*models.Order, error) {
	result, err := client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "ORDER#" + orderID},
			"SK": &types.AttributeValueMemberS{Value: "ORDER#" + orderID},
		},
	})
	if err != nil {
		return nil, err
	}
	if result.Item == nil {
		return nil, nil
	}

	var order models.Order
	err = attributevalue.UnmarshalMap(result.Item, &order)
	return &order, err
}

// ListCustomerOrders queries orders for a specific customer
func ListCustomerOrders(ctx context.Context, customerID string) ([]models.Order, error) {
	result, err := client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(tableName),
		KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "CUSTOMER#" + customerID},
			":sk": &types.AttributeValueMemberS{Value: "ORDER#"},
		},
		ScanIndexForward: aws.Bool(false), // newest first
	})
	if err != nil {
		return nil, err
	}

	var orders []models.Order
	err = attributevalue.UnmarshalListOfMaps(result.Items, &orders)
	return orders, err
}

// ListAllOrders scans for all orders (admin use)
func ListAllOrders(ctx context.Context) ([]models.Order, error) {
	result, err := client.Scan(ctx, &dynamodb.ScanInput{
		TableName:        aws.String(tableName),
		FilterExpression: aws.String("entityType = :et AND begins_with(PK, :pk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":et": &types.AttributeValueMemberS{Value: "Order"},
			":pk": &types.AttributeValueMemberS{Value: "ORDER#"},
		},
	})
	if err != nil {
		return nil, err
	}

	var orders []models.Order
	err = attributevalue.UnmarshalListOfMaps(result.Items, &orders)
	return orders, err
}

// UpdateOrderStatus updates the status of an order across all denormalized rows
func UpdateOrderStatus(ctx context.Context, orderID, status string) error {
	order, err := GetOrder(ctx, orderID)
	if err != nil || order == nil {
		return fmt.Errorf("order not found")
	}

	order.Status = status

	// Re-write the order (updates all denormalized copies)
	_, err = PutOrder(ctx, *order)
	return err
}
