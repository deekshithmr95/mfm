package handlers

import (
	"encoding/json"
	"net/http"
)

// jsonResponse writes a JSON response to the http.ResponseWriter
func jsonResponse(w http.ResponseWriter, status int, body interface{}) {
	b, err := json.Marshal(body)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		setCORSHeaders(w)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Internal server error"}`))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	setCORSHeaders(w)
	w.WriteHeader(status)
	w.Write(b)
}

// errorResponse writes an error JSON response
func errorResponse(w http.ResponseWriter, status int, message string) {
	body := map[string]string{"error": message}
	jsonResponse(w, status, body)
}

// setCORSHeaders sets standard CORS headers on the response
func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization,X-User-Id,X-User-Role,X-User-Name,X-User-Email,X-User-Farm")
}
