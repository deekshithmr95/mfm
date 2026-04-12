package handlers

import (
	"context"
	"net/http"

	"farmers-marketplace-backend/internal/db"
	"farmers-marketplace-backend/internal/middleware"

	"github.com/aws/aws-lambda-go/events"
)

// FarmerStats represents aggregated dashboard data
type FarmerStats struct {
	TotalProducts  int `json:"totalProducts"`
	ActiveListings int `json:"activeListings"`
}

// GetFarmerStats handles GET /api/farmer/stats
func GetFarmerStats(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	user, ok := middleware.RequireRole(request, "farmer")
	if !ok {
		return errorResponse(http.StatusForbidden, "Only farmers can access this endpoint")
	}

	products, err := db.ListFarmerProducts(ctx, user.UserID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	stats := FarmerStats{
		TotalProducts: len(products),
	}

	for _, p := range products {
		if p.Stock > 0 {
			stats.ActiveListings++
		}
	}

	return jsonResponse(http.StatusOK, stats)
}

// GetFarmerListings handles GET /api/farmer/listings
func GetFarmerListings(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	user, ok := middleware.RequireRole(request, "farmer")
	if !ok {
		return errorResponse(http.StatusForbidden, "Only farmers can access this endpoint")
	}

	products, err := db.ListFarmerProducts(ctx, user.UserID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return jsonResponse(http.StatusOK, products)
}

// GetFarmerOrders handles GET /api/farmer/orders
// Note: In the updated model, farmers view all orders (admin-like access to manage)
func GetFarmerOrders(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "farmer")
	if !ok {
		return errorResponse(http.StatusForbidden, "Only farmers can access this endpoint")
	}

	// For now return all orders; in production, would filter by farmer's products
	orders, err := db.ListAllOrders(ctx)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return jsonResponse(http.StatusOK, orders)
}
