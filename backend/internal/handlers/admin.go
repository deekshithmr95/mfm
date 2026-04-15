package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/deekshithmr95/mfm/backend/internal/db"
	"github.com/deekshithmr95/mfm/backend/internal/middleware"
	"github.com/deekshithmr95/mfm/backend/internal/models"
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
func GetPlatformOverview(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "admin")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Admin access required")
		return
	}

	ctx := r.Context()
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

	jsonResponse(w, http.StatusOK, overview)
}

// ListAllUsers handles GET /api/admin/users
func ListAllUsers(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "admin")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Admin access required")
		return
	}

	role := r.URL.Query().Get("role")

	var users []models.User
	var err error

	if role != "" {
		users, err = db.ListUsersByRole(r.Context(), role)
	} else {
		users, err = db.ListAllUsers(r.Context())
	}

	if err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, users)
}

// GetUserProfile handles GET /api/admin/users/{id}
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "admin")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Admin access required")
		return
	}

	userID := extractPathParam(r.URL.Path, "/api/admin/users/")

	user, err := db.GetUser(r.Context(), userID)
	if err != nil || user == nil {
		errorResponse(w, http.StatusNotFound, "User not found")
		return
	}

	// Build enriched profile
	result := UserWithStats{User: *user}

	if user.Role == "farmer" {
		products, _ := db.ListFarmerProducts(r.Context(), user.ID)
		result.ProductCount = len(products)
	}

	if user.Role == "consumer" {
		orders, _ := db.ListCustomerOrders(r.Context(), user.ID)
		result.OrderCount = len(orders)
		for _, o := range orders {
			result.TotalSales += o.Total
		}
	}

	jsonResponse(w, http.StatusOK, result)
}

// ListFarmers handles GET /api/admin/farmers — returns farmers with stats
func ListFarmers(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "admin")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Admin access required")
		return
	}

	farmers, err := db.ListUsersByRole(r.Context(), "farmer")
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	var enriched []UserWithStats
	for _, f := range farmers {
		u := UserWithStats{User: f}
		products, _ := db.ListFarmerProducts(r.Context(), f.ID)
		u.ProductCount = len(products)
		enriched = append(enriched, u)
	}

	jsonResponse(w, http.StatusOK, enriched)
}

// ListConsumers handles GET /api/admin/consumers
func ListConsumers(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "admin")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Admin access required")
		return
	}

	consumers, err := db.ListUsersByRole(r.Context(), "consumer")
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	var enriched []UserWithStats
	for _, c := range consumers {
		u := UserWithStats{User: c}
		orders, _ := db.ListCustomerOrders(r.Context(), c.ID)
		u.OrderCount = len(orders)
		enriched = append(enriched, u)
	}

	jsonResponse(w, http.StatusOK, enriched)
}

// UpdateUserStatusHandler handles PUT /api/admin/users/{id}/status
func UpdateUserStatusHandler(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "admin")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Admin access required")
		return
	}

	userID := extractPathParam(r.URL.Path, "/api/admin/users/")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "Failed to read request body")
		return
	}
	defer r.Body.Close()

	var reqBody struct {
		Status string `json:"status"`
		Notes  string `json:"notes"`
	}
	if err := json.Unmarshal(body, &reqBody); err != nil {
		errorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	valid := map[string]bool{"active": true, "suspended": true, "pending_onboard": true}
	if !valid[reqBody.Status] {
		errorResponse(w, http.StatusBadRequest, "Invalid status")
		return
	}

	if err := db.UpdateUserStatus(r.Context(), userID, reqBody.Status, reqBody.Notes); err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "User status updated"})
}

// UpdateUserNotesHandler handles PUT /api/admin/users/{id}/notes
func UpdateUserNotesHandler(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "admin")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Admin access required")
		return
	}

	userID := extractPathParam(r.URL.Path, "/api/admin/users/")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "Failed to read request body")
		return
	}
	defer r.Body.Close()

	var reqBody struct {
		Notes string `json:"notes"`
	}
	if err := json.Unmarshal(body, &reqBody); err != nil {
		errorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := db.UpdateUserNotes(r.Context(), userID, reqBody.Notes); err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Notes updated"})
}
