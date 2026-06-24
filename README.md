# Nexra — Full-Stack E-commerce Web Application

> **Modern, production-grade e-commerce platform** built with React + Vite (frontend) and Node.js + Express + MongoDB Atlas + Cloudinary (backend).

Nexra is a complete clothing & accessories marketplace featuring user authentication, dynamic product catalog, cart, checkout, order management, reviews, coupons, and an admin-ready API. The frontend is optimized for Vercel, and the backend is ready for Render — both deploy from this single repository.

---

## 🔑 Default Login Credentials

After running `npm run seed` in the backend, the following accounts are created automatically:

| Role  | Email                | Password    |
| ----- | -------------------- | ----------- |
| Admin | `admin@nexra.shop`  | `Admin@123` |
| User  | `demo@nexra.shop`    | `Demo@123`  |

> ⚠️ **Change these in production** by setting `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` environment variables before running the seed script.

## 🛠️ Admin Dashboard

The admin dashboard is at **`/admin`** and is only accessible to users with the `admin` role. It uses the same Nexra green theme (`#10B981`) as the rest of the site — no separate template or color scheme.

### Admin Pages

| Page              | URL                                  | Features                                                        |
| ----------------- | ------------------------------------ | --------------------------------------------------------------- |
| **Dashboard**     | `/admin`                             | KPI cards (revenue, products sold, low stock, out of stock), 6-month sales trend chart, top selling products, recent orders, category distribution |
| **Inventory**     | `/admin/inventory`                   | Searchable product table with image, brand, price, stock, sold, Featured/New toggles, edit + delete actions |
| **Add Product**   | `/admin/products/new`                | Full form with multiple image upload (Cloudinary), sizes, colors, tags, Featured/New/Active toggles |
| **Edit Product**  | `/admin/products/:id/edit`           | Same form, pre-filled. **Add or remove individual images** on existing products (the "no option to add image on existing cards" fix) |
| **Orders**        | `/admin/orders`                      | List all orders with status filter + search, view order detail modal, change order status (pending → processing → shipped → delivered → cancelled → returned) |
| **Categories**    | `/admin/categories`                  | Grid view of all categories, add/edit/delete with image upload, toggle visibility (controls home page slider + sidebar) |
| **Users**         | `/admin/users`                       | List all users, search, promote/dote to admin, activate/deactivate accounts |
| **Reviews**       | `/admin/reviews`                     | Moderate all customer reviews across products, delete inappropriate ones |
| **Settings**      | `/admin/settings`                    | Quick links to all admin features + explanation of how toggles affect the public site |

### How "Add Feature to Website" Works

#### Method 1: Inline Editing on the Home Page (NEW — Pencil Icon)

The "Best Sellers" slider on the home page is now **admin-editable inline**. When an admin is logged in:

1. Go to the home page (`/`).
2. Each card in the "Best Sellers" slider shows a **green pencil icon** (top-right corner) — visible ONLY to admins.
3. **Click the pencil** → a product picker modal opens showing all products from your catalog.
4. **Search and select** any product → click "Confirm Selection" → that slider card now shows the picked product.
5. A **red trash icon** next to the pencil lets you remove a card from the slider.
6. At the end of the slider, an **"Add Card"** button (green dashed box) lets you add a new card — click it, pick a product, and a new slide is appended.

Regular users see none of these icons — they just see the slider with the products the admin has curated.

#### Method 2: Product Toggles (from Dashboard)

The admin can also control what customers see using three toggles per product (in the Inventory page or Add/Edit Product form):

1. **Active** — When ON, the product is visible on the store. When OFF, it's hidden from all public pages but remains in the database.
2. **Featured** — When ON, the product appears in the "Featured" API endpoint (used as a fallback for the home slider if no curated slides exist).
3. **New Arrival** — When ON, the product appears in the **"New Products"** section on the home page.

Similarly, in the **Categories** page, toggling a category's "Active" state controls whether it appears in:
- The home page "Featured Categories" slider
- The sidebar filter on the Shop page
- The "All Categories" dropdown in the navigation bar

#### Dashboard in Navbar (Admin Only)

The **Dashboard** link appears in the main navigation bar (the green button on the right side) — but **ONLY when an admin is logged in**. Regular users never see this link and cannot access `/admin` routes (the `AdminRoute` component redirects them to the home page).

### Home Slider API Endpoints

| Method | Path                       | Auth | Description                                              |
| ------ | -------------------------- | ---- | -------------------------------------------------------- |
| GET    | `/api/home-slides`         | ❌   | List active slides (with product populated) — public     |
| GET    | `/api/home-slides/all`     | 👑   | List ALL slides (including inactive) — admin             |
| POST   | `/api/home-slides`         | 👑   | Create a new slide `{ product, badge?, order? }`         |
| PUT    | `/api/home-slides/:id`     | 👑   | Update a slide (change product, badge, order)            |
| DELETE | `/api/home-slides/:id`     | 👑   | Delete a slide                                           |
| PATCH  | `/api/home-slides/reorder` | 👑   | Reorder slides `{ orders: [{ id, order }] }`             |

### Admin API Endpoints

All `/api/admin/*` endpoints require a valid JWT with the `admin` role:

| Method | Path                       | Description                                              |
| ------ | -------------------------- | -------------------------------------------------------- |
| GET    | `/api/admin/dashboard`     | All KPIs, sales trend, top products, recent orders       |
| GET    | `/api/admin/sales`         | Detailed sales analytics (`?days=30`)                    |
| GET    | `/api/users/admin/all`     | List all users (paginated, searchable)                   |
| PATCH  | `/api/users/admin/:id/role`| Promote/demote user (`{role: 'admin'\|'user'}`)          |
| PATCH  | `/api/users/admin/:id/status` | Activate/deactivate user (`{active: boolean}`)        |
| GET    | `/api/orders/admin/all`    | List all orders (paginated, filter by status)            |
| PATCH  | `/api/orders/:id/status`   | Update order status                                       |
| POST   | `/api/products/:id/images` | **Add an image to an existing product** (multipart)      |
| DELETE | `/api/products/:id/images/:publicId` | **Remove a specific image from a product**   |
| POST   | `/api/products`            | Create a new product                                      |
| PUT    | `/api/products/:id`        | Update a product (including all fields + toggles)        |
| DELETE | `/api/products/:id`        | Delete a product                                          |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Product Requirements Document (PRD)](#2-product-requirements-document-prd)
3. [Technical Requirements Document (TRD)](#3-technical-requirements-document-trd)
4. [Repository Structure](#4-repository-structure)
5. [Local Development](#5-local-development)
6. [Environment Variables](#6-environment-variables)
7. [Deployment Guide](#7-deployment-guide)
8. [Security & Performance](#8-security--performance)
9. [API Reference](#9-api-reference)

---

## 1. Project Overview

Nexra is a single-codebase full-stack e-commerce application that replaces a previous static (frontend-only) React prototype. The original repository shipped with hardcoded product data, console.log-only auth flows, and no backend at all. This version:

- Adds a complete REST API backed by **MongoDB Atlas**.
- Uses **Cloudinary** for image uploads (products, avatars, banners).
- Implements real **JWT-based authentication** with httpOnly cookies and refresh-friendly sessions.
- Wires every frontend page to live backend endpoints (no more hardcoded data).
- Hardens the stack with Helmet, CORS, rate-limiting, NoSQL-injection sanitization, XSS protection, Zod input validation, and a centralized error handler.
- Optimizes performance via gzip compression, mongoose indexes, `.lean()` queries, pagination, frontend code-splitting, lazy image loading, and a vendor-chunk strategy.
- Migrates the frontend from Create React App to **Vite** for ~10× faster builds and better tree-shaking.
- Ships deployment configs for **Vercel (frontend)** and **Render (backend)** out of the box.

### What Was Preserved From the Original Repo (No Styling Changes)

The original frontend design, layout, CSS, and component structure are **100% preserved**. Specifically:

- **`App.css`** — untouched, line for line.
- **All Bootstrap 4 utility classes** (`ml-auto`, `mr-3`, `pl-3`, `pr-3`, etc.) continue to work because **Bootstrap 4.1.3** is kept (NOT upgraded to 5).
- **All MUI components** use the same APIs because **MUI 9** + **@mui/styled-engine-sc 9** + **styled-components 6** are kept (NOT downgraded).
- **React 19** is kept (NOT downgraded to 18).
- **react-router-dom 7** is kept (NOT downgraded to 6).
- **Swiper 12**, **react-slick 0.31**, **react-inner-image-zoom 4**, **react-range-slider-input 3.0.2**, **lucide-react 1.3**, **react-icons 5** — all kept at their original versions.
- **All component JSX files** retain their original class names, DOM structure, and layout. The only changes are: data sources swapped from hardcoded arrays to API calls, and event handlers wired to real backend endpoints.
- The ONLY build-tool change is **`react-scripts` → Vite**, which is required because `react-scripts` (Create React App) is deprecated and cannot deploy to modern hosts like Vercel.

---

## 2. Product Requirements Document (PRD)

### 2.1 Vision

Provide shoppers with a fast, trustworthy clothing and accessories marketplace where they can browse, search, filter, review, and purchase products, with full account management and an admin-ready backend for catalog and order management.

### 2.2 Target Users

| Persona            | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| **Shopper**        | Anonymous or registered user browsing products, adding to cart, checkout. |
| **Registered User** | Authenticated shopper with cart persistence, order history, wishlist, addresses. |
| **Admin**          | Operator with elevated JWT role for product/category/order management. |

### 2.3 Goals & Non-Goals

**Goals**
- Eliminate all static/hardcoded product data — every page is driven by the API.
- Ship a secure JWT auth flow (register, login, logout, forgot/reset password, update password).
- Provide a complete shopping flow: browse → filter → product detail → cart → checkout → order confirmation.
- Admin-only APIs for catalog CRUD, image uploads, order status updates.
- One-command seed script to populate demo data.
- Zero-config deploy to Vercel + Render.

**Non-Goals (out of scope for this release)**
- Real-time chat or live auction features.
- Native mobile apps (the PWA-ready frontend is responsive but not packaged as native).
- Payment gateway integration with live card processors (COD + simulated card/PayPal only).
- Multi-tenant/multi-vendor seller portal.
- AI-powered recommendations.

### 2.4 Functional Requirements

#### 2.4.1 Authentication & Authorization
- **FR-AUTH-01** Users can register with name, email, password (min 6 chars).
- **FR-AUTH-02** Users can log in with email + password. JWT issued via httpOnly cookie + Authorization header.
- **FR-AUTH-03** Users can log out (clears cookie + localStorage).
- **FR-AUTH-04** Authenticated users can fetch their profile via `GET /api/auth/me`.
- **FR-AUTH-05** Forgot-password flow issues a hashed reset token (printed to server log in dev; production hooks via SMTP).
- **FR-AUTH-06** Reset-password endpoint validates the token and updates the password hash.
- **FR-AUTH-07** Authenticated users can change their password (current + new).
- **FR-AUTH-08** Admin role (`role: 'admin'`) unlocks protected admin endpoints.

#### 2.4.2 Catalog — Products
- **FR-PROD-01** Anyone can list products with filters: `search`, `category`, `categorySlug`, `brand`, `minPrice`, `maxPrice`, `isFeatured`, `isNew`, `inStock`, `sort` (newest / price-asc / price-desc / rating-desc / popular), `page`, `limit`.
- **FR-PROD-02** Anyone can fetch a single product by `id` or `slug`.
- **FR-PROD-03** Anyone can fetch featured products and new arrivals (curated endpoints).
- **FR-PROD-04** Anyone can fetch related products for a given product.
- **FR-PROD-05** Admins can create / update / delete products.
- **FR-PROD-06** Admins can upload product images to Cloudinary via `POST /api/products/upload-image`.
- **FR-PROD-07** Product schema includes: name, slug, description, brand, category, price, oldPrice, currency, images[], sizes[], colors[], stock, sold, ratings (aggregate), numReviews, reviews[], isActive, isFeatured, isNew, tags[], weight, dimensions.

#### 2.4.3 Catalog — Categories
- **FR-CAT-01** Anyone can list categories.
- **FR-CAT-02** Anyone can fetch a category by slug.
- **FR-CAT-03** Admins can create / update / delete categories.
- **FR-CAT-04** Categories support parent/child hierarchy and ordering.

#### 2.4.4 Reviews
- **FR-REV-01** Authenticated users can post a review (1–5 stars + comment) on a product.
- **FR-REV-02** One review per user per product (uniqueness enforced).
- **FR-REV-03** Product `ratings` and `numReviews` are recomputed automatically when a review is added or deleted.
- **FR-REV-04** Review owner or admin can delete a review.

#### 2.4.5 Cart
- **FR-CART-01** Authenticated users have a single persistent cart.
- **FR-CART-02** Add item to cart with `productId`, `quantity`, `size`, `color`.
- **FR-CART-03** If the same product+size+color already exists in the cart, quantity is incremented.
- **FR-CART-04** Update item quantity (min 1, max 99).
- **FR-CART-05** Remove a single cart item by `itemId`.
- **FR-CART-06** Clear the entire cart.
- **FR-CART-07** Cart exposes virtuals: `subtotal`, `total`.

#### 2.4.6 Coupons
- **FR-COUP-01** Coupons support `percentage` or `fixed` discount types.
- **FR-COUP-02** Coupons can have `minOrderValue`, `maxDiscount`, `usageLimit`, `startDate`, `endDate`.
- **FR-COUP-03** Authenticated users can validate a coupon against a subtotal: `POST /api/coupons/validate`.
- **FR-COUP-04** Coupons are applied at order creation time (server-authoritative).

#### 2.4.7 Orders
- **FR-ORD-01** Authenticated users can create an order from cart items + shipping address + payment method.
- **FR-ORD-02** Order endpoint re-validates product stock and uses server-authoritative prices (never trusts client prices).
- **FR-ORD-03** Stock is decremented atomically; `sold` counter is incremented.
- **FR-ORD-04** Used coupons are tracked (`usedCount` incremented).
- **FR-ORD-05** Cart is cleared automatically after a successful order.
- **FR-ORD-06** Users can list their own orders (paginated).
- **FR-ORD-07** Users can fetch a single order by id (owner or admin only).
- **FR-ORD-08** Admins can list all orders and update order status (pending / processing / shipped / delivered / cancelled / returned).
- **FR-ORD-09** Every order gets a unique human-readable `orderNumber` like `NX-12345678-1234`.

#### 2.4.8 User Profile
- **FR-USER-01** Authenticated users can update name, phone, avatar.
- **FR-USER-02** Users can manage multiple shipping addresses (CRUD).
- **FR-USER-03** Users can add/remove products to a personal wishlist.
- **FR-USER-04** Wishlist is populated (with full product details) on fetch.

#### 2.4.9 Image Uploads
- **FR-IMG-01** Authenticated users can upload images via `POST /api/upload/image` (memory → Cloudinary).
- **FR-IMG-02** Admin-only product image upload endpoint at `POST /api/products/upload-image`.
- **FR-IMG-03** Files are validated (5MB max, jpg/png/webp/gif/avif only).
- **FR-IMG-04** Cloudinary auto-transforms to max 1200×1200 with quality `auto`.

#### 2.4.10 Frontend UX
- **FR-FE-01** Home page renders featured categories, best-sellers, new arrivals from the API.
- **FR-FE-02** Shop page supports search, category filter, price range, status filter, sort, pagination, and per-page count.
- **FR-FE-03** Product detail page shows gallery, variants, stock, related products, reviews, and a review form.
- **FR-FE-04** Cart page reflects backend state; supports quantity edit, remove, coupon apply, totals calculation.
- **FR-FE-05** Checkout page collects shipping address + payment method, creates the order, redirects to confirmation.
- **FR-FE-06** Order confirmation page shows order number, status, items, totals.
- **FR-FE-07** Login / Register / Forgot-Password pages wired to real APIs.
- **FR-FE-08** Header shows user greeting, real cart count + subtotal, logout.
- **FR-FE-09** "Recently viewed products" persisted in `localStorage` (max 6).
- **FR-FE-10** All routes protected where needed (checkout, order confirmation) — unauthenticated users redirected to login.

### 2.5 Non-Functional Requirements

| Category         | Requirement                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| **Performance**  | Lighthouse Performance > 85 on desktop; first contentful paint < 2s on 4G.                       |
| **Scalability**  | Stateless backend; horizontal scale on Render; MongoDB Atlas connection pooling (maxPoolSize 10). |
| **Security**     | Helmet headers, CORS allow-list, rate limiting, bcrypt(12), JWT 7d, mongo-sanitize, xss-clean.    |
| **Availability** | Health-check endpoint (`/health`) for Render to monitor uptime.                                   |
| **Maintainability** | Modular route/controller/middleware structure; Zod schemas for every input.                  |
| **Accessibility**| Semantic HTML, ARIA labels on icon buttons, keyboard-navigable forms.                             |
| **Browser Support** | Last 2 versions of Chrome, Firefox, Safari, Edge.                                             |

---

## 3. Technical Requirements Document (TRD)

### 3.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                       Vercel (Frontend)                       │
│   React 19 + Vite 6 + React Router 7                          │
│   - Pages: Home, Shop, Product, Cart, Checkout, Auth, Orders  │
│   - Contexts: Auth, Cart, App                                 │
│   - Axios client with JWT interceptor + cookie credentials    │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTPS /api/*
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                       Render (Backend)                        │
│   Node.js 18+ / Express 4                                     │
│   - Helmet, CORS, Rate-limit, Compression                     │
│   - Routes: auth, products, categories, cart, orders,         │
│             reviews, users, coupons, upload                   │
│   - JWT in httpOnly cookie + Bearer header                    │
└────────────────────┬─────────────────────────────────────────┘
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
┌──────────────┐         ┌──────────────────┐
│ MongoDB Atlas│         │    Cloudinary     │
│  (Mongoose)  │         │  (Image storage)  │
└──────────────┘         └──────────────────┘
```

### 3.2 Technology Stack

| Layer            | Technology                                                   |
| ---------------- | ----------------------------------------------------------- |
| Frontend runtime | React 19                                                    |
| Frontend build   | Vite 6 (replaces Create React App)                          |
| UI library       | MUI 9 + Bootstrap 4.1 (layout) + custom CSS                |
| Styling engine   | styled-components 6 + @mui/styled-engine-sc 9              |
| Routing          | react-router-dom 7                                          |
| Carousel         | Swiper 12 + react-slick 0.31                                |
| Image zoom       | react-inner-image-zoom 4                                    |
| Icons            | react-icons 5 + lucide-react 1.3                           |
| State            | React Context (Auth, Cart, App) + localStorage persistence |
| HTTP client      | Axios 1.15 with interceptor                                 |
| Notifications    | react-hot-toast                                             |
| Backend runtime  | Node.js 18+                                                 |
| Backend framework| Express 4.21                                                |
| Database         | MongoDB Atlas via Mongoose 8.7                              |
| Auth             | JWT (jsonwebtoken 9) + bcryptjs 2.4 + httpOnly cookies      |
| Validation       | Zod 3.23                                                    |
| Image storage    | Cloudinary 2.10 + multer (memory storage)                  |
| Security         | Helmet 8, CORS, express-rate-limit 7, express-mongo-sanitize, xss-clean |
| Logging          | morgan                                                      |
| Compression      | compression (gzip)                                          |

### 3.3 Database Schema

#### `users`
```
name, email (unique), password (bcrypt, select:false), phone, avatar{url,public_id},
role ('user'|'admin'), addresses[], wishlist[ObjectId], passwordResetToken,
passwordResetExpires, emailVerified, active, timestamps
```
Indexes: `email` (unique).

#### `categories`
```
name (unique), slug (unique), icon, image{url,public_id}, parent (self-ref),
isActive, order, timestamps
```
Indexes: `slug`, `parent`.

#### `products`
```
name, slug (unique), description, brand, category (ref), price, oldPrice, currency,
images[{url,public_id}], sizes[], colors[], stock, sold, ratings, numReviews,
reviews[{user, name, rating, comment, timestamps}], isActive, isFeatured, isNew,
tags[], weight, dimensions{L,W,H}, timestamps
```
Indexes: `slug`, `category+isActive`, `isFeatured+isActive`, `isNew+isActive`, `price`,
**text index** on `{name, description, brand, tags}`.

#### `carts`
```
user (unique ref), items[{product, name, image, price, size, color, quantity}],
couponCode, discount, timestamps
Virtuals: subtotal, total.
```
Index: `user` (unique).

#### `orders`
```
user (ref), orderNumber (unique), items[{product, name, image, price, size, color, quantity}],
shippingAddress{...}, shippingMethod, shippingCost, subtotal, discount, tax, total,
paymentMethod ('cod'|'card'|'paypal'), paymentStatus, paymentResult, status,
deliveredAt, couponCode, notes, timestamps
```
Indexes: `user+createdAt`, `status`, `orderNumber` (unique).

#### `coupons`
```
code (unique), description, type ('percentage'|'fixed'), value, minOrderValue,
maxDiscount, startDate, endDate, usageLimit, usedCount, isActive, timestamps
```

### 3.4 Authentication & Session Design

1. **Registration**: `POST /api/auth/register` → bcrypt-hashed password stored; JWT issued.
2. **Login**: `POST /api/auth/login` → bcrypt.compare → JWT issued.
3. **Token delivery**: JWT is returned in the response body **and** set as an `httpOnly` cookie (`SameSite=Lax` in dev, `SameSite=None; Secure` in prod).
4. **Token verification**: `protect` middleware reads token from `Authorization: Bearer <token>` **or** the `token` cookie. Verifies with `JWT_SECRET`. Loads `User` and attaches to `req.user`.
5. **Logout**: `POST /api/auth/logout` → clears the cookie. Frontend also removes `localStorage.nexra_token`.
6. **Frontend**: Axios interceptor attaches `Authorization` header from `localStorage.nexra_token`. On 401, interceptor clears session and redirects to `/login`.
7. **Password reset**: `forgot-password` issues a SHA-256-hashed token stored on the user with a 30-minute expiry. `reset-password` re-hashes the incoming token, matches, and lets the user set a new password.

### 3.5 Security Measures

| Threat                | Mitigation                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Brute-force login     | `authLimiter` — 20 attempts / 15 min / IP.                                                            |
| API abuse             | `apiLimiter` — 300 req / 15 min / IP (configurable).                                                  |
| NoSQL injection       | `express-mongo-sanitize` strips `$` and `.` from keys.                                                |
| XSS                   | `xss-clean` sanitizes user input; React escapes output by default.                                    |
| CSRF                  | JWT in httpOnly cookie + SameSite=None/Secure (prod); credentials required for state-changing ops.    |
| Stale sessions        | JWT `exp` 7 days; password change invalidates old session by issuing a new token.                     |
| Password leakage      | `bcrypt` with salt rounds 12; `select: false` on the password field.                                  |
| Header injection      | Helmet sets X-Frame-Options, X-Content-Type-Options, Referrer-Policy, etc.                            |
| CORS attacks          | Allow-list origin from `CORS_ORIGINS` env var.                                                        |
| Mass assignment       | All write endpoints use Zod schemas; only whitelisted fields are persisted.                           |
| Malicious uploads     | `multer` 5MB limit + MIME regex filter; Cloudinary re-encodes uploaded images.                        |
| Information disclosure| Global error handler returns stack traces only in non-production.                                     |
| Trust-proxy spoofing  | `app.enable('trust proxy')` correctly resolves `req.ip` behind Render's load balancer.                |

### 3.6 Performance Optimizations

**Backend**
- `compression` middleware (gzip).
- Mongoose compound indexes on hot query paths (see schema).
- `.lean()` on read-only queries to skip Mongoose hydration overhead.
- `Promise.all` for parallelizable queries (e.g. items + count).
- Pagination on all list endpoints (default 12, max 60 per page).
- Text index on products for `$search` queries.
- `maxPoolSize: 10` on the MongoDB connection for Atlas.

**Frontend**
- Vite production build with **manual chunk splitting**: `react-vendor`, `mui-vendor`, `swiper-vendor`, `icons-vendor`.
- `loading="lazy"` on all `<img>` tags.
- Image compression script (`scripts/compress_images.py`) reduces bundled images by ~15%.
- Code-split routes via `react-router-dom` (only the active page's chunk loads).
- Long-term cache headers on static assets via `vercel.json`.
- Country list (3rd-party API) loaded once and cached in `AppContext`.
- Recently-viewed products cached in `localStorage` (no extra API calls).

### 3.7 Error Handling

- Custom `ApiError` class with status code + optional details.
- `asyncHandler` wraps every route so thrown errors hit the central handler.
- Global `errorHandler` normalizes:
  - Mongoose `CastError` → 400
  - Mongoose duplicate-key (`11000`) → 409
  - Mongoose `ValidationError` → 422 with field-level details
  - JSON parse errors → 400
- `notFound` middleware returns 404 with the unmatched method + URL.
- Stack traces are included in dev responses, hidden in production.

### 3.8 Logging & Observability

- `morgan` HTTP logging (`dev` in development, `combined` in production).
- `/health` endpoint for uptime monitoring (Render uses this for health checks).
- All `console.error` paths are wrapped to surface in Render's log stream.
- Unhandled rejections are caught at the process level (no silent crashes).

### 3.9 Deployment Architecture

```
GitHub repo
    ├── frontend/  ──▶ Vercel (auto-deploy from main branch)
    │                  - Build: npm install && npm run build
    │                  - Output: dist/
    │                  - Env: VITE_API_URL=https://nexra-backend.onrender.com
    │
    └── backend/   ──▶ Render (Blueprint from render.yaml)
                       - Build: npm install
                       - Start: npm start
                       - Env: MONGODB_URI, JWT_SECRET, CLOUDINARY_*, CORS_ORIGINS
                       - Health: GET /health
```

Both deploy independently. The frontend talks to the backend over HTTPS with cookies (credentials: true) and Bearer tokens.

---

## 4. Repository Structure

```
nexra/
├── README.md                       ← this file (PRD + TRD)
├── .gitignore
├── frontend/                       ← Vite + React app (deploys to Vercel)
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── public/
│   │   ├── Favicon.png
│   │   └── robots.txt
│   └── src/
│       ├── main.jsx                ← entry
│       ├── App.jsx                 ← routes + providers
│       ├── App.css                 ← global styles
│       ├── api/
│       │   └── axios.js            ← Axios client + JWT interceptor
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   └── AppContext.jsx
│       ├── Layouts/
│       │   ├── MainLayout.js
│       │   └── AuthLayout.js
│       ├── Components/
│       │   ├── Header/             ← with SearchBox + Navigations
│       │   ├── Footer/
│       │   ├── Breadcrumbs/
│       │   ├── HomeBanner/
│       │   ├── HomeCategory/
│       │   ├── CountryDropdown/
│       │   ├── ProductItem/
│       │   ├── ProductModel/
│       │   ├── ProductZoom/
│       │   ├── QuantityBox/
│       │   └── Sidebar/
│       ├── Pages/
│       │   ├── Home/
│       │   ├── Listing/
│       │   ├── ProductDetails/     ← with RelatedProducts + RecentlyViewedProduct
│       │   ├── Cart/
│       │   ├── Checkout/
│       │   ├── OrderConfirmation/
│       │   ├── Login/
│       │   ├── Register/
│       │   └── ForgotPasswordPage/
│       └── Assets/Images/          ← bundled banners, category tiles, demo items
│
└── backend/                        ← Express + MongoDB (deploys to Render)
    ├── package.json
    ├── server.js                   ← entry — Express app + middleware
    ├── seed.js                     ← seed categories + products + coupons
    ├── render.yaml                 ← Render Blueprint
    ├── .env.example
    ├── .gitignore
    ├── config/
    │   ├── db.js                   ← MongoDB Atlas connector
    │   └── cloudinary.js           ← Cloudinary + multer config
    ├── models/
    │   ├── User.js
    │   ├── Category.js
    │   ├── Product.js
    │   ├── Cart.js
    │   ├── Order.js
    │   └── Coupon.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── categories.js
    │   ├── cart.js
    │   ├── orders.js
    │   ├── reviews.js              ← mounted at /api/products/:id/reviews
    │   ├── users.js
    │   ├── coupons.js
    │   └── upload.js
    ├── middleware/
    │   ├── auth.js                 ← protect + authorize + adminOnly
    │   ├── error.js                ← ApiError, asyncHandler, errorHandler, notFound
    │   └── rateLimit.js            ← apiLimiter, authLimiter, uploadLimiter
    └── utils/
        └── jwt.js                  ← signToken + verifyToken
```

---

## 5. Local Development

### 5.1 Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas account (free tier works) — or a local MongoDB
- Cloudinary account (free tier works)

### 5.2 One-time setup

```bash
# 1. Install backend deps
cd backend
cp .env.example .env
# Edit .env — fill in MONGODB_URI, JWT_SECRET, CLOUDINARY_*
npm install

# 2. Seed the database (categories + products + coupons)
npm run seed

# 3. Start backend (http://localhost:5000)
npm run dev

# 4. In another terminal — install frontend deps
cd ../frontend
cp .env.example .env.local
npm install

# 5. Start frontend (http://localhost:5173)
npm run dev
```

### 5.3 Available Scripts

**Backend** (`/backend`)
| Command         | Action                                  |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start with nodemon (auto-reload)        |
| `npm start`     | Start in production mode                |
| `npm run seed`  | Populate demo categories/products/coupons |

**Frontend** (`/frontend`)
| Command           | Action                            |
| ----------------- | --------------------------------- |
| `npm run dev`     | Vite dev server with HMR          |
| `npm run build`   | Production build → `dist/`        |
| `npm run preview` | Preview the production build      |

### 5.4 Seeding Users (Admin + Demo)

The seed script **always** creates two accounts:

| Role  | Email              | Password    | Purpose                          |
| ----- | ------------------ | ----------- | -------------------------------- |
| Admin | `admin@nexra.shop` | `Admin@123` | Full admin API access            |
| User  | `demo@nexra.shop`  | `Demo@123`  | Regular shopper for testing      |

To override the admin credentials (recommended in production), add to `backend/.env`:

```
SEED_ADMIN_NAME=Nexra Admin
SEED_ADMIN_EMAIL=admin@yourdomain.com
SEED_ADMIN_PASSWORD=YourStrongPassword123
```

Then re-run `npm run seed`. If the admin already exists, the script will update its password and role.

---

## 6. Environment Variables

### 6.1 Backend (`backend/.env`)

| Variable                  | Description                                                |
| ------------------------- | --------------------------------------------------------- |
| `NODE_ENV`                | `development` or `production`                             |
| `PORT`                    | Port to bind (Render injects this automatically)         |
| `CLIENT_URL`              | Frontend URL for CORS (e.g. `https://nexra.vercel.app`)   |
| `CORS_ORIGINS`            | Comma-separated list of allowed origins                   |
| `MONGODB_URI`             | MongoDB Atlas connection string                           |
| `JWT_SECRET`              | Long random string (≥32 chars) for signing JWTs           |
| `JWT_EXPIRES_IN`          | Token lifetime (e.g. `7d`)                                |
| `JWT_COOKIE_EXPIRES_IN`   | Cookie lifetime in days (e.g. `7`)                        |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name                                     |
| `CLOUDINARY_API_KEY`      | Cloudinary API key                                        |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret                                     |
| `SMTP_*`                  | Optional — Nodemailer for password-reset emails           |
| `RATE_LIMIT_WINDOW_MS`    | Rate-limit window (default 900000 = 15 min)               |
| `RATE_LIMIT_MAX`          | Max requests per window (default 300)                     |

### 6.2 Frontend (`frontend/.env.local`)

| Variable        | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `VITE_API_URL`  | Backend URL. Leave empty in dev (uses Vite proxy). In prod, set to Render URL. |

---

## 7. Deployment Guide

### 7.1 Deploy Backend to Render

1. Push this repository to GitHub.
2. In Render, click **New → Blueprint** and select your repo.
3. Render will detect `backend/render.yaml` and create the web service automatically.
4. Set the following environment variables in the Render dashboard:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — a long random string
   - `CORS_ORIGINS` — your Vercel frontend URL (e.g. `https://nexra.vercel.app`)
   - `CLIENT_URL` — same as `CORS_ORIGINS`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
5. Once deployed, run the seed script once:
   - In Render → Shell: `npm run seed`
6. Verify with `curl https://<your-render-url>/health` — should return `{"status":"ok"}`.

### 7.2 Deploy Frontend to Vercel

1. In Vercel, click **New Project** and import your GitHub repo.
2. Set the **Root Directory** to `frontend`.
3. Vercel will auto-detect Vite — keep the defaults:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` → your Render backend URL (e.g. `https://nexra-backend.onrender.com`)
5. Deploy. Vercel will read `frontend/vercel.json` for SPA rewrites + cache headers.
6. Update your Render backend's `CORS_ORIGINS` to include the Vercel URL.

### 7.3 Post-deploy checklist

- [ ] Backend `/health` returns 200.
- [ ] Frontend loads without console errors.
- [ ] Register → login → add to cart → checkout → order confirmation flow works end-to-end.
- [ ] Image upload (admin) writes to Cloudinary.
- [ ] CORS preflight (OPTIONS) returns 204 from the frontend origin.

---

## 8. Security & Performance

See **§3.5 Security Measures** and **§3.6 Performance Optimizations** in the TRD.

Quick summary of what's hardened:

- ✅ Helmet security headers
- ✅ CORS allow-list (credentials-aware)
- ✅ Rate limiting (general + strict on auth + strict on uploads)
- ✅ bcrypt(12) password hashing
- ✅ JWT in httpOnly cookie + Bearer header
- ✅ NoSQL-injection sanitization
- ✅ XSS sanitization
- ✅ Zod input validation on every write endpoint
- ✅ Server-authoritative pricing on orders (never trusts client prices)
- ✅ Stock validation at order time
- ✅ Compression (gzip) on responses
- ✅ Mongoose compound + text indexes
- ✅ `.lean()` on read paths
- ✅ Vite code-splitting + vendor chunk strategy
- ✅ Lazy image loading + asset cache headers on Vercel

---

## 9. API Reference

Base URL: `/api`

### Auth
| Method | Path                       | Auth | Description                              |
| ------ | -------------------------- | ---- | ---------------------------------------- |
| POST   | `/auth/register`           | ❌   | Register a new user, returns JWT          |
| POST   | `/auth/login`              | ❌   | Login with email + password              |
| POST   | `/auth/logout`             | ❌   | Clear auth cookie                         |
| GET    | `/auth/me`                 | ✅   | Get current user profile                  |
| POST   | `/auth/forgot-password`    | ❌   | Request a password reset token            |
| POST   | `/auth/reset-password`     | ❌   | Reset password using the token            |
| PATCH  | `/auth/update-password`    | ✅   | Change password (current + new)           |
| GET    | `/auth/admin-check`        | 👑   | Admin-only endpoint                       |

### Products
| Method | Path                          | Auth | Description                                |
| ------ | ----------------------------- | ---- | ------------------------------------------ |
| GET    | `/products`                   | ❌   | List with filters + pagination             |
| GET    | `/products/featured`          | ❌   | Featured products                          |
| GET    | `/products/new-arrivals`      | ❌   | New arrivals                               |
| GET    | `/products/:id/related`       | ❌   | Related products                           |
| GET    | `/products/slug/:slug`        | ❌   | Get by slug                                |
| GET    | `/products/:id`               | ❌   | Get by id                                  |
| POST   | `/products`                   | 👑   | Create                                     |
| PUT    | `/products/:id`               | 👑   | Update                                     |
| DELETE | `/products/:id`               | 👑   | Delete                                     |
| POST   | `/products/upload-image`      | 👑   | Upload image to Cloudinary                 |

### Reviews (mounted at `/products/:id/reviews`)
| Method | Path                | Auth | Description              |
| ------ | ------------------- | ---- | ------------------------ |
| GET    | `/`                 | ❌   | List reviews for product |
| POST   | `/`                 | ✅   | Add a review             |
| DELETE | `/:reviewId`        | ✅   | Delete review (owner/admin) |

### Categories
| Method | Path                | Auth | Description       |
| ------ | ------------------- | ---- | ----------------- |
| GET    | `/categories`       | ❌   | List all          |
| GET    | `/categories/:slug` | ❌   | Get by slug       |
| POST   | `/categories`       | 👑   | Create            |
| PUT    | `/categories/:id`   | 👑   | Update            |
| DELETE | `/categories/:id`   | 👑   | Delete            |

### Cart
| Method | Path             | Auth | Description                  |
| ------ | ---------------- | ---- | ---------------------------- |
| GET    | `/cart`          | ✅   | Get current user's cart      |
| POST   | `/cart`          | ✅   | Add item                     |
| PATCH  | `/cart/:itemId`  | ✅   | Update quantity              |
| DELETE | `/cart/:itemId`  | ✅   | Remove item                  |
| DELETE | `/cart`          | ✅   | Clear cart                   |

### Orders
| Method | Path                     | Auth | Description                              |
| ------ | ------------------------ | ---- | ---------------------------------------- |
| GET    | `/orders`                | ✅   | List current user's orders (paginated)   |
| GET    | `/orders/:id`            | ✅   | Get single order (owner or admin)        |
| POST   | `/orders`                | ✅   | Create a new order                       |
| PATCH  | `/orders/:id/status`     | 👑   | Update order status                      |
| GET    | `/orders/admin/all`      | 👑   | List all orders (admin)                  |

### Users
| Method | Path                          | Auth | Description                          |
| ------ | ----------------------------- | ---- | ------------------------------------ |
| GET    | `/users/me`                   | ✅   | Get profile + wishlist              |
| PATCH  | `/users/me`                   | ✅   | Update profile                       |
| POST   | `/users/me/addresses`         | ✅   | Add shipping address                 |
| PATCH  | `/users/me/addresses/:index`  | ✅   | Update address                       |
| DELETE | `/users/me/addresses/:index`  | ✅   | Delete address                       |
| GET    | `/users/me/wishlist`          | ✅   | Get wishlist (with product details)  |
| POST   | `/users/me/wishlist`          | ✅   | Add product to wishlist              |
| DELETE | `/users/me/wishlist/:productId` | ✅ | Remove from wishlist                 |

### Coupons
| Method | Path                  | Auth | Description                          |
| ------ | --------------------- | ---- | ------------------------------------ |
| POST   | `/coupons/validate`   | ✅   | Validate a coupon against a subtotal |

### Upload
| Method | Path             | Auth | Description                              |
| ------ | ---------------- | ---- | ---------------------------------------- |
| POST   | `/upload/image`  | ✅   | Upload any image (5MB max, jpg/png/webp) |
| DELETE | `/upload/image/:publicId` | ✅ | Delete an uploaded image           |

Legend: ❌ = public · ✅ = authenticated · 👑 = admin only

---

## License

MIT © Nexra. Original UI/UX © realmrhak. Backend, integration, security hardening, performance optimizations, and deployment configs added in this revision.
