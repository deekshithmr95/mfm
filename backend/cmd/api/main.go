package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"farmers-marketplace-backend/internal/db"
	"farmers-marketplace-backend/internal/handlers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func init() {
	db.Init()
}

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	method := request.HTTPMethod
	path := request.Path

	// Handle CORS preflight
	if method == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Id,X-User-Role,X-User-Name,X-User-Email,X-User-Farm",
			},
		}, nil
	}

	// ===== Routing =====

	switch {

	// Health
	case method == "GET" && path == "/api/health":
		return jsonOK(map[string]string{"status": "ok", "service": "farmers-marketplace"})

	// ---- About Us (public + admin) ----
	case method == "GET" && path == "/api/about":
		return handlers.GetAboutUs(ctx, request)

	case method == "PUT" && path == "/api/about":
		return handlers.UpdateAboutUs(ctx, request)

	// ---- Products ----
	// Search MUST come before the generic /api/products/{id} route
	case method == "GET" && path == "/api/products/search":
		return handlers.SearchProducts(ctx, request)

	case method == "GET" && path == "/api/products":
		return handlers.ListProducts(ctx, request)

	case method == "GET" && strings.HasPrefix(path, "/api/products/"):
		return handlers.GetProduct(ctx, request)

	case method == "POST" && path == "/api/products":
		return handlers.CreateProduct(ctx, request)

	case method == "PUT" && strings.HasPrefix(path, "/api/products/"):
		return handlers.UpdateProduct(ctx, request)

	case method == "DELETE" && strings.HasPrefix(path, "/api/products/"):
		return handlers.DeleteProduct(ctx, request)

	// ---- Orders ----
	case method == "POST" && path == "/api/orders":
		return handlers.CreateOrder(ctx, request)

	case method == "GET" && path == "/api/orders":
		return handlers.ListOrders(ctx, request)

	case method == "GET" && strings.HasPrefix(path, "/api/orders/"):
		return handlers.GetOrder(ctx, request)

	case method == "PUT" && strings.HasPrefix(path, "/api/orders/") && strings.HasSuffix(path, "/status"):
		return handlers.UpdateOrderStatus(ctx, request)

	// ---- Farmer Dashboard ----
	case method == "GET" && path == "/api/farmer/stats":
		return handlers.GetFarmerStats(ctx, request)

	case method == "GET" && path == "/api/farmer/listings":
		return handlers.GetFarmerListings(ctx, request)

	case method == "GET" && path == "/api/farmer/orders":
		return handlers.GetFarmerOrders(ctx, request)

	// ---- Admin ----
	case method == "GET" && path == "/api/admin/overview":
		return handlers.GetPlatformOverview(ctx, request)

	case method == "GET" && path == "/api/admin/users":
		return handlers.ListAllUsers(ctx, request)

	case method == "GET" && path == "/api/admin/farmers":
		return handlers.ListFarmers(ctx, request)

	case method == "GET" && path == "/api/admin/consumers":
		return handlers.ListConsumers(ctx, request)

	case method == "PUT" && strings.HasPrefix(path, "/api/admin/users/") && strings.HasSuffix(path, "/status"):
		return handlers.UpdateUserStatusHandler(ctx, request)

	case method == "PUT" && strings.HasPrefix(path, "/api/admin/users/") && strings.HasSuffix(path, "/notes"):
		return handlers.UpdateUserNotesHandler(ctx, request)

	case method == "GET" && strings.HasPrefix(path, "/api/admin/users/"):
		return handlers.GetUserProfile(ctx, request)

	// Not Found
	default:
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Body:       `{"error":"Endpoint not found"}`,
			Headers:    map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
		}, nil
	}
}

func jsonOK(body map[string]string) (events.APIGatewayProxyResponse, error) {
	b, _ := json.Marshal(body)
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(b),
		Headers:    map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
	}, nil
}

func main() {
	lambda.Start(Handler)
}
