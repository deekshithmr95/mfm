# API Mocks to Backend Migration Guide

## Overview

All mock API responses have been moved from the frontend to the backend. The frontend now makes real HTTP requests to the Go backend, which serves data from Firestore.

## What Changed

### 1. **API Client** (New)
- Created `packages/shared/src/api/client.ts` - Real HTTP client for backend communication
- Features:
  - Automatic user context headers for authenticated requests
  - Error handling and logging
  - Environment-based API URL configuration

### 2. **Services** (Updated)
- `packages/shared/src/services/api.ts`
  - **Before**: Returned mocked products with simulated delays
  - **After**: Makes real HTTP requests to backend endpoints
  - New function: `searchProducts()` for filtering and sorting

### 3. **Stores** (Updated)
All stores now fetch data from the backend instead of using hardcoded mocks:

#### **useAdminStore**
- `fetchFarmers()` - GET `/api/admin/farmers`
- `fetchConsumers()` - GET `/api/admin/users`
- `fetchAllUsers()` - GET `/api/admin/users`
- `updateUserStatus()` - PUT `/api/admin/users/:id`
- `updateUserNotes()` - PUT `/api/admin/users/:id`

#### **useFarmerStore**
- `fetchListings()` - GET `/api/farmer/listings`
- `fetchOrders()` - GET `/api/farmer/orders`
- `addListing()` - POST `/api/products`
- `updateListing()` - PUT `/api/products/:id`
- `deleteListing()` - DELETE `/api/products/:id`
- `updateOrderStatus()` - PUT `/api/orders/:id/status`

#### **useAboutUsStore**
- `fetchContent()` - GET `/api/about`
- `updateContent()` - PUT `/api/about`

#### **useAuthStore**
- Still uses mock authentication locally
- Passes user context headers to API client for authenticated requests

### 4. **Hooks** (Updated)
- `useProduct()` - Now accepts string IDs (matching backend UUIDs)
- All hooks fetch from real API endpoints

## Backend Endpoints

All endpoints are implemented in Go and return data from Firestore:

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?q=...&sort=...&category=...` - Search products
- `POST /api/products` - Create product (farmers only)
- `PUT /api/products/:id` - Update product (farmers only)
- `DELETE /api/products/:id` - Delete product (farmers only)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

### Admin
- `GET /api/admin/overview` - Platform overview
- `GET /api/admin/users` - List all users
- `GET /api/admin/farmers` - List farmers
- `GET /api/admin/consumers` - List consumers
- `GET /api/admin/users/:id` - Get user profile
- `PUT /api/admin/users/:id` - Update user (status/notes)

### Farmer Dashboard
- `GET /api/farmer/stats` - Farmer stats
- `GET /api/farmer/listings` - Farmers products
- `GET /api/farmer/orders` - Farmers' orders

### About Us
- `GET /api/about` - Get about page content
- `PUT /api/about` - Update about page content (admin only)

## Configuration

### Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Mobile App (.env.local)**
```
REACT_APP_API_URL=http://localhost:8080
```

**Backend** (already set in docker-compose and deployment)
```
PORT=8080
GCP_PROJECT_ID=mysore-farmer-marketplace
```

## Authentication Flow

1. **Local Development**: Uses mock authentication with X- headers
2. **Headers sent with each request**:
   - `X-User-Id`: User ID
   - `X-User-Name`: User name
   - `X-User-Email`: User email
   - `X-User-Role`: User role (farmer/consumer/admin)
   - `X-User-Farm`: Farm name (if farmer)

## Usage Examples

### Frontend Component

```typescript
import { useFeaturedProducts, useAllProducts } from '@mfm/shared';

export function ProductShowcase() {
  const { data: featured, isLoading, error } = useFeaturedProducts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {featured?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Admin Store

```typescript
import { useAdminStore } from '@mfm/shared';

export function AdminDashboard() {
  const { farmers, loading, error, fetchFarmers } = useAdminStore();
  
  useEffect(() => {
    fetchFarmers();
  }, []);
  
  return (
    <div>
      {loading && <div>Loading farmers...</div>}
      {error && <div>Error: {error}</div>}
      {farmers.map(farmer => (
        <FarmerCard key={farmer.id} farmer={farmer} />
      ))}
    </div>
  );
}
```

## Data Seeding

The backend includes a seed script to populate Firestore with initial data:

```bash
# Set up environment variables
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCP_PROJECT_ID=mysore-farmer-marketplace

# Run seed script
cd backend
go run scripts/seed-data.go
```

The seed script populates:
- 4 users (farmers, consumers, admin)
- 6 products with full details
- About Us page content

## Migration Checklist

- [x] Create API client (`packages/shared/src/api/client.ts`)
- [x] Update product services to use real API
- [x] Update admin store to fetch from backend
- [x] Update farmer store to fetch from backend
- [x] Update about us store to fetch from backend
- [x] Update auth store to pass user context
- [x] Update product hooks (string IDs)
- [x] Update shared package exports
- [x] Remove mock data exports from index.ts
- [x] Add environment configuration files
- [ ] Test with running backend
- [ ] Verify all data loads correctly
- [ ] Test farmer operations (create/update/delete)
- [ ] Test admin operations (user management)
- [ ] Performance testing

## Troubleshooting

### API Requests Failing
1. Ensure backend is running: `docker-compose up` (backend folder)
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify CORS headers in backend (already configured)

### CORS Errors
- Backend already sets `Access-Control-Allow-Origin: *`
- Check browser console for specific error

### Data Not Loading
1. Check if Firestore emulator is running
2. Run seed script: `go run scripts/seed-data.go`
3. Check backend logs for API errors

### Authentication Issues
1. Verify X- headers are being sent (check Network tab)
2. Ensure user is logged in before making requests
3. Check `useAuthStore` is initialized

## Next Steps

### Production Deployment
1. Set up Firebase Authentication (replace mock auth)
2. Deploy backend to Google Cloud Run
3. Update API URL to production endpoint
4. Enable Firebase Security Rules
5. Set up monitoring and logging

### Performance Optimization
1. Implement pagination for large datasets
2. Add caching with React Query
3. Use WebSockets for real-time updates
4. Implement request debouncing

### Additional Features
1. Real-time product updates via WebSockets
2. Advanced search with Elasticsearch
3. Image upload and storage (Cloud Storage)
4. Email notifications
