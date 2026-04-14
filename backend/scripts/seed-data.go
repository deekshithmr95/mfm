// Seed data script for Cloud Firestore
// Run AFTER: firebase emulators:start --only firestore (or docker-compose up)
//
// Usage:
//   set FIRESTORE_EMULATOR_HOST=localhost:8080
//   set GCP_PROJECT_ID=mysore-farmer-marketplace
//   go run scripts/seed-data.go

package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"cloud.google.com/go/firestore"
)

func main() {
	projectID := os.Getenv("GCP_PROJECT_ID")
	if projectID == "" {
		projectID = "mysore-farmer-marketplace"
	}

	ctx := context.Background()
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}
	defer client.Close()

	fmt.Println("🌱 Seeding Firestore with marketplace data...")

	// ============================================================
	// USERS
	// ============================================================
	fmt.Println("\n--- Seeding Users ---")

	users := []map[string]interface{}{
		{
			"id": "farmer-001", "name": "Mysore Apiaries", "email": "apiaries@mfm.com",
			"phone": "+91 98765 00001", "role": "farmer", "farm": "Mysore Apiaries",
			"location": "H.D. Kote, Mysore", "status": "active", "createdAt": "2024-01-15T10:00:00Z",
		},
		{
			"id": "farmer-002", "name": "Green Valley Fields", "email": "greenvalley@mfm.com",
			"phone": "+91 98765 00002", "role": "farmer", "farm": "Green Valley Fields",
			"location": "Mysore, Karnataka", "status": "active", "createdAt": "2024-02-20T10:00:00Z",
		},
		{
			"id": "consumer-001", "name": "Ananya Sharma", "email": "ananya@example.com",
			"phone": "+91 98765 11111", "role": "consumer", "status": "active", "createdAt": "2024-03-10T10:00:00Z",
		},
		{
			"id": "admin-001", "name": "Platform Admin", "email": "admin@mysorefm.com",
			"phone": "+91 98765 99999", "role": "admin", "status": "active", "createdAt": "2024-01-01T10:00:00Z",
		},
	}

	for _, user := range users {
		id := user["id"].(string)
		_, err := client.Collection("users").Doc(id).Set(ctx, user)
		if err != nil {
			log.Printf("  ❌ Failed to seed user %s: %v", id, err)
			continue
		}
		fmt.Printf("  ✅ User: %s\n", user["name"])
	}

	// ============================================================
	// PRODUCTS
	// ============================================================
	fmt.Println("\n--- Seeding Products ---")

	products := []map[string]interface{}{
		{
			"id": "prod-001", "name": "Artisan Organic Honey", "farmerName": "Mysore Apiaries", "farmerId": "farmer-001",
			"image": "/honey-jar.png", "originalPrice": 599.0, "offerPrice": 449.0, "discountPercent": 25,
			"stock": 12, "category": "Pantry", "unit": "500g jar",
			"description":     "Raw, unfiltered wildflower honey harvested from our apiaries in the Mysore countryside. Rich in enzymes and natural antioxidants.",
			"farmerLocation":  "H.D. Kote, Mysore", "farmerSince": "2018", "farmingMethod": "Natural Beekeeping",
			"certifications":  []string{"Organic India", "FSSAI"},
			"harvestDate":     "2026-03-28", "shelfLife": "24 months",
			"badges":          []string{"bestseller", "featured"},
			"rating": 4.8, "reviewCount": 127,
			"createdAt": "2024-06-01T10:00:00Z",
		},
		{
			"id": "prod-002", "name": "Heirloom Tomatoes", "farmerName": "Green Valley Fields", "farmerId": "farmer-002",
			"image": "/tomatoes-basket.png", "originalPrice": 120.0, "offerPrice": 89.0, "discountPercent": 26,
			"stock": 45, "category": "Vegetables", "unit": "1 kg",
			"description":     "Vine-ripened heirloom tomatoes grown without pesticides. Perfect for salads, sauces, and everyday cooking.",
			"farmerLocation":  "Mysore, Karnataka", "farmerSince": "2015", "farmingMethod": "Organic Polyculture",
			"certifications":  []string{"PGS-India Organic"},
			"harvestDate":     "2026-04-03", "shelfLife": "5-7 days",
			"badges":          []string{"just_harvested", "seasonal"},
			"rating": 4.6, "reviewCount": 89,
			"createdAt": "2024-06-15T10:00:00Z",
		},
		{
			"id": "prod-003", "name": "Farm Fresh Eggs", "farmerName": "Mysore Co-op", "farmerId": "farmer-001",
			"image": "/eggs-carton.png", "originalPrice": 180.0, "offerPrice": 149.0, "discountPercent": 17,
			"stock": 30, "category": "Dairy & Eggs", "unit": "12 pcs",
			"description":     "Free-range eggs from pasture-raised hens. Rich golden yolks packed with omega-3 fatty acids.",
			"farmerLocation":  "Nanjangud, Karnataka", "farmerSince": "2020", "farmingMethod": "Free-Range Pasture",
			"certifications":  []string{"FSSAI", "Animal Welfare Certified"},
			"harvestDate":     "2026-04-04", "shelfLife": "14 days",
			"badges":          []string{"just_harvested", "bestseller"},
			"rating": 4.7, "reviewCount": 203,
			"createdAt": "2024-07-01T10:00:00Z",
		},
		{
			"id": "prod-004", "name": "Organic Jaggery", "farmerName": "Nanjangud Farms", "farmerId": "farmer-002",
			"image": "/jaggery.png", "originalPrice": 250.0, "offerPrice": 199.0, "discountPercent": 20,
			"stock": 8, "category": "Pantry", "unit": "500g block",
			"description":     "Traditional sugarcane jaggery made using age-old methods. A healthier alternative to refined sugar.",
			"farmerLocation":  "T. Narasipura, Karnataka", "farmerSince": "2012", "farmingMethod": "Traditional Organic",
			"certifications":  []string{"NPOP Organic", "FSSAI"},
			"harvestDate":     "2026-03-15", "shelfLife": "12 months",
			"badges":          []string{"seasonal"},
			"rating": 4.5, "reviewCount": 56,
			"createdAt": "2024-08-01T10:00:00Z",
		},
		{
			"id": "prod-005", "name": "Cold-Pressed Coconut Oil", "farmerName": "Chamundi Agro", "farmerId": "farmer-001",
			"image": "/coconut-oil.png", "originalPrice": 450.0, "offerPrice": 379.0, "discountPercent": 16,
			"stock": 3, "category": "Pantry", "unit": "500ml bottle",
			"description":     "Virgin coconut oil extracted using traditional wood-pressed methods. Ideal for cooking, skincare, and hair care.",
			"farmerLocation":  "Nanjangud, Karnataka", "farmerSince": "2016", "farmingMethod": "Wood-Pressed Traditional",
			"certifications":  []string{"Organic India", "FSSAI"},
			"harvestDate":     "2026-03-20", "shelfLife": "18 months",
			"badges":          []string{"featured"},
			"rating": 4.9, "reviewCount": 178,
			"createdAt": "2024-09-01T10:00:00Z",
		},
		{
			"id": "prod-006", "name": "Organic Turmeric Powder", "farmerName": "Spice Route Farms", "farmerId": "farmer-002",
			"image": "/turmeric.png", "originalPrice": 320.0, "offerPrice": 249.0, "discountPercent": 22,
			"stock": 18, "category": "Spices", "unit": "250g pouch",
			"description":     "High-curcumin turmeric powder from organically grown roots. Vibrant color and strong aroma.",
			"farmerLocation":  "Mysore, Karnataka", "farmerSince": "2014", "farmingMethod": "Regenerative Organic",
			"certifications":  []string{"NPOP Organic", "Spices Board India"},
			"harvestDate":     "2026-02-10", "shelfLife": "24 months",
			"badges":          []string{"bestseller", "new"},
			"rating": 4.7, "reviewCount": 142,
			"createdAt": "2024-10-01T10:00:00Z",
		},
	}

	for _, product := range products {
		id := product["id"].(string)
		_, err := client.Collection("products").Doc(id).Set(ctx, product)
		if err != nil {
			log.Printf("  ❌ Failed to seed product %s: %v", id, err)
			continue
		}
		fmt.Printf("  ✅ Product: %s\n", product["name"])
	}

	// ============================================================
	// ABOUT US (default content)
	// ============================================================
	fmt.Println("\n--- Seeding About Us ---")

	aboutUs := map[string]interface{}{
		"heroTitle":    "Bringing Mysore's Farms to Your Table",
		"heroSubtitle": "We connect local farmers directly with conscious consumers, eliminating middlemen and ensuring fair prices for everyone.",
		"mission":      "Our mission is to build a sustainable food ecosystem where farmers earn what they deserve and consumers get the freshest, chemical-free produce.",
		"story":        "Mysore Farmer Market was born in 2024 from a simple observation: the freshest produce in the region was traveling through 4-5 middlemen before reaching your kitchen. We built this platform to change that.",
		"values": []map[string]interface{}{
			{"icon": "🌱", "title": "Farm Fresh Promise", "description": "Every product is harvested within 24 hours of delivery."},
			{"icon": "🤝", "title": "Fair Trade", "description": "Farmers receive 80% of what you pay."},
			{"icon": "🌍", "title": "Sustainability First", "description": "Biodegradable packaging and optimized delivery routes."},
			{"icon": "✅", "title": "Quality Verified", "description": "Every farmer is personally vetted."},
		},
		"teamMembers": []map[string]interface{}{
			{"name": "Rajesh Kumar", "role": "Founder & CEO", "bio": "Former agricultural engineer with 15 years of experience."},
			{"name": "Priya Nair", "role": "Head of Operations", "bio": "Supply chain expert ensuring peak freshness."},
			{"name": "Deepak Gowda", "role": "Farmer Relations", "bio": "Third-generation farmer bridging tech and tradition."},
		},
	}

	_, err = client.Collection("config").Doc("about").Set(ctx, aboutUs)
	if err != nil {
		log.Printf("  ❌ Failed to seed About Us: %v", err)
	} else {
		fmt.Println("  ✅ About Us content seeded")
	}

	// ============================================================
	fmt.Println("\n✅ Seed data complete!")
	fmt.Println("  4 users, 6 products, 1 About Us config")
}
