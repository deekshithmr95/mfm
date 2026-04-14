package middleware

import (
	"net/http"
	"os"
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
// In mock mode, reads custom headers. In firebase mode, would parse Firebase ID token.
func ExtractUser(r *http.Request) *UserContext {
	mode := os.Getenv("AUTH_MODE")

	if mode == "firebase" {
		return extractFromFirebase(r)
	}

	return extractFromMockHeaders(r)
}

// extractFromMockHeaders reads custom X- headers for local development
func extractFromMockHeaders(r *http.Request) *UserContext {
	userID := r.Header.Get("X-User-Id")
	if userID == "" {
		return nil
	}

	role := r.Header.Get("X-User-Role")
	if role == "" {
		role = "consumer"
	}

	return &UserContext{
		UserID: userID,
		Name:   r.Header.Get("X-User-Name"),
		Email:  r.Header.Get("X-User-Email"),
		Role:   role,
		Farm:   r.Header.Get("X-User-Farm"),
	}
}

// extractFromFirebase parses the Firebase ID token from the Authorization header.
// Placeholder for when Firebase Auth is wired up.
func extractFromFirebase(r *http.Request) *UserContext {
	// TODO: Validate Firebase ID token using Firebase Admin SDK
	// For now, fall back to mock headers
	return extractFromMockHeaders(r)
}

// RequireAuth checks that a user is authenticated
func RequireAuth(r *http.Request) (*UserContext, bool) {
	user := ExtractUser(r)
	return user, user != nil
}

// RequireRole checks that a user has a specific role
func RequireRole(r *http.Request, role string) (*UserContext, bool) {
	user := ExtractUser(r)
	if user == nil || user.Role != role {
		return nil, false
	}
	return user, true
}
