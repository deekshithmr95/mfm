package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"farmers-marketplace-backend/internal/db"
	"farmers-marketplace-backend/internal/middleware"
	"farmers-marketplace-backend/internal/models"
)

// ListProducts handles GET /api/products
func ListProducts(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")

	products, err := db.ListProducts(r.Context(), category)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Failed to list products: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, products)
}

// SearchProducts handles GET /api/products/search?q=...&sort=...&category=...
func SearchProducts(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	sortBy := r.URL.Query().Get("sort")
	category := r.URL.Query().Get("category")

	products, err := db.SearchProducts(r.Context(), query, category, sortBy)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Search failed: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, products)
}

// GetProduct handles GET /api/products/{id}
func GetProduct(w http.ResponseWriter, r *http.Request) {
	id := extractPathParam(r.URL.Path, "/api/products/")

	product, err := db.GetProduct(r.Context(), id)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	if product == nil {
		errorResponse(w, http.StatusNotFound, "Product not found")
		return
	}

	jsonResponse(w, http.StatusOK, product)
}

// CreateProduct handles POST /api/products
func CreateProduct(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.RequireRole(r, "farmer")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Only farmers can create products")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "Failed to read request body")
		return
	}
	defer r.Body.Close()

	var input models.CreateProductInput
	if err := json.Unmarshal(body, &input); err != nil {
		errorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if input.Name == "" {
		errorResponse(w, http.StatusBadRequest, "Product name is required")
		return
	}

	product := models.NewProduct(input, user.UserID, user.Farm)

	created, err := db.PutProduct(r.Context(), product)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Failed to create product: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusCreated, created)
}

// UpdateProduct handles PUT /api/products/{id}
func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.RequireRole(r, "farmer")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Only farmers can update products")
		return
	}

	id := extractPathParam(r.URL.Path, "/api/products/")

	// Verify ownership
	product, err := db.GetProduct(r.Context(), id)
	if err != nil || product == nil {
		errorResponse(w, http.StatusNotFound, "Product not found")
		return
	}
	if product.FarmerID != user.UserID {
		errorResponse(w, http.StatusForbidden, "You can only update your own products")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "Failed to read request body")
		return
	}
	defer r.Body.Close()

	var input models.UpdateProductInput
	if err := json.Unmarshal(body, &input); err != nil {
		errorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	updated, err := db.UpdateProduct(r.Context(), id, input)
	if err != nil {
		errorResponse(w, http.StatusInternalServerError, "Failed to update product: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, updated)
}

// DeleteProduct handles DELETE /api/products/{id}
func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.RequireRole(r, "farmer")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Only farmers can delete products")
		return
	}

	id := extractPathParam(r.URL.Path, "/api/products/")

	// Verify ownership
	product, err := db.GetProduct(r.Context(), id)
	if err != nil || product == nil {
		errorResponse(w, http.StatusNotFound, "Product not found")
		return
	}
	if product.FarmerID != user.UserID {
		errorResponse(w, http.StatusForbidden, "You can only delete your own products")
		return
	}

	if err := db.DeleteProduct(r.Context(), id, user.UserID); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Failed to delete product: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Product deleted"})
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
