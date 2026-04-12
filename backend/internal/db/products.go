package db

import (
	"context"
	"fmt"
	"strings"

	"farmers-marketplace-backend/internal/models"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

// PutProduct stores a product in DynamoDB (writes to both PRODUCT# and FARMER# partition)
func PutProduct(ctx context.Context, product models.Product) (models.Product, error) {
	if product.ID == "" {
		product.ID = uuid.New().String()
	}

	// Marshal product attributes
	av, err := attributevalue.MarshalMap(product)
	if err != nil {
		return product, fmt.Errorf("failed to marshal product: %w", err)
	}

	// Primary row: PRODUCT#<id> / PRODUCT#<id>
	av["PK"] = &types.AttributeValueMemberS{Value: "PRODUCT#" + product.ID}
	av["SK"] = &types.AttributeValueMemberS{Value: "PRODUCT#" + product.ID}
	av["entityType"] = &types.AttributeValueMemberS{Value: "Product"}

	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      av,
	})
	if err != nil {
		return product, fmt.Errorf("failed to put product: %w", err)
	}

	// Denormalized row: FARMER#<farmerId> / PRODUCT#<id>
	av["PK"] = &types.AttributeValueMemberS{Value: "FARMER#" + product.FarmerID}
	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      av,
	})

	return product, err
}

// GetProduct retrieves a single product by ID
func GetProduct(ctx context.Context, productID string) (*models.Product, error) {
	result, err := client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "PRODUCT#" + productID},
			"SK": &types.AttributeValueMemberS{Value: "PRODUCT#" + productID},
		},
	})
	if err != nil {
		return nil, err
	}
	if result.Item == nil {
		return nil, nil
	}

	var product models.Product
	err = attributevalue.UnmarshalMap(result.Item, &product)
	return &product, err
}

// ListProducts scans for all products (for small datasets; in production use a GSI)
func ListProducts(ctx context.Context, category string) ([]models.Product, error) {
	input := &dynamodb.ScanInput{
		TableName:        aws.String(tableName),
		FilterExpression: aws.String("entityType = :et AND begins_with(PK, :pk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":et": &types.AttributeValueMemberS{Value: "Product"},
			":pk": &types.AttributeValueMemberS{Value: "PRODUCT#"},
		},
	}

	if category != "" {
		input.FilterExpression = aws.String("entityType = :et AND begins_with(PK, :pk) AND category = :cat")
		input.ExpressionAttributeValues[":cat"] = &types.AttributeValueMemberS{Value: category}
	}

	result, err := client.Scan(ctx, input)
	if err != nil {
		return nil, err
	}

	var products []models.Product
	err = attributevalue.UnmarshalListOfMaps(result.Items, &products)
	return products, err
}

// SearchProducts performs a server-side search across name, farmer, category, and description.
// Results can be sorted by price_low, price_high, or rating.
func SearchProducts(ctx context.Context, query, category, sortBy string) ([]models.Product, error) {
	// Fetch all products first (for small dataset; use OpenSearch for scale)
	products, err := ListProducts(ctx, category)
	if err != nil {
		return nil, err
	}

	// Filter by search query
	if query != "" {
		q := strings.ToLower(query)
		var filtered []models.Product
		for _, p := range products {
			if strings.Contains(strings.ToLower(p.Name), q) ||
				strings.Contains(strings.ToLower(p.FarmerName), q) ||
				strings.Contains(strings.ToLower(p.Category), q) ||
				strings.Contains(strings.ToLower(p.Description), q) {
				filtered = append(filtered, p)
			}
		}
		products = filtered
	}

	// Sort
	switch sortBy {
	case "price_low":
		sortProducts(products, func(a, b models.Product) bool { return a.OfferPrice < b.OfferPrice })
	case "price_high":
		sortProducts(products, func(a, b models.Product) bool { return a.OfferPrice > b.OfferPrice })
	case "rating":
		sortProducts(products, func(a, b models.Product) bool { return a.Rating > b.Rating })
	}

	return products, nil
}

// sortProducts sorts a slice of products using a comparison function
func sortProducts(products []models.Product, less func(a, b models.Product) bool) {
	n := len(products)
	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			if less(products[j], products[i]) {
				products[i], products[j] = products[j], products[i]
			}
		}
	}
}

// ListFarmerProducts queries products for a specific farmer
func ListFarmerProducts(ctx context.Context, farmerID string) ([]models.Product, error) {
	result, err := client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(tableName),
		KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "FARMER#" + farmerID},
			":sk": &types.AttributeValueMemberS{Value: "PRODUCT#"},
		},
	})
	if err != nil {
		return nil, err
	}

	var products []models.Product
	err = attributevalue.UnmarshalListOfMaps(result.Items, &products)
	return products, err
}

// UpdateProduct updates a product's fields
func UpdateProduct(ctx context.Context, productID string, input models.UpdateProductInput) (*models.Product, error) {
	product, err := GetProduct(ctx, productID)
	if err != nil || product == nil {
		return nil, fmt.Errorf("product not found")
	}

	// Apply core updates
	if input.Name != nil {
		product.Name = *input.Name
	}
	if input.Image != nil {
		product.Image = *input.Image
	}
	if input.OriginalPrice != nil {
		product.OriginalPrice = *input.OriginalPrice
	}
	if input.OfferPrice != nil {
		product.OfferPrice = *input.OfferPrice
	}
	if input.DiscountPercent != nil {
		product.DiscountPercent = *input.DiscountPercent
	}
	if input.Stock != nil {
		product.Stock = *input.Stock
	}
	if input.Category != nil {
		product.Category = *input.Category
	}
	if input.Unit != nil {
		product.Unit = *input.Unit
	}
	if input.Description != nil {
		product.Description = *input.Description
	}

	// Apply farmer provenance updates
	if input.FarmerLocation != nil {
		product.FarmerLocation = *input.FarmerLocation
	}
	if input.FarmerSince != nil {
		product.FarmerSince = *input.FarmerSince
	}
	if input.FarmingMethod != nil {
		product.FarmingMethod = *input.FarmingMethod
	}
	if input.Certifications != nil {
		product.Certifications = input.Certifications
	}

	// Apply harvest info updates
	if input.HarvestDate != nil {
		product.HarvestDate = *input.HarvestDate
	}
	if input.ShelfLife != nil {
		product.ShelfLife = *input.ShelfLife
	}

	// Apply badge updates
	if input.Badges != nil {
		product.Badges = input.Badges
	}

	// Apply rating updates
	if input.Rating != nil {
		product.Rating = *input.Rating
	}
	if input.ReviewCount != nil {
		product.ReviewCount = *input.ReviewCount
	}

	// Re-write both rows
	_, err = PutProduct(ctx, *product)
	return product, err
}

// DeleteProduct removes both rows for a product
func DeleteProduct(ctx context.Context, productID, farmerID string) error {
	// Delete primary row
	_, err := client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: aws.String(tableName),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "PRODUCT#" + productID},
			"SK": &types.AttributeValueMemberS{Value: "PRODUCT#" + productID},
		},
	})
	if err != nil {
		return err
	}

	// Delete farmer denormalized row
	_, err = client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: aws.String(tableName),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "FARMER#" + farmerID},
			"SK": &types.AttributeValueMemberS{Value: "PRODUCT#" + productID},
		},
	})
	return err
}
