import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import expressMongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';
import { apiLimiter } from './middleware/rateLimit.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import couponRoutes from './routes/coupons.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';
import homeSlideRoutes from './routes/homeSlides.js';

const app = express();

// ============ SECURITY & OPTIMIZATION MIDDLEWARE ============
// Trust proxy (needed for correct req.ip behind Render/Vercel proxies)
app.enable('trust proxy');

// Helmet — sets security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // API server, no browser-executed content
  })
);

// CORS — allow configured client origin
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser tools (no origin) and configured origins
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers with sane limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Cookies
app.use(cookieParser());

// Mongo sanitize — strip $ and . from keys to prevent NoSQL injection
app.use(expressMongoSanitize());

// XSS clean — sanitize user input
app.use(xssClean());

// Compression — gzip/deflate
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Global rate limit
app.use('/api', apiLimiter);

// ============ HEALTH CHECK ============
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'nexra-backend',
    time: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    name: 'Nexra API',
    version: '1.0.0',
    docs: '/api',
    health: '/health',
  });
});

// ============ API ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/:id/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/home-slides', homeSlideRoutes);

// API index
app.get('/api', (_req, res) => {
  res.json({
    success: true,
    message: 'Nexra API v1',
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login', '/api/auth/logout', '/api/auth/me'],
      products: ['/api/products', '/api/products/:id', '/api/products/slug/:slug', '/api/products/featured', '/api/products/new-arrivals', '/api/products/:id/images'],
      categories: ['/api/categories'],
      cart: ['/api/cart'],
      orders: ['/api/orders', '/api/orders/admin/all'],
      users: ['/api/users/me', '/api/users/admin/all'],
      coupons: ['/api/coupons/validate'],
      upload: ['/api/upload/image'],
      admin: ['/api/admin/dashboard', '/api/admin/sales'],
    },
  });
});

// ============ 404 + ERROR HANDLER ============
app.use(notFound);
app.use(errorHandler);

// ============ START ============
const PORT = process.env.PORT || 5000;

/**
 * Auto-seed the database if it's empty on server startup.
 * This ensures Render/Vercel deployments have data even if
 * `npm run seed` wasn't run manually.
 *
 * Set AUTO_SEED=false in env to disable.
 */
const autoSeedIfEmpty = async () => {
  if (process.env.AUTO_SEED === 'false') {
    console.log('🌱 Auto-seed disabled (AUTO_SEED=false).');
    return;
  }
  try {
    const { isDatabaseEmpty, runSeed } = await import('./seedData.js');
    const empty = await isDatabaseEmpty();
    if (!empty) {
      console.log('🌱 Database already has products — skipping auto-seed.');
      return;
    }
    console.log('🌱 Database is empty. Auto-seeding default data...');
    const summary = await runSeed({ clearFirst: false });
    console.log(`✅ Auto-seed complete: ${summary.categories} categories, ${summary.products} products, ${summary.slides} slides, ${summary.coupons} coupons.`);
    console.log(`🔑 Admin login: ${summary.adminEmail} / ${process.env.SEED_ADMIN_PASSWORD || 'Admin@123'}`);
  } catch (err) {
    console.error('⚠️  Auto-seed failed (server will still start):', err.message);
  }
};

const start = async () => {
  await connectDB();
  // Auto-seed after DB connection (non-blocking — server starts regardless)
  autoSeedIfEmpty().catch((err) => console.error('Auto-seed error:', err));
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Nexra backend running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

start();

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    console.log(`\n${sig} received. Shutting down gracefully...`);
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled rejection:', err);
});
