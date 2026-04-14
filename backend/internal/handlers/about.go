package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"farmers-marketplace-backend/internal/db"
	"farmers-marketplace-backend/internal/middleware"
	"farmers-marketplace-backend/internal/models"
)

// GetAboutUs handles GET /api/about (public — no auth required)
func GetAboutUs(w http.ResponseWriter, r *http.Request) {
	content, err := db.GetAboutUs(r.Context())
	if err != nil {
		// Return default content even on error
		jsonResponse(w, http.StatusOK, models.DefaultAboutUsContent())
		return
	}

	jsonResponse(w, http.StatusOK, content)
}

// UpdateAboutUs handles PUT /api/about (admin only)
func UpdateAboutUs(w http.ResponseWriter, r *http.Request) {
	_, ok := middleware.RequireRole(r, "admin")
	if !ok {
		errorResponse(w, http.StatusForbidden, "Admin access required")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		errorResponse(w, http.StatusBadRequest, "Failed to read request body")
		return
	}
	defer r.Body.Close()

	var content models.AboutUsContent
	if err := json.Unmarshal(body, &content); err != nil {
		errorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if content.HeroTitle == "" {
		errorResponse(w, http.StatusBadRequest, "Hero title is required")
		return
	}

	if err := db.PutAboutUs(r.Context(), content); err != nil {
		errorResponse(w, http.StatusInternalServerError, "Failed to update About Us: "+err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "About Us content updated"})
}
