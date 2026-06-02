# Grofer

Grofer is a full-stack e-commerce project with three main parts:

- `backend` - Express API for products, users, cart, wishlist, reviews, orders, admin actions, uploads, and background functions.
- `admin` - React/Vite admin dashboard for managing products, customers, orders, and dashboard stats.
- `mobile` - Expo React Native shopping app with Clerk authentication, product browsing, wishlist support, profile screens, and early cart work.

This README describes everything currently built in the project. It should be updated whenever new features, setup steps, or behavior are added.

## Tech Stack

### Backend

- Node.js 20+
- Express 5
- MongoDB with Mongoose
- Clerk authentication
- Cloudinary image uploads
- Multer file handling
- Inngest background functions
- CORS and dotenv configuration

### Admin Dashboard

- React 19
- Vite
- React Router
- Clerk React
- TanStack Query
- Axios
- Tailwind CSS 4
- DaisyUI
- Lucide React icons
- Sentry React

### Mobile App

- Expo 54
- React Native 0.81
- Expo Router
- Clerk Expo authentication
- TanStack Query
- NativeWind/Tailwind
- Axios
- Expo Secure Store
- Expo Blur, Image, Haptics, Web Browser, and Auth Session
- Sentry React Native

## Project Structure

```text
grofer/
  backend/
    src/
      config/        # database, env, Cloudinary, Inngest setup
      controller/    # business logic for admin, user, product, cart, order, review
      middleware/    # auth and multer upload middleware
      models/        # Mongoose models
      route/         # Express route definitions
      seeds/         # product seed script
      server.js      # API entry point
  admin/
    src/
      components/    # dashboard UI components
      layout/        # dashboard layout
      lib/           # API and axios helpers
      pages/         # login, dashboard, products, customers, orders
      App.jsx        # route setup
  mobile/
    app/
      (auth)/        # sign-in screens
      (tabs)/        # shop, cart, profile tabs
      _layout.tsx    # root providers and navigation
    components/      # reusable mobile UI components
    hooks/           # product, cart, wishlist, auth hooks
    lib/             # API client
    types/           # shared TypeScript types
```

## Current Features

### Backend API

- Health endpoint at `GET /api/health`.
- Clerk-protected API routes.
- Admin-only routes protected by `adminOnly`.
- Product creation, update, delete, and listing.
- Product image upload support through Multer and Cloudinary.
- Customer listing for admin.
- Dashboard statistics endpoint for admin.
- Order listing and order status updates for admin.
- User order creation and order history.
- User address create, read, update, and delete.
- Wishlist add, remove, and list.
- Cart add, update, remove, clear, and fetch.
- Product browsing and product details.
- Review creation and deletion.
- Inngest endpoint mounted at `/api/inngest`.
- Production mode serves the built admin dashboard from `admin/dist`.

### Admin Dashboard

- Clerk-authenticated admin login flow.
- Dashboard layout with sidebar/navbar structure.
- Dashboard page.
- Products page connected to admin product APIs.
- Customers page connected to admin customer APIs.
- Orders page connected to admin order APIs.
- API helpers for products, orders, customers, and stats.
- Vite production build support.

### Mobile App

- Clerk provider and token cache setup.
- Google and Apple social sign-in screen.
- Protected tab layout that redirects unauthenticated users to auth.
- Shop tab with:
  - Product fetching from the backend.
  - Search input.
  - Category filter UI.
  - Product grid component.
- Profile tab with:
  - Clerk user profile information.
  - Profile image.
  - Menu cards for profile, orders, addresses, and wishlist.
  - Notification and privacy/security rows.
  - Sign-out button.
- Wishlist hook with add, remove, toggle, count, and cache invalidation.
- Cart hook started with add-to-cart mutation.
- Sentry setup for mobile errors, React Query query errors, and mutation errors.

## API Routes

All app routes are mounted under `/api`.

### General

```text
GET /health
POST /inngest
```

### Admin

```text
POST   /admin/products
GET    /admin/products
PUT    /admin/products/:id
DELETE /admin/products/:id

GET    /admin/orders
PATCH  /admin/orders/:orderId/status

GET    /admin/customers
GET    /admin/stats
```

### Products

```text
GET /product
GET /product/:id
```

### User

```text
POST   /user/address
GET    /user/address
PUT    /user/address
DELETE /user/address

POST   /user/wishlist
GET    /user/wishlist
DELETE /user/wishlist/:productId
```

### Cart

```text
GET    /cart
POST   /cart
PUT    /cart/:productId
DELETE /cart/:productId
DELETE /cart
```

### Orders

```text
POST /order
GET  /order
```

### Reviews

```text
POST   /review
DELETE /review/:reviewId
```

## Environment Variables

Create the required `.env` files locally. Do not commit real secrets.

### Backend `.env`

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDNARY_CLOUD_NAME=your_cloudinary_cloud_name
INNGEST_SIGNING_KEY=your_inngest_signing_key
ADMIN_EMAIL=admin@example.com
CLIENT_URL=http://localhost:5173
```

Note: the backend currently reads `CLOUDNARY_CLOUD_NAME` with this spelling.

### Admin `.env`

```env
VITE_BASE_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Mobile `.env`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

The mobile API client currently points to:

```text
http://localhost:3000/api
```

For physical devices, update the mobile API URL to a reachable deployed URL or local network IP.

## Installation

Install dependencies for each app:

```bash
npm install --prefix backend
npm install --prefix admin
npm install --prefix mobile
```

Or use the root build command to install backend/admin dependencies and build admin:

```bash
npm run build
```

## Running Locally

### Backend

```bash
npm run dev --prefix backend
```

The backend starts from `backend/src/server.js`.

### Admin Dashboard

```bash
npm run dev --prefix admin
```

By default, Vite serves the admin app on `http://localhost:5173`.

### Mobile App

```bash
npm run start --prefix mobile
```

Other available mobile commands:

```bash
npm run ios --prefix mobile
npm run android --prefix mobile
npm run web --prefix mobile
```

## Seeding Products

The backend includes a product seed script:

```bash
npm run seeds:products --prefix backend
```

Make sure the backend environment variables, especially `DATABASE_URL`, are configured before running the seed script.

## Production Build

The root build command installs backend and admin dependencies, then builds the admin dashboard:

```bash
npm run build
```

The root start command starts the backend:

```bash
npm start
```

When `NODE_ENV=production`, the backend serves the admin dashboard from `admin/dist`.

## Current In-Progress Areas

- Mobile cart screen is still a placeholder.
- Mobile cart hook currently supports adding items, with more cart operations still to be connected.
- Mobile menu actions for orders, addresses, wishlist, notifications, and privacy/security are visible but not fully routed yet.
- Product search logic exists in the mobile shop screen and should be checked while continuing the mobile UI work.
- README should be updated as new backend routes, mobile screens, admin features, deployment steps, or environment variables are added.

## Useful Scripts

### Root

```bash
npm run build
npm start
```

### Backend

```bash
npm run dev --prefix backend
npm start --prefix backend
npm run seeds:products --prefix backend
```

### Admin

```bash
npm run dev --prefix admin
npm run build --prefix admin
npm run lint --prefix admin
npm run preview --prefix admin
```

### Mobile

```bash
npm run start --prefix mobile
npm run start:dev --prefix mobile
npm run ios --prefix mobile
npm run ios:dev --prefix mobile
npm run android --prefix mobile
npm run web --prefix mobile
npm run lint --prefix mobile
```

## Update Log

Use this section to keep track of major project changes.

```text
2026-06-02 - Added initial root README covering backend, admin, and mobile work completed so far.
```
