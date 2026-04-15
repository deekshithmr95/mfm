package handlers

import (
	"net/http"

	"github.com/deekshithmr95/mfm/backend/internal/db"
	"github.com/deekshithmr95/mfm/backend/internal/middleware"
)

// FarmerStats represents aggregated dashboard data
type FarmerStats struct {
	TotalProducts  int `json:"totalProducts"`
	ActiveListings int `json:"activeListings"`
}

// GetFarmerStats handles GET /api/farmer/stats
func GetFarmerStats(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.RequireRole(r, "farmer")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Only farmers can access this endpoint")
		return
	}

	products, err := db.ListFarmerProducts(r.Context(), user.UserID)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	stats := FarmerStats{
		TotalProducts: len(products),
	}

	for _, p := range products {
		if p.Stock > 0 {
			stats.ActiveListings++
		}
	}

	jsonResponse(w, http.StatusOK, stats)
}

// GetFarmerListings handles GET /api/farmer/listings
func GetFarmerListings(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.RequireRole(r, "farmer")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Only farmers can access this endpoint")
		return
	}

	products, err := db.ListFarmerProducts(r.Context(), user.UserID)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, products)
}

// GetFarmerOrders handles GET /api/farmer/orders
// Note: In the updated model, farmers view all orders (admin-like access to manage)
func GetFarmerOrders(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "farmer")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Only farmers can access this endpoint")
		return
	}

	// For now return all orders; in production, would filter by farmer's products
	orders, err := db.ListAllOrders(r.Context())
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, orders)
}
