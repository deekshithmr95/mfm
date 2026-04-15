# MFM Mobile App - React Native / Expo

Native iOS and Android mobile application for the Mysore Farmer Market platform. Built with Expo 54 and React Native.

## 📋 Features

- 🏪 Browse products with real-time availability
- 🛒 Shopping cart and order management
- 🔍 Search and filter products
- 📱 Push notifications for order updates
- 📍 Location-based services
- 🎨 Native platform optimizations
- 🔐 Secure authentication
- 📊 Order history and tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for testing)

### Development

```bash
# Install dependencies (from root)
npm install

# Set up environment
echo "REACT_APP_API_URL=http://localhost:8080" > .env.local

# Start development server
npm run dev --workspace=mobile-app

# or use Expo directly
cd mobile-app
expo start
```

### Testing on Device

```bash
# iPhone Simulator (Mac)
expo start
# Press 'i' or 's' for iOS

# Android Emulator
expo start
# Press 'a' for Android

# Physical Device
# Scan QR code with Expo Go app
```

### Building

```bash
# Create development build
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Create production build
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## 📁 Project Structure

```
mobile-app/
├── app/                        Expo Router navigation
│   ├── _layout.tsx             Root layout
│   ├── index.tsx               Home screen
│   ├── about.tsx               About page
│   ├── login.tsx               Authentication
│   ├── orders.tsx              Order history
│   ├── wishlist.tsx            Wishlist screen
│   ├── products/               Product screens
│   ├── checkout/               Checkout flow
│   ├── (tabs)/                 Tab navigation
│   ├── (admin)/                Admin screens
│   └── (farmer)/               Farmer screens
├── components/                 Reusable components
│   ├── ui/                     UI components
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── ...
├── hooks/                      Custom hooks
│   ├── use-color-scheme.ts
│   ├── use-theme-color.ts
│   └── use-products.ts
├── src/                        Monorepo shared code
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
├── assets/                     Images and media
├── constants/                  App constants
├── eas.json                    EAS build configuration
├── app.json                    Expo configuration
├── tsconfig.json              TypeScript configuration
└── package.json               Dependencies
```

## 🔌 API Integration

Uses same API client and stores as web app:

```typescript
import { useFeaturedProducts } from '@mfm/shared';

export function ProductsScreen() {
  const { data: products, isLoading, error } = useFeaturedProducts();
  
  if (isLoading) return <ActivityIndicator />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

## 🛒 State Management

Using Zustand stores from `@mfm/shared` (same as web):

- **useAuthStore** - User authentication
- **useCartStore** - Shopping cart
- **useWishlistStore** - Wishlist
- **useFarmerStore** - Farmer operations
- **useAdminStore** - Admin operations
- **useOrderStore** - Order management
- **useToastStore** - Notifications
- **useAboutUsStore** - About content

## 📱 Platform-Specific Code

Device-specific implementations using `.ios.ts` and `.android.ts` extensions:

```
hooks/
├── use-color-scheme.ts         Web fallback
├── use-color-scheme.ios.ts     iOS specific
├── use-color-scheme.web.ts    Web specific
```

## ⚙️ Environment Variables

Create `.env.local`:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8080

# Expo configuration
EXPO_PUBLIC_API_URL=http://localhost:8080
```

## 🎨 Theming

- Light and dark mode support
- Theme colors in `constants/theme.ts`
- System preference detection
- Dynamic theming based on OS

## 🔐 Storage

Uses `@react-native-async-storage` for local data persistence:

```typescript
import { useStorage } from '@mfm/shared';

// Automatically persists across app sessions
const auth = useAuthStore();
```

## 📦 Dependencies

- **expo** (54): React Native framework
- **react-native** (0.81): Native development
- **expo-router**: File-based routing
- **@react-native-async-storage**: Persistent storage
- **zustand**: State management
- **@tanstack/react-query**: Server state
- **typescript**: Type safety

## 🚢 Deployment

### Development Build

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

### TestFlight (iOS)

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### Google Play (Android)

```bash
eas build --platform android --profile production
eas submit --platform android
```

## 🧪 Testing

```bash
# Run with Expo Go
expo start
# Scan QR code with Expo Go app

# Test on iOS Simulator
expo start -i

# Test on Android Emulator
expo start -a
```

## 📚 Links

- [MFM Main README](../README.md)
- [Shared Package](../packages/shared/)
- [Frontend (Web)](../frontend/)
- [Backend API](../backend/)
- [Expo Documentation](https://docs.expo.dev)

## 🐛 Troubleshooting

### Metro bundler issues
```bash
expo start --clear
```

### Build failures
```bash
# Clear cache
expo prebuild --clean

# Rebuild from scratch
eas build --platform ios --profile preview --clear-cache
```

### API connection errors
- Ensure backend running: `docker-compose up` in backend folder
- Check `REACT_APP_API_URL` in `.env.local`
- Use `http://10.0.2.2:8080` on Android emulator (not localhost)

### Storage not persisting
- App may need rebuild
- Check AsyncStorage permissions in app.json

## 💡 Development Tips

- Components use named exports (for better tree-shaking)
- Use `ThemedText` and `ThemedView` for theme support
- Platform-specific logic in `.ios.ts` and `.android.ts` files
- Test on both iOS and Android before release

## 🎯 Next Steps

- [ ] Implement push notifications
- [ ] Add location-based discovery
- [ ] Camera integration for product photos
- [ ] Biometric authentication
- [ ] Apple Pay / Google Pay integration
- [ ] Offline mode support

---

For more information, see [MFM README](../README.md)

