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

const aboutUsPK = "CONFIG#ABOUT"
const aboutUsSK = "CONFIG#ABOUT"

// GetAboutUs retrieves the About Us content from DynamoDB.
// Returns the default content if none has been saved yet.
func GetAboutUs(ctx context.Context) (models.AboutUsContent, error) {
	result, err := client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: aboutUsPK},
			"SK": &types.AttributeValueMemberS{Value: aboutUsSK},
		},
	})
	if err != nil {
		return models.DefaultAboutUsContent(), fmt.Errorf("failed to get about us: %w", err)
	}
	if result.Item == nil {
		return models.DefaultAboutUsContent(), nil
	}

	var content models.AboutUsContent
	if err := attributevalue.UnmarshalMap(result.Item, &content); err != nil {
		return models.DefaultAboutUsContent(), fmt.Errorf("failed to unmarshal about us: %w", err)
	}

	return content, nil
}

// PutAboutUs saves the About Us content to DynamoDB.
func PutAboutUs(ctx context.Context, content models.AboutUsContent) error {
	av, err := attributevalue.MarshalMap(content)
	if err != nil {
		return fmt.Errorf("failed to marshal about us: %w", err)
	}

	av["PK"] = &types.AttributeValueMemberS{Value: aboutUsPK}
	av["SK"] = &types.AttributeValueMemberS{Value: aboutUsSK}
	av["entityType"] = &types.AttributeValueMemberS{Value: "Config"}

	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      av,
	})

	return err
}
