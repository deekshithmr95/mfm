package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"farmers-marketplace-backend/internal/db"
	"farmers-marketplace-backend/internal/middleware"
	"farmers-marketplace-backend/internal/models"

	"github.com/aws/aws-lambda-go/events"
)

type Response = events.APIGatewayProxyResponse

// ListProducts handles GET /api/products
func ListProducts(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	category := request.QueryStringParameters["category"]

	products, err := db.ListProducts(ctx, category)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to list products: "+err.Error())
	}

	return jsonResponse(http.StatusOK, products)
}

// SearchProducts handles GET /api/products/search?q=...&sort=...&category=...
func SearchProducts(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	query := request.QueryStringParameters["q"]
	sortBy := request.QueryStringParameters["sort"]
	category := request.QueryStringParameters["category"]

	products, err := db.SearchProducts(ctx, query, category, sortBy)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, "Search failed: "+err.Error())
	}

	return jsonResponse(http.StatusOK, products)
}

// GetProduct handles GET /api/products/{id}
func GetProduct(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	id := extractPathParam(request.Path, "/api/products/")

	product, err := db.GetProduct(ctx, id)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}
	if product == nil {
		return errorResponse(http.StatusNotFound, "Product not found")
	}

	return jsonResponse(http.StatusOK, product)
}

// CreateProduct handles POST /api/products
func CreateProduct(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	user, ok := middleware.RequireRole(request, "farmer")
	if !ok {
		return errorResponse(http.StatusForbidden, "Only farmers can create products")
	}

	var input models.CreateProductInput
	if err := json.Unmarshal([]byte(request.Body), &input); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	if input.Name == "" {
		return errorResponse(http.StatusBadRequest, "Product name is required")
	}

	product := models.NewProduct(input, user.UserID, user.Farm)

	created, err := db.PutProduct(ctx, product)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to create product: "+err.Error())
	}

	return jsonResponse(http.StatusCreated, created)
}

// UpdateProduct handles PUT /api/products/{id}
func UpdateProduct(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	user, ok := middleware.RequireRole(request, "farmer")
	if !ok {
		return errorResponse(http.StatusForbidden, "Only farmers can update products")
	}

	id := extractPathParam(request.Path, "/api/products/")

	// Verify ownership
	product, err := db.GetProduct(ctx, id)
	if err != nil || product == nil {
		return errorResponse(http.StatusNotFound, "Product not found")
	}
	if product.FarmerID != user.UserID {
		return errorResponse(http.StatusForbidden, "You can only update your own products")
	}

	var input models.UpdateProductInput
	if err := json.Unmarshal([]byte(request.Body), &input); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	updated, err := db.UpdateProduct(ctx, id, input)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to update product: "+err.Error())
	}

	return jsonResponse(http.StatusOK, updated)
}

// DeleteProduct handles DELETE /api/products/{id}
func DeleteProduct(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	user, ok := middleware.RequireRole(request, "farmer")
	if !ok {
		return errorResponse(http.StatusForbidden, "Only farmers can delete products")
	}

	id := extractPathParam(request.Path, "/api/products/")

	// Verify ownership
	product, err := db.GetProduct(ctx, id)
	if err != nil || product == nil {
		return errorResponse(http.StatusNotFound, "Product not found")
	}
	if product.FarmerID != user.UserID {
		return errorResponse(http.StatusForbidden, "You can only delete your own products")
	}

	if err := db.DeleteProduct(ctx, id, user.UserID); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to delete product: "+err.Error())
	}

	return jsonResponse(http.StatusOK, map[string]string{"message": "Product deleted"})
}

// ---- Helpers ----

func extractPathParam(path, prefix string) string {
	trimmed := strings.TrimPrefix(path, prefix)
	// Remove trailing path segments
	if idx := strings.Index(trimmed, "/"); idx >= 0 {
		trimmed = trimmed[:idx]
	}
	return trimmed
}
