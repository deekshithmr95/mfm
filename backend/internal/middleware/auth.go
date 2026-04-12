package middleware

import (
	"os"

	"github.com/aws/aws-lambda-go/events"
)

// UserContext holds the authenticated user's info extracted from headers or JWT
type UserContext struct {
	UserID string
	Name   string
	Email  string
	Role   string // "farmer" or "consumer"
	Farm   string
}

// ExtractUser extracts the user context from the request.
// In mock mode, reads custom headers. In cognito mode, would parse JWT claims.
func ExtractUser(request events.APIGatewayProxyRequest) *UserContext {
	mode := os.Getenv("AUTH_MODE")

	if mode == "cognito" {
		return extractFromCognito(request)
	}

	return extractFromMockHeaders(request)
}

// extractFromMockHeaders reads custom X- headers for local development
func extractFromMockHeaders(request events.APIGatewayProxyRequest) *UserContext {
	userID := request.Headers["x-user-id"]
	if userID == "" {
		return nil
	}

	role := request.Headers["x-user-role"]
	if role == "" {
		role = "consumer"
	}

	return &UserContext{
		UserID: userID,
		Name:   request.Headers["x-user-name"],
		Email:  request.Headers["x-user-email"],
		Role:   role,
		Farm:   request.Headers["x-user-farm"],
	}
}

// extractFromCognito parses the JWT from the Authorization header.
// Placeholder for when Cognito is wired up.
func extractFromCognito(request events.APIGatewayProxyRequest) *UserContext {
	// TODO: Validate JWT using Cognito JWKS endpoint
	// For now, fall back to mock headers
	return extractFromMockHeaders(request)
}

// RequireAuth checks that a user is authenticated
func RequireAuth(request events.APIGatewayProxyRequest) (*UserContext, bool) {
	user := ExtractUser(request)
	return user, user != nil
}

// RequireRole checks that a user has a specific role
func RequireRole(request events.APIGatewayProxyRequest, role string) (*UserContext, bool) {
	user := ExtractUser(request)
	if user == nil || user.Role != role {
		return nil, false
	}
	return user, true
}
