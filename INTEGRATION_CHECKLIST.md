# Integration Checklist for Backend API

This document outlines the key integration points for using real backend APIs.

## 1. Frontend Initialization (Next.js)

Update your root layout or app component to initialize stores:

```typescript
// src/app/layout.tsx or root component
import { useEffect } from 'react';
import { useAuthStore, useAboutUsStore } from '@mfm/shared';

export default function RootLayout({ children }) {
  const authHydrate = useAuthStore((s) => s.hydrate);
  const aboutUsHydrate = useAboutUsStore((s) => s.hydrate);

  useEffect(() => {
    authHydrate();
    aboutUsHydrate();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## 2. Component Usage Examples

### Displaying Products
```typescript
import { useFeaturedProducts } from '@mfm/shared';

export function FeaturedProducts() {
  const { data: products, isLoading, error } = useFeaturedProducts();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="grid grid-cols-3">
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Displaying About Us
```typescript
import { useAboutUsStore } from '@mfm/shared';

export function About() {
  const { content, loading, error, fetchContent } = useAboutUsStore();

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <h1>{content?.heroTitle}</h1>
      <p>{content?.heroSubtitle}</p>
      {/* Render rest of content */}
    </div>
  );
}
```

### Admin Dashboard
```typescript
import { useAdminStore } from '@mfm/shared';

export function AdminUsers() {
  const { farmers, consumers, loading, error, fetchAllUsers } = useAdminStore();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <UserTable title="Farmers" users={farmers} />
      <UserTable title="Consumers" users={consumers} />
    </div>
  );
}
```

### Farmer Dashboard
```typescript
import { useFarmerStore } from '@mfm/shared';

export function FarmerListings() {
  const { listings, loading, error, fetchListings } = useFarmerStore();

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {listings.map(product => (
        <ListingCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 3. Backend Development Setup

### Start Backend Services

```bash
# Terminal 1: Firestore Emulator
firebase emulators:start --only firestore

# Terminal 2: Go API Server
cd backend
go run cmd/api/main.go

# Or use docker-compose
docker-compose up
```

### Seed Database

```bash
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCP_PROJECT_ID=mysore-farmer-marketplace
go run backend/scripts/seed-data.go
```

## 4. Environment Setup

### Frontend
Create `.env.local` in frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Mobile App
Create `.env.local` in mobile-app directory:
```
REACT_APP_API_URL=http://localhost:8080
```

## 5. Testing API Calls

### Using curl
```bash
# Get all products
curl http://localhost:8080/api/products

# Get featured products with headers
curl -H "X-User-Id: user-123" \
     -H "X-User-Name: John" \
     -H "X-User-Email: john@example.com" \
     -H "X-User-Role: consumer" \
     http://localhost:8080/api/products

# Get about us
curl http://localhost:8080/api/about

# Get admin users
curl http://localhost:8080/api/admin/users
```

### Using Browser Console
```javascript
// Import API client
import { APIClient } from '@mfm/shared';

// Get products
await APIClient.get('/api/products');

// Create product (farmer)
await APIClient.post('/api/products', {
  name: 'Test Product',
  originalPrice: 100,
  offerPrice: 80,
  // ... other fields
});
```

## 6. Error Handling

All API calls throw errors that should be caught:

```typescript
try {
  const products = await fetchAllProducts();
} catch (error) {
  console.error('Failed to load products:', error);
  // Show error to user
}
```

Stores automatically set error state:

```typescript
const { farmers, error, loading } = useAdminStore();

useEffect(() => {
  fetchFarmers();
}, []);

if (error) {
  return <Alert type="error">{error}</Alert>;
}
```

## 7. Performance Considerations

- React Query caches data with 5-minute stale time
- Use `refetchOnWindowFocus: false` to avoid excessive refetches
- Consider pagination for large datasets
- Implement search/filter on the backend

## 8. Mobile App Integration

Same as web, just different environment variable:

```typescript
// app.json or setup
import { APIClient } from '@mfm/shared';

// APIClient uses REACT_APP_API_URL from .env
```

## 9. Common Issues and Fixes

| Issue | Solution |
|-------|----------|
| API returns 401 | Check X- headers are being sent |
| CORS error | Backend already allows all origins |
| Data not loading | Check Firestore emulator is running |
| Stale data | Call `refetch()` from React Query hook |
| Products not showing | Ensure seed-data.go has been run |

## 10. Monitoring and Debugging

Check Network tab in browser DevTools:
1. Request headers should include X-User-* headers
2. Response should be JSON
3. Status should be 200 or appropriate 4xx/5xx

Backend logs:
```
cd backend
go run cmd/api/main.go
# Watch console for API calls and errors
```

## Next: Production Deployment

When ready to deploy:

1. Set up Firebase project
2. Deploy backend to Google Cloud Run
3. Configure production API URL
4. Set up authentication (Firebase Auth)
5. Enable Firestore in production
