package handlers

import (
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
)

// jsonResponse creates a JSON API response
func jsonResponse(status int, body interface{}) (events.APIGatewayProxyResponse, error) {
	b, err := json.Marshal(body)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error":"Internal server error"}`,
			Headers:    corsHeaders(),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Body:       string(b),
		Headers:    corsHeaders(),
	}, nil
}

// errorResponse creates an error JSON response
func errorResponse(status int, message string) (events.APIGatewayProxyResponse, error) {
	body := map[string]string{"error": message}
	return jsonResponse(status, body)
}

// corsHeaders returns standard CORS headers
func corsHeaders() map[string]string {
	return map[string]string{
		"Content-Type":                 "application/json",
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Id,X-User-Role,X-User-Name,X-User-Email,X-User-Farm",
	}
}
