# Mysore Farmer Market (MFM)

[![CI — Shared + Web + Mobile](https://github.com/deekshithmr95/mfm/actions/workflows/ci.yml/badge.svg)](https://github.com/deekshithmr95/mfm/actions/workflows/ci.yml)

A full-stack platform connecting local farmers directly with conscious consumers in Mysore, Karnataka. Eliminate middlemen, ensure fair prices, and guarantee farm-fresh produce delivery within hours of harvest.

## 🌾 About MFM

**Mission**: Build a sustainable food ecosystem where farmers earn what they deserve and consumers get the freshest, chemical-free produce — straight from the farms of Mysore.

**Why MFM?**
- 🚜 Direct farmer-to-consumer marketplace
- ⚡ Farm-fresh guaranteed (harvested within 24 hours)
- 💰 Fair pricing (farmers get 80% of order value)
- 🌱 Organic & certified products
- 📱 Cross-platform access (Web + Mobile)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Monorepo Workspaces                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  @mfm/shared │  │   Frontend   │  │  Mobile App  │      │
│  │(Zustand+API) │  │ (Next.js 16) │  │ (Expo 54)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│         All share: Types, Stores, Hooks, Services          │
└─────────────────────────────────────────────────────────────┘
                           ↓
              ┌────────────────────────────┐
              │   Go REST API Backend      │
              │  (Cloud Functions/Run)     │
              └────────────────────────────┘
                           ↓
              ┌────────────────────────────┐
              │   Firestore Database       │
              │   (Real-time updates)      │
              └────────────────────────────┘
```

## 📦 Packages

### **@mfm/shared**
Unified package containing:
- 📋 **Types**: Product, User, Order interfaces
- 🛒 **Stores**: useCartStore, useAuthStore, useAdminStore, useFarmerStore, etc.
- 🎣 **Hooks**: useProducts, useFeaturedProducts, useAllProducts
- 📡 **Services**: Real API client calling Go backend
- 🔧 **API Client**: HTTPClient with automatic auth headers

### **frontend**
Next.js 16 web application:
- 🏪 Product catalog with search/filter
- 🛒 Shopping cart and checkout
- 👨‍🌾 Farmer dashboard for product management
- 👮 Admin dashboard for user/platform management
- 📖 About page with company information

### **mobile-app**
Expo/React Native mobile application:
- 📱 iOS and Android support
- 🎯 Native performance with Expo
- 📡 Same backend as web app
- 📍 Location-based features

### **backend**
Go REST API:
- 🔐 User authentication and authorization
- 📦 Product CRUD operations
- 🛍️ Order management
- 👥 Admin operations
- 🔍 Search and filtering
- Deployed to: Google Cloud Run / Cloud Functions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Go 1.22+
- Docker & Docker Compose

### Development Setup

```bash
# 1. Clone repository
git clone https://github.com/deekshithmr95/mfm.git
cd mfm

# 2. Install dependencies
npm install

# 3. Start backend
cd backend
docker-compose up

# 4. Seed database (in new terminal)
export FIRESTORE_EMULATOR_HOST=localhost:8080
go run scripts/seed-data.go

# 5. Configure frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# 6. Start development
npm run dev

# 7. Visit http://localhost:3000
```

See **[QUICK_START.md](./QUICK_START.md)** for detailed setup instructions.

## 📚 Documentation

- **[Migration Guide](./MIGRATION_GUIDE.md)** - API backend integration details
- **[Integration Checklist](./INTEGRATION_CHECKLIST.md)** - Implementation checklist with examples
- **[Quick Start](./QUICK_START.md)** - Get running in 5 minutes
- **[Migration Summary](./MIGRATION_SUMMARY.md)** - Complete changelog of API migration
- **[Walkthrough](./walkthrough.md)** - Monorepo architecture deep dive

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with SSR/Static generation
- **TypeScript** - Type-safe development
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **CSS Modules** - Scoped styling
- **Jest** - Unit testing

### Mobile
- **Expo 54** - React Native framework
- **React Native 0.81** - Native mobile development
- **EAS Build** - Cloud build service

### Backend
- **Go 1.22** - Fast, compiled server
- **Firestore** - NoSQL realtime database
- **Cloud Functions** - Serverless deployment
- **Cloud Run** - Container deployment option

## 📝 API Endpoints

### Products
```
GET    /api/products              List all products
GET    /api/products/:id          Get single product
GET    /api/products/search       Search products
POST   /api/products              Create product (farmers)
PUT    /api/products/:id          Update product
DELETE /api/products/:id          Delete product
```

### Orders
```
POST   /api/orders                Create order
GET    /api/orders                List orders (user-filtered)
GET    /api/orders/:id            Get order details
PUT    /api/orders/:id/status     Update order status
```

### Admin
```
GET    /api/admin/overview        Platform statistics
GET    /api/admin/users           List all users
GET    /api/admin/farmers         List farmers
GET    /api/admin/consumers       List consumers
PUT    /api/admin/users/:id       Update user (status/notes)
```

### Farmer Dashboard
```
GET    /api/farmer/stats          Farmer's statistics
GET    /api/farmer/listings       Farmer's products
GET    /api/farmer/orders         Farmer's orders
```

### About Us
```
GET    /api/about                 Get about page content
PUT    /api/about                 Update about page (admin)
```

## 👥 User Roles

| Role | Access | Features |
|------|--------|----------|
| **Consumer** | Public | Browse products, place orders, view wishlist |
| **Farmer** | Dashboard | Manage products, track orders, view analytics |
| **Admin** | Dashboard | Manage users, monitor platform, update content |

## 🗄️ Data Model

### Product
```typescript
{
  id: string;
  name: string;
  farmerName: string;
  farmerId: string;
  image: string;
  originalPrice: number;
  offerPrice: number;
  stock: number;
  category: "Vegetables" | "Dairy & Eggs" | "Pantry" | "Spices";
  rating: number;
  reviewCount: number;
  certifications: string[];
  harvestDate: string;
  badges: ("seasonal" | "featured" | "bestseller")[];
}
```

### Order
```typescript
{
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  shippingAddress: string;
  createdAt: string;
}
```

## 🔐 Authentication

Currently uses mock authentication with custom headers:
```
X-User-Id: user-123
X-User-Name: John Doe
X-User-Email: john@example.com
X-User-Role: consumer
```

**Production**: Integrates with Firebase Authentication and custom JWT tokens.

## 📊 CI/CD Pipeline

GitHub Actions workflow automates:

1. **Install** - Dependency caching
2. **Lint** - ESLint, TypeScript checking
3. **Build** - Next.js compilation
4. **Test** - Jest unit tests
5. **Build Backend** - Go compilation for ARM64
6. **Deploy** - GCP deployment (master branch only)

View pipeline status: [GitHub Actions](https://github.com/deekshithmr95/mfm/actions)

## 🚢 Deployment

### Frontend
- **Hosting**: Firebase Hosting / Vercel
- **Build Command**: `npm run build --workspace=frontend`
- **Output**: Optimized Next.js build

### Backend
- **Hosting**: Google Cloud Run / Cloud Functions
- **Build**: Docker containerized Go binary
- **Database**: Managed Firestore

### Mobile
- **Distribution**: EAS / TestFlight / Google Play
- **Build**: EAS Build cloud service

## 💡 Development Workflow

```bash
# Development
npm run dev              # Start all dev servers

# Building
npm run build            # Build all packages
npm run build:web        # Build frontend only

# Testing
npm test                 # Run all tests
npm test:watch          # Watch mode

# Linting
npm run lint             # Lint all packages

# Backend specific
cd backend && go run cmd/api/main.go
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

**Code Standards**:
- TypeScript for all frontend code
- Go for backend
- Tests for new features
- ESLint + Prettier for formatting

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙋 Support & Contact

- **Issues**: GitHub Issues for bug reports
- **Email**: support@mysorefm.com
- **Website**: https://www.mysorefm.com

## 🎯 Roadmap

- [ ] Payment gateway integration (Razorpay)
- [ ] Real-time order tracking with WebSockets
- [ ] Advanced farmer analytics dashboard
- [ ] AI-powered product recommendations
- [ ] Video product demos
- [ ] Subscription/recurring orders
- [ ] Multi-language support

## 🌟 Key Features

✅ Farm-to-table marketplace
✅ Real-time product availability
✅ Farmer dashboard analytics
✅ Admin platform management
✅ Cross-platform (Web + Mobile)
✅ Secure transactions
✅ Responsive design
✅ Full-stack testing

---

**Made with ❤️ by the MFM Team**

Last Updated: April 15, 2026
