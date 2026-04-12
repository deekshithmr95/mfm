# Seed data script for local DynamoDB
# Run AFTER: docker-compose up -d && make create-table
#
# Usage: powershell -File scripts/seed-data.ps1

$endpoint = "http://localhost:8000"
$table = "farmers-marketplace-dev"
$region = "us-east-1"

Write-Host "Seeding local DynamoDB with marketplace data..." -ForegroundColor Green

# ============================================================
# USERS
# ============================================================
Write-Host "`n--- Seeding Users ---" -ForegroundColor Cyan

$users = @(
    @{
        PK = @{S = "USER#farmer-001"}; SK = @{S = "USER#farmer-001"}; entityType = @{S = "User"}
        id = @{S = "farmer-001"}; name = @{S = "Mysore Apiaries"}; email = @{S = "apiaries@mfm.com"}
        phone = @{S = "+91 98765 00001"}; role = @{S = "farmer"}; farm = @{S = "Mysore Apiaries"}
        location = @{S = "H.D. Kote, Mysore"}; status = @{S = "active"}; createdAt = @{S = "2024-01-15T10:00:00Z"}
    },
    @{
        PK = @{S = "USER#farmer-002"}; SK = @{S = "USER#farmer-002"}; entityType = @{S = "User"}
        id = @{S = "farmer-002"}; name = @{S = "Green Valley Fields"}; email = @{S = "greenvalley@mfm.com"}
        phone = @{S = "+91 98765 00002"}; role = @{S = "farmer"}; farm = @{S = "Green Valley Fields"}
        location = @{S = "Mysore, Karnataka"}; status = @{S = "active"}; createdAt = @{S = "2024-02-20T10:00:00Z"}
    },
    @{
        PK = @{S = "USER#consumer-001"}; SK = @{S = "USER#consumer-001"}; entityType = @{S = "User"}
        id = @{S = "consumer-001"}; name = @{S = "Ananya Sharma"}; email = @{S = "ananya@example.com"}
        phone = @{S = "+91 98765 11111"}; role = @{S = "consumer"}; status = @{S = "active"}; createdAt = @{S = "2024-03-10T10:00:00Z"}
    },
    @{
        PK = @{S = "USER#admin-001"}; SK = @{S = "USER#admin-001"}; entityType = @{S = "User"}
        id = @{S = "admin-001"}; name = @{S = "Platform Admin"}; email = @{S = "admin@mysorefm.com"}
        phone = @{S = "+91 98765 99999"}; role = @{S = "admin"}; status = @{S = "active"}; createdAt = @{S = "2024-01-01T10:00:00Z"}
    }
)

foreach ($user in $users) {
    $json = $user | ConvertTo-Json -Compress -Depth 5
    aws dynamodb put-item --table-name $table --item $json --endpoint-url $endpoint --region $region 2>$null
    # Also write ROLE# denormalized row
    $roleRow = $user.Clone()
    $roleRow["PK"] = @{S = "ROLE#$($user.role.S)"}
    $roleJson = $roleRow | ConvertTo-Json -Compress -Depth 5
    aws dynamodb put-item --table-name $table --item $roleJson --endpoint-url $endpoint --region $region 2>$null
    Write-Host "  User: $($user.name.S)" -ForegroundColor White
}

# ============================================================
# PRODUCTS (enriched with farmer provenance, badges, ratings)
# ============================================================
Write-Host "`n--- Seeding Products ---" -ForegroundColor Cyan

$products = @(
    @{
        id = @{S = "prod-001"}; name = @{S = "Artisan Organic Honey"}; farmerName = @{S = "Mysore Apiaries"}; farmerId = @{S = "farmer-001"}
        image = @{S = "/honey-jar.png"}; originalPrice = @{N = "599"}; offerPrice = @{N = "449"}; discountPercent = @{N = "25"}
        stock = @{N = "12"}; category = @{S = "Pantry"}; unit = @{S = "500g jar"}
        description = @{S = "Raw, unfiltered wildflower honey harvested from our apiaries in the Mysore countryside. Rich in enzymes and natural antioxidants."}
        farmerLocation = @{S = "H.D. Kote, Mysore"}; farmerSince = @{S = "2018"}; farmingMethod = @{S = "Natural Beekeeping"}
        certifications = @{L = @(@{S = "Organic India"}, @{S = "FSSAI"})}
        harvestDate = @{S = "2026-03-28"}; shelfLife = @{S = "24 months"}
        badges = @{L = @(@{S = "bestseller"}, @{S = "featured"})}
        rating = @{N = "4.8"}; reviewCount = @{N = "127"}
        createdAt = @{S = "2024-06-01T10:00:00Z"}
    },
    @{
        id = @{S = "prod-002"}; name = @{S = "Heirloom Tomatoes"}; farmerName = @{S = "Green Valley Fields"}; farmerId = @{S = "farmer-002"}
        image = @{S = "/tomatoes-basket.png"}; originalPrice = @{N = "120"}; offerPrice = @{N = "89"}; discountPercent = @{N = "26"}
        stock = @{N = "45"}; category = @{S = "Vegetables"}; unit = @{S = "1 kg"}
        description = @{S = "Vine-ripened heirloom tomatoes grown without pesticides. Perfect for salads, sauces, and everyday cooking."}
        farmerLocation = @{S = "Mysore, Karnataka"}; farmerSince = @{S = "2015"}; farmingMethod = @{S = "Organic Polyculture"}
        certifications = @{L = @(@{S = "PGS-India Organic"})}
        harvestDate = @{S = "2026-04-03"}; shelfLife = @{S = "5-7 days"}
        badges = @{L = @(@{S = "just_harvested"}, @{S = "seasonal"})}
        rating = @{N = "4.6"}; reviewCount = @{N = "89"}
        createdAt = @{S = "2024-06-15T10:00:00Z"}
    },
    @{
        id = @{S = "prod-003"}; name = @{S = "Farm Fresh Eggs"}; farmerName = @{S = "Mysore Co-op"}; farmerId = @{S = "farmer-001"}
        image = @{S = "/eggs-carton.png"}; originalPrice = @{N = "180"}; offerPrice = @{N = "149"}; discountPercent = @{N = "17"}
        stock = @{N = "30"}; category = @{S = "Dairy & Eggs"}; unit = @{S = "12 pcs"}
        description = @{S = "Free-range eggs from pasture-raised hens. Rich golden yolks packed with omega-3 fatty acids."}
        farmerLocation = @{S = "Nanjangud, Karnataka"}; farmerSince = @{S = "2020"}; farmingMethod = @{S = "Free-Range Pasture"}
        certifications = @{L = @(@{S = "FSSAI"}, @{S = "Animal Welfare Certified"})}
        harvestDate = @{S = "2026-04-04"}; shelfLife = @{S = "14 days"}
        badges = @{L = @(@{S = "just_harvested"}, @{S = "bestseller"})}
        rating = @{N = "4.7"}; reviewCount = @{N = "203"}
        createdAt = @{S = "2024-07-01T10:00:00Z"}
    },
    @{
        id = @{S = "prod-004"}; name = @{S = "Organic Jaggery"}; farmerName = @{S = "Nanjangud Farms"}; farmerId = @{S = "farmer-002"}
        image = @{S = "/jaggery.png"}; originalPrice = @{N = "250"}; offerPrice = @{N = "199"}; discountPercent = @{N = "20"}
        stock = @{N = "8"}; category = @{S = "Pantry"}; unit = @{S = "500g block"}
        description = @{S = "Traditional sugarcane jaggery made using age-old methods. A healthier alternative to refined sugar."}
        farmerLocation = @{S = "T. Narasipura, Karnataka"}; farmerSince = @{S = "2012"}; farmingMethod = @{S = "Traditional Organic"}
        certifications = @{L = @(@{S = "NPOP Organic"}, @{S = "FSSAI"})}
        harvestDate = @{S = "2026-03-15"}; shelfLife = @{S = "12 months"}
        badges = @{L = @(@{S = "seasonal"})}
        rating = @{N = "4.5"}; reviewCount = @{N = "56"}
        createdAt = @{S = "2024-08-01T10:00:00Z"}
    },
    @{
        id = @{S = "prod-005"}; name = @{S = "Cold-Pressed Coconut Oil"}; farmerName = @{S = "Chamundi Agro"}; farmerId = @{S = "farmer-001"}
        image = @{S = "/coconut-oil.png"}; originalPrice = @{N = "450"}; offerPrice = @{N = "379"}; discountPercent = @{N = "16"}
        stock = @{N = "3"}; category = @{S = "Pantry"}; unit = @{S = "500ml bottle"}
        description = @{S = "Virgin coconut oil extracted using traditional wood-pressed methods. Ideal for cooking, skincare, and hair care."}
        farmerLocation = @{S = "Nanjangud, Karnataka"}; farmerSince = @{S = "2016"}; farmingMethod = @{S = "Wood-Pressed Traditional"}
        certifications = @{L = @(@{S = "Organic India"}, @{S = "FSSAI"})}
        harvestDate = @{S = "2026-03-20"}; shelfLife = @{S = "18 months"}
        badges = @{L = @(@{S = "featured"})}
        rating = @{N = "4.9"}; reviewCount = @{N = "178"}
        createdAt = @{S = "2024-09-01T10:00:00Z"}
    },
    @{
        id = @{S = "prod-006"}; name = @{S = "Organic Turmeric Powder"}; farmerName = @{S = "Spice Route Farms"}; farmerId = @{S = "farmer-002"}
        image = @{S = "/turmeric.png"}; originalPrice = @{N = "320"}; offerPrice = @{N = "249"}; discountPercent = @{N = "22"}
        stock = @{N = "18"}; category = @{S = "Spices"}; unit = @{S = "250g pouch"}
        description = @{S = "High-curcumin turmeric powder from organically grown roots. Vibrant color and strong aroma."}
        farmerLocation = @{S = "Mysore, Karnataka"}; farmerSince = @{S = "2014"}; farmingMethod = @{S = "Regenerative Organic"}
        certifications = @{L = @(@{S = "NPOP Organic"}, @{S = "Spices Board India"})}
        harvestDate = @{S = "2026-02-10"}; shelfLife = @{S = "24 months"}
        badges = @{L = @(@{S = "bestseller"}, @{S = "new"})}
        rating = @{N = "4.7"}; reviewCount = @{N = "142"}
        createdAt = @{S = "2024-10-01T10:00:00Z"}
    }
)

foreach ($product in $products) {
    $productId = $product.id.S
    $farmerId = $product.farmerId.S

    # Primary row: PRODUCT#<id>
    $primaryRow = $product.Clone()
    $primaryRow["PK"] = @{S = "PRODUCT#$productId"}
    $primaryRow["SK"] = @{S = "PRODUCT#$productId"}
    $primaryRow["entityType"] = @{S = "Product"}
    $primaryJson = $primaryRow | ConvertTo-Json -Compress -Depth 5
    aws dynamodb put-item --table-name $table --item $primaryJson --endpoint-url $endpoint --region $region 2>$null

    # Denormalized: FARMER#<farmerId> / PRODUCT#<id>
    $farmerRow = $product.Clone()
    $farmerRow["PK"] = @{S = "FARMER#$farmerId"}
    $farmerRow["SK"] = @{S = "PRODUCT#$productId"}
    $farmerRow["entityType"] = @{S = "Product"}
    $farmerJson = $farmerRow | ConvertTo-Json -Compress -Depth 5
    aws dynamodb put-item --table-name $table --item $farmerJson --endpoint-url $endpoint --region $region 2>$null

    Write-Host "  Product: $($product.name.S)" -ForegroundColor White
}

# ============================================================
# ABOUT US (default content)
# ============================================================
Write-Host "`n--- Seeding About Us ---" -ForegroundColor Cyan

$aboutUs = @{
    PK = @{S = "CONFIG#ABOUT"}; SK = @{S = "CONFIG#ABOUT"}; entityType = @{S = "Config"}
    heroTitle = @{S = "Bringing Mysore's Farms to Your Table"}
    heroSubtitle = @{S = "We connect local farmers directly with conscious consumers, eliminating middlemen and ensuring fair prices for everyone."}
    mission = @{S = "Our mission is to build a sustainable food ecosystem where farmers earn what they deserve and consumers get the freshest, chemical-free produce."}
    story = @{S = "Mysore Farmer Market was born in 2024 from a simple observation: the freshest produce in the region was traveling through 4-5 middlemen before reaching your kitchen. We built this platform to change that."}
    values = @{L = @(
        @{M = @{icon = @{S = "🌱"}; title = @{S = "Farm Fresh Promise"}; description = @{S = "Every product is harvested within 24 hours of delivery."}}}
        @{M = @{icon = @{S = "🤝"}; title = @{S = "Fair Trade"}; description = @{S = "Farmers receive 80% of what you pay."}}}
        @{M = @{icon = @{S = "🌍"}; title = @{S = "Sustainability First"}; description = @{S = "Biodegradable packaging and optimized delivery routes."}}}
        @{M = @{icon = @{S = "✅"}; title = @{S = "Quality Verified"}; description = @{S = "Every farmer is personally vetted."}}}
    )}
    teamMembers = @{L = @(
        @{M = @{name = @{S = "Rajesh Kumar"}; role = @{S = "Founder & CEO"}; bio = @{S = "Former agricultural engineer with 15 years of experience."}}}
        @{M = @{name = @{S = "Priya Nair"}; role = @{S = "Head of Operations"}; bio = @{S = "Supply chain expert ensuring peak freshness."}}}
        @{M = @{name = @{S = "Deepak Gowda"}; role = @{S = "Farmer Relations"}; bio = @{S = "Third-generation farmer bridging tech and tradition."}}}
    )}
}

$aboutJson = $aboutUs | ConvertTo-Json -Compress -Depth 10
aws dynamodb put-item --table-name $table --item $aboutJson --endpoint-url $endpoint --region $region 2>$null
Write-Host "  About Us content seeded" -ForegroundColor White

# ============================================================
Write-Host "`n✅ Seed data complete!" -ForegroundColor Green
Write-Host "  4 users, 6 products, 1 About Us config" -ForegroundColor Gray
