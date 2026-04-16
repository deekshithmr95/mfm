package db

import (
	"context"
	"fmt"
	"strings"

	"github.com/deekshithmr95/mfm/backend/internal/models"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"
)

// PutProduct stores a product in Firestore
func PutProduct(ctx context.Context, product models.Product) (models.Product, error) {
	if product.ID == "" {
		product.ID = uuid.New().String()
	}

	_, err := client.Collection(CollectionProducts).Doc(product.ID).Set(ctx, product)
	if err != nil {
		return product, fmt.Errorf("failed to put product: %w", err)
	}

	return product, nil
}

// GetProduct retrieves a single product by ID
func GetProduct(ctx context.Context, productID string) (*models.Product, error) {
	doc, err := client.Collection(CollectionProducts).Doc(productID).Get(ctx)
	if err != nil {
		// Check if the document was not found
		if isNotFound(err) {
			return nil, nil
		}
		return nil, err
	}

	var product models.Product
	if err := doc.DataTo(&product); err != nil {
		return nil, err
	}
	return &product, nil
}

// ListProducts retrieves all products, optionally filtered by category
func ListProducts(ctx context.Context, category string) ([]models.Product, error) {
	var query firestore.Query

	if category != "" {
		query = client.Collection(CollectionProducts).Where("category", "==", category)
	} else {
		query = client.Collection(CollectionProducts).Query
	}

	iter := query.Documents(ctx)
	defer iter.Stop()

	products := []models.Product{}
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var product models.Product
		if err := doc.DataTo(&product); err != nil {
			continue
		}
		products = append(products, product)
	}

	return products, nil
}

// SearchProducts performs a server-side search across name, farmer, category, and description.
// Results can be sorted by price_low, price_high, or rating.
func SearchProducts(ctx context.Context, query, category, sortBy string) ([]models.Product, error) {
	// Fetch all products first (for small dataset; use a full-text search service for scale)
	products, err := ListProducts(ctx, category)
	if err != nil {
		return nil, err
	}

	// Filter by search query
	if query != "" {
		q := strings.ToLower(query)
		filtered := []models.Product{}
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
	iter := client.Collection(CollectionProducts).Where("farmerId", "==", farmerID).Documents(ctx)
	defer iter.Stop()

	products := []models.Product{}
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var product models.Product
		if err := doc.DataTo(&product); err != nil {
			continue
		}
		products = append(products, product)
	}

	return products, nil
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

	// Write back to Firestore
	_, err = PutProduct(ctx, *product)
	return product, err
}

// DeleteProduct removes a product document
func DeleteProduct(ctx context.Context, productID, farmerID string) error {
	_, err := client.Collection(CollectionProducts).Doc(productID).Delete(ctx)
	return err
}

// isNotFound checks if an error is a Firestore "not found" error
func isNotFound(err error) bool {
	if err == nil {
		return false
	}
	return strings.Contains(err.Error(), "NotFound") || strings.Contains(err.Error(), "not found")
}
