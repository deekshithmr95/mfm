package db

import (
	"context"
	"fmt"

	"farmers-marketplace-backend/internal/models"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// PutUser stores a user (primary row + role-based row for admin queries)
func PutUser(ctx context.Context, user models.User) error {
	av, err := attributevalue.MarshalMap(user)
	if err != nil {
		return fmt.Errorf("failed to marshal user: %w", err)
	}

	// Primary row: USER#<id> / USER#<id>
	av["PK"] = &types.AttributeValueMemberS{Value: "USER#" + user.ID}
	av["SK"] = &types.AttributeValueMemberS{Value: "USER#" + user.ID}
	av["entityType"] = &types.AttributeValueMemberS{Value: "User"}

	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      av,
	})
	if err != nil {
		return err
	}

	// Denormalized row: ROLE#<role> / USER#<id> for listing all farmers/consumers
	av["PK"] = &types.AttributeValueMemberS{Value: "ROLE#" + user.Role}
	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      av,
	})

	return err
}

// GetUser retrieves a user by ID
func GetUser(ctx context.Context, userID string) (*models.User, error) {
	result, err := client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "USER#" + userID},
			"SK": &types.AttributeValueMemberS{Value: "USER#" + userID},
		},
	})
	if err != nil {
		return nil, err
	}
	if result.Item == nil {
		return nil, nil
	}

	var user models.User
	err = attributevalue.UnmarshalMap(result.Item, &user)
	return &user, err
}

// ListUsersByRole queries all users with a specific role
func ListUsersByRole(ctx context.Context, role string) ([]models.User, error) {
	result, err := client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(tableName),
		KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "ROLE#" + role},
			":sk": &types.AttributeValueMemberS{Value: "USER#"},
		},
	})
	if err != nil {
		return nil, err
	}

	var users []models.User
	err = attributevalue.UnmarshalListOfMaps(result.Items, &users)
	return users, err
}

// ListAllUsers scans for all users (admin only)
func ListAllUsers(ctx context.Context) ([]models.User, error) {
	result, err := client.Scan(ctx, &dynamodb.ScanInput{
		TableName:        aws.String(tableName),
		FilterExpression: aws.String("entityType = :et AND begins_with(PK, :pk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":et": &types.AttributeValueMemberS{Value: "User"},
			":pk": &types.AttributeValueMemberS{Value: "USER#"},
		},
	})
	if err != nil {
		return nil, err
	}

	var users []models.User
	err = attributevalue.UnmarshalListOfMaps(result.Items, &users)
	return users, err
}

// UpdateUserStatus updates the status and optionally notes for a user
func UpdateUserStatus(ctx context.Context, userID, status, notes string) error {
	user, err := GetUser(ctx, userID)
	if err != nil || user == nil {
		return fmt.Errorf("user not found")
	}

	user.Status = status
	if notes != "" {
		user.Notes = notes
	}

	return PutUser(ctx, *user)
}

// UpdateUserNotes updates admin support notes for a user
func UpdateUserNotes(ctx context.Context, userID, notes string) error {
	user, err := GetUser(ctx, userID)
	if err != nil || user == nil {
		return fmt.Errorf("user not found")
	}

	user.Notes = notes
	return PutUser(ctx, *user)
}
