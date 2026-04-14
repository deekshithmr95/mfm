package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"farmers-marketplace-backend/internal/db"
	"farmers-marketplace-backend/internal/middleware"
	"farmers-marketplace-backend/internal/models"
)

// CreateOrder handles POST /api/orders
func CreateOrder(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.RequireAuth(r)
	if !ok {
		errorResponse(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "Failed to read request body")
		return
	}
	defer r.Body.Close()

	var input models.CreateOrderInput
	if err := json.Unmarshal(body, &input); err != nil {
		errorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if len(input.Items) == 0 {
		errorResponse(w, http.StatusBadRequest, "Order must have at least one item")
		return
	}

	if input.Address.FullName == "" || input.Address.Pincode == "" {
		errorResponse(w, http.StatusBadRequest, "Delivery address is required")
		return
	}

	if input.PaymentMethod == "" {
		input.PaymentMethod = "cod"
	}

	order := models.NewOrder(input, user.UserID, user.Name)
	created, err := db.PutOrder(r.Context(), order)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Failed to create order: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusCreated, created)
}

// GetOrder handles GET /api/orders/{id}
func GetOrder(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireAuth(r)
	if !ok {
		errorResponse(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	id := extractPathParam(r.URL.Path, "/api/orders/")

	order, err := db.GetOrder(r.Context(), id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	if order == nil {
		errorResponse(w, http.StatusNotFound, "Order not found")
		return
	}

	jsonResponse(w, http.StatusOK, order)
}

// ListOrders handles GET /api/orders
func ListOrders(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.RequireAuth(r)
	if !ok {
		errorResponse(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	// Consumers get their own orders
	orders, err := db.ListCustomerOrders(r.Context(), user.UserID)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Failed to list orders: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, orders)
}

// UpdateOrderStatus handles PUT /api/orders/{id}/status
func UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.RequireAuth(r)
	if !ok {
		errorResponse(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	// Only farmers and admins can update order status
	if user.Role != "farmer" && user.Role != "admin" {
		errorResponse(w, http.StatusForbidden, "Only farmers and admins can update order status")
		return
	}

	id := extractPathParam(r.URL.Path, "/api/orders/")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "Failed to read request body")
		return
	}
	defer r.Body.Close()

	var reqBody struct {
		Status string `json:"status"`
	}
	if err := json.Unmarshal(body, &reqBody); err != nil {
		errorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if !models.ValidOrderStatuses[reqBody.Status] {
		errorResponse(w, http.StatusBadRequest, "Invalid status. Must be: confirmed, processing, shipped, out_for_delivery, or delivered")
		return
	}

	if err := db.UpdateOrderStatus(r.Context(), id, reqBody.Status); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Failed to update order: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Order status updated", "status": reqBody.Status})
}
