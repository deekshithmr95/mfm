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

// CreateOrder handles POST /api/orders
func CreateOrder(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	user, ok := middleware.RequireAuth(request)
	if !ok {
		return errorResponse(http.StatusUnauthorized, "Authentication required")
	}

	var input models.CreateOrderInput
	if err := json.Unmarshal([]byte(request.Body), &input); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	if len(input.Items) == 0 {
		return errorResponse(http.StatusBadRequest, "Order must have at least one item")
	}

	if input.Address.FullName == "" || input.Address.Pincode == "" {
		return errorResponse(http.StatusBadRequest, "Delivery address is required")
	}

	if input.PaymentMethod == "" {
		input.PaymentMethod = "cod"
	}

	order := models.NewOrder(input, user.UserID, user.Name)
	created, err := db.PutOrder(ctx, order)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to create order: "+err.Error())
	}

	return jsonResponse(http.StatusCreated, created)
}

// GetOrder handles GET /api/orders/{id}
func GetOrder(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireAuth(request)
	if !ok {
		return errorResponse(http.StatusUnauthorized, "Authentication required")
	}

	id := extractPathParam(request.Path, "/api/orders/")

	order, err := db.GetOrder(ctx, id)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error())
	}
	if order == nil {
		return errorResponse(http.StatusNotFound, "Order not found")
	}

	return jsonResponse(http.StatusOK, order)
}

// ListOrders handles GET /api/orders
func ListOrders(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	user, ok := middleware.RequireAuth(request)
	if !ok {
		return errorResponse(http.StatusUnauthorized, "Authentication required")
	}

	// Consumers get their own orders
	orders, err := db.ListCustomerOrders(ctx, user.UserID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to list orders: "+err.Error())
	}

	return jsonResponse(http.StatusOK, orders)
}

// UpdateOrderStatus handles PUT /api/orders/{id}/status
func UpdateOrderStatus(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	user, ok := middleware.RequireAuth(request)
	if !ok {
		return errorResponse(http.StatusUnauthorized, "Authentication required")
	}

	// Only farmers and admins can update order status
	if user.Role != "farmer" && user.Role != "admin" {
		return errorResponse(http.StatusForbidden, "Only farmers and admins can update order status")
	}

	id := extractPathParam(request.Path, "/api/orders/")

	var body struct {
		Status string `json:"status"`
	}
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	if !models.ValidOrderStatuses[body.Status] {
		return errorResponse(http.StatusBadRequest, "Invalid status. Must be: confirmed, processing, shipped, out_for_delivery, or delivered")
	}

	if err := db.UpdateOrderStatus(ctx, id, body.Status); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to update order: "+err.Error())
	}

	return jsonResponse(http.StatusOK, map[string]string{"message": "Order status updated", "status": body.Status})
}
