import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/error.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

/**
 * GET /api/admin/dashboard
 * Returns high-level KPIs + sales-over-time + top products + recent orders.
 */
router.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Run independent aggregations in parallel
    const [
      totalRevenueAgg,
      lastMonthRevenueAgg,
      productsSoldAgg,
      lastMonthProductsSoldAgg,
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalUsers,
      totalOrders,
      pendingOrders,
      topProductsAgg,
      recentOrders,
      categoryCountsAgg,
    ] = await Promise.all([
      // Total revenue (only paid or delivered / cod delivered orders)
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      // Last month revenue
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      // Total products sold
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: { $sum: '$items.quantity' } } } },
      ]),
      // Last month products sold
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: { $sum: '$items.quantity' } } } },
      ]),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, stock: { $gt: 0, $lte: 10 } }),
      Product.countDocuments({ isActive: true, stock: 0 }),
      User.countDocuments({ active: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      // Top 5 products by sold count
      Product.find({ isActive: true })
        .sort({ sold: -1 })
        .limit(5)
        .select('name images price sold stock')
        .lean(),
      // Recent 5 orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .select('orderNumber total status createdAt items')
        .lean(),
      // Category distribution
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
        { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, name: { $ifNull: ['$cat.name', 'Uncategorized'] }, count: 1 } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Build 6-month sales trend
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format month labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const match = monthlySales.find(
        (m) => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1
      );
      salesTrend.push({
        label: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        revenue: match ? Math.round(match.revenue) : 0,
        orders: match ? match.orders : 0,
      });
    }

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;
    const revenueTrendPct = lastMonthRevenue
      ? Math.round(((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 100;

    const productsSold = productsSoldAgg[0]?.total || 0;
    const lastMonthProductsSold = lastMonthProductsSoldAgg[0]?.total || 0;
    const productsSoldTrendPct = lastMonthProductsSold
      ? Math.round(((productsSold - lastMonthProductsSold) / lastMonthProductsSold) * 100)
      : 100;

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          revenueTrendPct,
          productsSold,
          productsSoldTrendPct,
          lowStockCount,
          outOfStockCount,
          totalProducts,
          totalUsers,
          totalOrders,
          pendingOrders,
        },
        salesTrend,
        topProducts: topProductsAgg.map((p) => ({
          _id: p._id,
          name: p.name,
          image: p.images?.[0]?.url || '',
          price: p.price,
          sold: p.sold || 0,
          stock: p.stock,
          revenue: (p.sold || 0) * p.price,
        })),
        recentOrders,
        categoryCounts: categoryCountsAgg,
      },
    });
  })
);

/**
 * GET /api/admin/sales
 * Detailed sales analytics with date range + breakdown by category / status.
 */
router.get(
  '/sales',
  asyncHandler(async (req, res) => {
    const days = Math.min(365, Math.max(1, parseInt(req.query.days, 10) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [byDay, byStatus, byCategory] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: since }, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: since }, status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'prod',
          },
        },
        { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$prod.category',
            units: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'cat',
          },
        },
        { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            category: { $ifNull: ['$cat.name', 'Uncategorized'] },
            units: 1,
            revenue: 1,
          },
        },
        { $sort: { revenue: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: { byDay, byStatus, byCategory, days },
    });
  })
);

/**
 * POST /api/admin/seed
 * Manually trigger a full database re-seed (clears existing data first).
 * Useful for deployments where `npm run seed` wasn't run.
 */
router.post(
  '/seed',
  asyncHandler(async (req, res) => {
    const { runSeed } = await import('../seedData.js');
    const summary = await runSeed({ clearFirst: true });
    res.json({
      success: true,
      message: 'Database seeded successfully.',
      data: summary,
    });
  })
);

/**
 * GET /api/admin/seed-status
 * Check if the database has data (returns product count).
 */
router.get(
  '/seed-status',
  asyncHandler(async (req, res) => {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    res.json({
      success: true,
      data: {
        isEmpty: productCount === 0,
        products: productCount,
        users: userCount,
        categories: categoryCount,
      },
    });
  })
);

export default router;
