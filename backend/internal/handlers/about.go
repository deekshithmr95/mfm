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

// GetAboutUs handles GET /api/about (public — no auth required)
func GetAboutUs(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	content, err := db.GetAboutUs(ctx)
	if err != nil {
		// Return default content even on error
		return jsonResponse(http.StatusOK, models.DefaultAboutUsContent())
	}

	return jsonResponse(http.StatusOK, content)
}

// UpdateAboutUs handles PUT /api/about (admin only)
func UpdateAboutUs(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	_, ok := middleware.RequireRole(request, "admin")
	if !ok {
		return errorResponse(http.StatusForbidden, "Admin access required")
	}

	var content models.AboutUsContent
	if err := json.Unmarshal([]byte(request.Body), &content); err != nil {
		return errorResponse(http.StatusBadRequest, "Invalid request body")
	}

	if content.HeroTitle == "" {
		return errorResponse(http.StatusBadRequest, "Hero title is required")
	}

	if err := db.PutAboutUs(ctx, content); err != nil {
		return errorResponse(http.StatusInternalServerError, "Failed to update About Us: "+err.Error())
	}

	return jsonResponse(http.StatusOK, map[string]string{"message": "About Us content updated"})
}
