# MFM Frontend - Next.js Web Application

Web application for the Mysore Farmer Market platform. Built with Next.js 16, TypeScript, and Zustand for state management.

## 📋 Features

- 🏪 Product catalog with search and filtering
- 🛒 Shopping cart and wishlist management
- 🛍️ Order management and history
- 👨‍🌾 Farmer dashboard for product management
- 👮 Admin dashboard for platform management
- 📱 Responsive design (mobile-first)
- 🔐 User authentication and authorization
- 🎨 Dark mode support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Development

```bash
# Install dependencies (from root)
npm install

# Set up environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Start development server
npm run dev --workspace=frontend

# Open http://localhost:3000
```

### Building

```bash
# Build for production
npm run build --workspace=frontend

# Start production server
npm run start --workspace=frontend
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx          Root layout
│   │   ├── page.tsx            Home page
│   │   ├── about/              About page
│   │   ├── admin/              Admin dashboard
│   │   ├── cart/               Shopping cart
│   │   ├── checkout/           Checkout flow
│   │   ├── farmer/             Farmer dashboard
│   │   ├── login/              Authentication
│   │   ├── orders/             Order history
│   │   ├── products/           Product details
│   │   ├── search/             Search results
│   │   └── wishlist/           Wishlist page
│   ├── components/             Reusable components
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── hooks/                  Custom React hooks
│   │   └── useProducts.ts      (from @mfm/shared)
│   ├── lib/                    Utilities
│   │   └── storage.ts          localStorage adapter
│   ├── services/               API services
│   │   └── api.ts              (re-exports from @mfm/shared)
│   ├── store/                  State management
│   │   └── *.ts                (re-exports from @mfm/shared)
│   └── types/                  TypeScript types
│       └── *.ts                (re-exports from @mfm/shared)
├── public/                     Static assets
├── __tests__/                  Unit tests
├── e2e/                        End-to-end tests
├── next.config.ts             Next.js configuration
├── tsconfig.json              TypeScript configuration
├── jest.config.ts             Jest configuration
├── playwright.config.ts       E2E test configuration
└── package.json               Dependencies and scripts
```

## 🔌 API Integration

All API calls go through `@mfm/shared` API client:

```typescript
// Fetching products
import { useFeaturedProducts } from '@mfm/shared';

export function Home() {
  const { data: products, isLoading, error } = useFeaturedProducts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 🛒 State Management

Using Zustand stores from `@mfm/shared`:

- **useAuthStore** - User authentication
- **useCartStore** - Shopping cart
- **useWishlistStore** - Wishlist management
- **useFarmerStore** - Farmer dashboard
- **useAdminStore** - Admin operations
- **useOrderStore** - Order management
- **useToastStore** - Notifications
- **useAboutUsStore** - About page content

## 🧪 Testing

```bash
# Run unit tests
npm test --workspace=frontend

# Run tests in watch mode
npm test --workspace=frontend -- --watch

# Run E2E tests
npm run test:e2e --workspace=frontend

# Generate coverage report
npm test --workspace=frontend -- --coverage
```

## 🎨 Styling

- CSS Modules for component-scoped styles
- Responsive design utilities
- Dark mode support
- CSS variables for theming

## ⚙️ Environment Variables

Create `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Optional: Firebase configuration (for future use)
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
```

## 🔄 Build Configuration

- **transpilePackages**: `@mfm/shared` for monorepo support
- **standalone**: Optimized Docker deployments
- **swcMinify**: SWC-based minification for performance

## 📦 Dependencies

- **next**: React framework with SSR/SSG
- **react** & **react-dom**: UI library
- **typescript**: Type safety
- **zustand**: State management
- **@tanstack/react-query**: Server state management
- **eslint-config-next**: ESLint configuration

## 🚢 Deployment

### Firebase Hosting
```bash
firebase deploy --only hosting
```

### Vercel
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -f Dockerfile.web -t mfm-frontend .
docker run -p 3000:3000 mfm-frontend
```

## 📚 Links

- [MFM Main README](../README.md)
- [Shared Package Documentation](../packages/shared/)
- [Backend API Documentation](../backend/)
- [Mobile App](../mobile-app/)

## 🐛 Troubleshooting

### API calls failing
- Check backend is running: `docker-compose up` in backend folder
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Build errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check Node.js version (18+): `node --version`

### Hot reload not working
- Restart dev server
- Check file permissions
- Clear Next.js cache: `npm run clean`

## 💡 Development Tips

- Use `npm run lint` to check code quality
- Use `npm run type-check` for TypeScript validation
- Components are in `src/components/`
- Pages are in `src/app/`
- Shared logic in `@mfm/shared` package

---

For more information, see [MFM README](../README.md)

