package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"farmers-marketplace-backend/internal/db"
	"farmers-marketplace-backend/internal/middleware"
	"farmers-marketplace-backend/internal/models"

	"github.com/aws/aws-lambda-go/events"
)

// PlatformOverview represents the admin dashboard stats
type PlatformOverview struct {
	TotalFarmers    int     `json:"totalFarmers"`
	TotalConsumers  int     `json:"totalConsumers"`
	TotalProducts   int     `json:"totalProducts"`
	TotalOrders     int     `json:"totalOrders"`
	TotalRevenue    float64 `json:"totalRevenue"`
	PendingOnboard  int     `json:"pendingOnboard"`
	ActiveListings  int     `json:"activeListings"`
}

// UserWithStats wraps a user with additional computed data
type UserWithStats struct {
	models.User
	ProductCount int     `json:"productCount,omitempty"`
	OrderCount   int     `json:"orderCount,omitempty"`
	TotalSales   float64 `json:"totalSales,omitempty"`
}

// GetPlatformOverview handles GET /api/admin/overview
func GetPlatformOverview(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "admin")
	if !ok {
		return errorResponse(http.StatusForbidden, "Admin access required")
	}

	farmers, _ := db.ListUsersByRole(ctx, "farmer")
	consumers, _ := db.ListUsersByRole(ctx, "consumer")
	products, _ := db.ListProducts(ctx, "")
	allOrders, _ := db.ListAllOrders(ctx)

	overview := PlatformOverview{
		TotalFarmers:   len(farmers),
		TotalConsumers: len(consumers),
		TotalProducts:  len(products),
		TotalOrders:    len(allOrders),
	}

	for _, p := range products {
		if p.Stock > 0 {
			overview.ActiveListings++
		}
	}

	for _, f := range farmers {
		if f.Status == "pending_onboard" {
			overview.PendingOnboard++
		}
	}

	for _, o := range allOrders {
		overview.TotalRevenue += o.Total
	}

	return jsonResponse(http.StatusOK, overview)
}

// ListAllUsers handles GET /api/admin/users
func ListAllUsers(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "admin")
	if !ok {
		return errorResponse(http.StatusForbidden, "Admin access required")
	}

	role := request.QueryStringParameters["role"]

	var users []models.User
	var err error

	if role != "" {
		users, err = db.ListUsersByRole(ctx, role)
	} else {
		users, err = db.ListAllUsers(ctx)
	}

	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return jsonResponse(http.StatusOK, users)
}

// GetUserProfile handles GET /api/admin/users/{id}
func GetUserProfile(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "admin")
	if !ok {
		return errorResponse(http.StatusForbidden, "Admin access required")
	}

	userID := extractPathParam(request.Path, "/api/admin/users/")

	user, err := db.GetUser(ctx, userID)
	if err != nil || user == nil {
		return errorResponse(http.StatusNotFound, "User not found")
	}

	// Build enriched profile
	result := UserWithStats{User: *user}

	if user.Role == "farmer" {
		products, _ := db.ListFarmerProducts(ctx, user.ID)
		result.ProductCount = len(products)
	}

	if user.Role == "consumer" {
		orders, _ := db.ListCustomerOrders(ctx, user.ID)
		result.OrderCount = len(orders)
		for _, o := range orders {
			result.TotalSales += o.Total
		}
	}

	return jsonResponse(http.StatusOK, result)
}

// ListFarmers handles GET /api/admin/farmers — returns farmers with stats
func ListFarmers(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "admin")
	if !ok {
		return errorResponse(http.StatusForbidden, "Admin access required")
	}

	farmers, err := db.ListUsersByRole(ctx, "farmer")
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	var enriched []UserWithStats
	for _, f := range farmers {
		u := UserWithStats{User: f}
		products, _ := db.ListFarmerProducts(ctx, f.ID)
		u.ProductCount = len(products)
		enriched = append(enriched, u)
	}

	return jsonResponse(http.StatusOK, enriched)
}

// ListConsumers handles GET /api/admin/consumers
func ListConsumers(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "admin")
	if !ok {
		return errorResponse(http.StatusForbidden, "Admin access required")
	}

	consumers, err := db.ListUsersByRole(ctx, "consumer")
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	var enriched []UserWithStats
	for _, c := range consumers {
		u := UserWithStats{User: c}
		orders, _ := db.ListCustomerOrders(ctx, c.ID)
		u.OrderCount = len(orders)
		enriched = append(enriched, u)
	}

	return jsonResponse(http.StatusOK, enriched)
}

// UpdateUserStatusHandler handles PUT /api/admin/users/{id}/status
func UpdateUserStatusHandler(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "admin")
	if !ok {
		return errorResponse(http.StatusForbidden, "Admin access required")
	}

	userID := extractPathParam(request.Path, "/api/admin/users/")

	var body struct {
		Status string `json:"status"`
		Notes  string `json:"notes"`
	}
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	valid := map[string]bool{"active": true, "suspended": true, "pending_onboard": true}
	if !valid[body.Status] {
		return errorResponse(http.StatusBadRequest, "Invalid status")
	}

	if err := db.UpdateUserStatus(ctx, userID, body.Status, body.Notes); err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return jsonResponse(http.StatusOK, map[string]string{"message": "User status updated"})
}

// UpdateUserNotesHandler handles PUT /api/admin/users/{id}/notes
func UpdateUserNotesHandler(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "admin")
	if !ok {
		return errorResponse(http.StatusForbidden, "Admin access required")
	}

	userID := extractPathParam(request.Path, "/api/admin/users/")

	var body struct {
		Notes string `json:"notes"`
	}
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	if err := db.UpdateUserNotes(ctx, userID, body.Notes); err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}

	return jsonResponse(http.StatusOK, map[string]string{"message": "Notes updated"})
}
