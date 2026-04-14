package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"farmers-marketplace-backend/internal/db"
	"farmers-marketplace-backend/internal/handlers"
)

func init() {
	db.Init()
}

// APIHandler is the single HTTP handler exported for Google Cloud Functions.
// It also serves as the handler for local development via http.ListenAndServe.
func APIHandler(w http.ResponseWriter, r *http.Request) {
	method := r.Method
	path := r.URL.Path

	// Handle CORS preflight
	if method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization,X-User-Id,X-User-Role,X-User-Name,X-User-Email,X-User-Farm")
		w.WriteHeader(http.StatusOK)
		return
	}

	// ===== Routing =====

	switch {

	// Health
	case method == "GET" && path == "/api/health":
		jsonOK(w, map[string]string{"status": "ok", "service": "farmers-marketplace"})

	// ---- About Us (public + admin) ----
	case method == "GET" && path == "/api/about":
		handlers.GetAboutUs(w, r)

	case method == "PUT" && path == "/api/about":
		handlers.UpdateAboutUs(w, r)

	// ---- Products ----
	// Search MUST come before the generic /api/products/{id} route
	case method == "GET" && path == "/api/products/search":
		handlers.SearchProducts(w, r)

	case method == "GET" && path == "/api/products":
		handlers.ListProducts(w, r)

	case method == "GET" && strings.HasPrefix(path, "/api/products/"):
		handlers.GetProduct(w, r)

	case method == "POST" && path == "/api/products":
		handlers.CreateProduct(w, r)

	case method == "PUT" && strings.HasPrefix(path, "/api/products/"):
		handlers.UpdateProduct(w, r)

	case method == "DELETE" && strings.HasPrefix(path, "/api/products/"):
		handlers.DeleteProduct(w, r)

	// ---- Orders ----
	case method == "POST" && path == "/api/orders":
		handlers.CreateOrder(w, r)

	case method == "GET" && path == "/api/orders":
		handlers.ListOrders(w, r)

	case method == "GET" && strings.HasPrefix(path, "/api/orders/"):
		handlers.GetOrder(w, r)

	case method == "PUT" && strings.HasPrefix(path, "/api/orders/") && strings.HasSuffix(path, "/status"):
		handlers.UpdateOrderStatus(w, r)

	// ---- Farmer Dashboard ----
	case method == "GET" && path == "/api/farmer/stats":
		handlers.GetFarmerStats(w, r)

	case method == "GET" && path == "/api/farmer/listings":
		handlers.GetFarmerListings(w, r)

	case method == "GET" && path == "/api/farmer/orders":
		handlers.GetFarmerOrders(w, r)

	// ---- Admin ----
	case method == "GET" && path == "/api/admin/overview":
		handlers.GetPlatformOverview(w, r)

	case method == "GET" && path == "/api/admin/users":
		handlers.ListAllUsers(w, r)

	case method == "GET" && path == "/api/admin/farmers":
		handlers.ListFarmers(w, r)

	case method == "GET" && path == "/api/admin/consumers":
		handlers.ListConsumers(w, r)

	case method == "PUT" && strings.HasPrefix(path, "/api/admin/users/") && strings.HasSuffix(path, "/status"):
		handlers.UpdateUserStatusHandler(w, r)

	case method == "PUT" && strings.HasPrefix(path, "/api/admin/users/") && strings.HasSuffix(path, "/notes"):
		handlers.UpdateUserNotesHandler(w, r)

	case method == "GET" && strings.HasPrefix(path, "/api/admin/users/"):
		handlers.GetUserProfile(w, r)

	// Not Found
	default:
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error":"Endpoint not found"}`))
	}
}

func jsonOK(w http.ResponseWriter, body map[string]string) {
	b, _ := json.Marshal(body)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}

func main() {
	// For local development: run as a standalone HTTP server
	// For Cloud Functions: the function is registered via the FUNCTION_TARGET env var
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", APIHandler)

	fmt.Printf("🚀 Farmers Marketplace API starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
