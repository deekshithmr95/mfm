# Quick Start: Backend API Integration

Get up and running with the real backend API in 5 minutes.

## Prerequisites

- Docker & Docker Compose (or Go 1.20+)
- Node.js 18+
- Git

## Step 1: Start the Backend (2 minutes)

```bash
# Option A: Using Docker
cd backend
docker-compose up

# Option B: Using local Go
cd backend
export FIRESTORE_EMULATOR_HOST=localhost:8080
go run cmd/api/main.go
```

**Expected Output:**
```
🚀 Farmers Marketplace API starting on port 8080
```

## Step 2: Seed the Database (1 minute)

Open a new terminal:

```bash
cd backend
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCP_PROJECT_ID=mysore-farmer-marketplace
go run scripts/seed-data.go
```

**Expected Output:**
```
🌱 Seeding Firestore with marketplace data...
--- Seeding Users ---
  ✅ User: Mysore Apiaries
  ✅ User: Green Valley Fields
  ...
✅ Seed data complete!
```

## Step 3: Configure Frontend (1 minute)

```bash
# Frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Mobile (if needed)
cd mobile-app
echo "REACT_APP_API_URL=http://localhost:8080" > .env.local
```

## Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Step 5: Verify Integration (1 minute)

Test in browser console:

```javascript
// Fetch products from real backend
fetch('http://localhost:8080/api/products')
  .then(r => r.json())
  .then(data => console.log('Products:', data))

// Should see 6 products from database!
```

## Common Commands

### Check Backend Status
```bash
curl http://localhost:8080/api/health
# Response: {"status": "ok", "service": "farmers-marketplace"}
```

### List All Products
```bash
curl http://localhost:8080/api/products | jq
```

### List Admin Users
```bash
curl http://localhost:8080/api/admin/users | jq
```

### Test with Farmer Headers
```bash
curl -H "X-User-Id: farmer-001" \
     -H "X-User-Role: farmer" \
     http://localhost:8080/api/farmer/listings
```

## Component Usage

### Display Products
```tsx
import { useFeaturedProducts } from '@mfm/shared';

export function Home() {
  const { data: products, isLoading, error } = useFeaturedProducts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  
  return (
    <div>
      {products?.map(p => (
        <div key={p.id}>{p.name} - ₹{p.offerPrice}</div>
      ))}
    </div>
  );
}
```

### Admin Dashboard
```tsx
import { useAdminStore } from '@mfm/shared';
import { useEffect } from 'react';

export function AdminUsers() {
  const { farmers, loading, error, fetchFarmers } = useAdminStore();
  
  useEffect(() => {
    fetchFarmers();
  }, []);
  
  if (loading) return <div>Loading farmers...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <table>
      <tbody>
        {farmers.map(farmer => (
          <tr key={farmer.id}>
            <td>{farmer.name}</td>
            <td>{farmer.farm}</td>
            <td>{farmer.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check port 8080 is free: `lsof -i :8080` |
| "Failed to create Firestore client" | Ensure `FIRESTORE_EMULATOR_HOST=localhost:8080` |
| No products showing | Run seed script: `go run scripts/seed-data.go` |
| API returns 404 | Check backend URL in .env.local |
| CORS error | Not expected - backend allows all origins |
| Products show as `undefined` | Clear browser cache (Ctrl+Shift+R) |

## Environment Variables Reference

### Frontend
```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8080

# Production
# NEXT_PUBLIC_API_URL=https://api.mysorefm.com
```

### Backend (docker-compose)
```env
PORT=8080
GCP_PROJECT_ID=mysore-farmer-marketplace
FIRESTORE_EMULATOR_HOST=localhost:8080  # Remove for production
```

## Documentation

- **Full Migration Guide**: See `MIGRATION_GUIDE.md`
- **Integration Checklist**: See `INTEGRATION_CHECKLIST.md`
- **Migration Summary**: See `MIGRATION_SUMMARY.md`

## What's Running

- **Backend API**: http://localhost:8080
- **Firestore Emulator**: localhost:8080
- **Frontend**: http://localhost:3000
- **Database**: Firestore (emulated locally)

## Test Data Included

After seeding, you have:

**Farmers**
- Mysore Apiaries (apiaries@mfm.com)
- Green Valley Fields (greenvalley@mfm.com)

**Products** (6 total)
- Honey (₹449)
- Tomatoes (₹89)
- Eggs (₹149)
- Jaggery (₹199)
- Coconut Oil (₹379)
- Turmeric (₹249)

**Users**
- 1 Admin (admin@mysorefm.com)
- 2 Farmers
- 1 Consumer

## Next: Deploy to Production

When ready to go live:

```bash
# Backup Firestore
firebase firestore:export ./backup

# Deploy backend to Cloud Run
gcloud run deploy farmers-marketplace \
  --source=backend \
  --region=us-central1

# Update frontend env
echo "NEXT_PUBLIC_API_URL=https://farmers-marketplace-xxx.run.app" > .env.local

# Deploy frontend
npm run build && npm run deploy
```

## Need Help?

1. Check backend logs: Look at terminal where `docker-compose up` runs
2. Check frontend logs: Browser DevTools → Console
3. Test API directly: `curl http://localhost:8080/api/products`
4. Read MIGRATION_GUIDE.md for detailed info

---

**You're all set!** 🚀 The backend API integration is complete and working.

All mocks have been removed. The frontend now gets real data from the backend database.
