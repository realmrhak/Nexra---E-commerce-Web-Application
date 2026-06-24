/**
 * Seed script — populate MongoDB Atlas with default categories + products.
 * Run with: npm run seed
 *
 * Reads MONGODB_URI from environment. Safe to re-run (clears existing data first).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import User from './models/User.js';
import HomeSlide from './models/HomeSlide.js';

// Local image paths map to bundled assets. In production these would be Cloudinary URLs.
// For seeding we use placeholder URLs that resolve to bundled frontend images.
const IMG = (name) => `https://placehold.co/600x750/1a1a1a/ffffff?text=${encodeURIComponent(name)}`;

const categories = [
  { name: 'Shirts', order: 1 },
  { name: 'Pants', order: 2 },
  { name: 'Hoodie', order: 3 },
  { name: 'Jackets', order: 4 },
  { name: 'Footwear', order: 5 },
  { name: 'Wallets', order: 6 },
  { name: 'Perfume', order: 7 },
  { name: 'Caps', order: 8 },
  { name: 'Sun Glasses', order: 9 },
  { name: 'Dresses', order: 10 },
];

const buildProducts = (catMap) => [
  {
    name: 'Sky-Blue Baggy Jeans Pant',
    description: 'Comfortable cotton-blend baggy jeans with a relaxed fit and durable stitching. Perfect for casual everyday wear.',
    brand: 'Ralph Lauren',
    category: catMap.Pants,
    price: 14.0,
    oldPrice: 20.0,
    images: [{ url: IMG('Baggy Pants'), public_id: 'seed-baggy-1' }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Indigo'],
    stock: 45,
    isFeatured: true,
    isNew: true,
    tags: ['baggy', 'jeans', 'casual'],
  },
  {
    name: 'Stylish Zipper Jacket',
    description: 'Front-zip jacket with ribbed cuffs and a soft inner lining. Water-resistant outer shell for everyday comfort.',
    brand: 'Charcoal',
    category: catMap.Jackets,
    price: 18.0,
    oldPrice: 25.0,
    images: [{ url: IMG('Zipper Jacket'), public_id: 'seed-zipper-1' }],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Olive'],
    stock: 30,
    isFeatured: true,
    tags: ['jacket', 'zipper', 'winter'],
  },
  {
    name: 'Premium Winter Jacket',
    description: 'Heavy-duty insulated winter jacket with multiple pockets and a removable hood. Designed for sub-zero temperatures.',
    brand: 'Uniworth',
    category: catMap.Jackets,
    price: 30.0,
    oldPrice: 40.0,
    images: [{ url: IMG('Winter Jacket'), public_id: 'seed-jacket-1' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy'],
    stock: 22,
    isFeatured: true,
    tags: ['jacket', 'winter', 'insulated'],
  },
  {
    name: 'Genuine Leather Wallet',
    description: 'Hand-stitched full-grain leather wallet with RFID protection. Six card slots and a hidden cash pocket.',
    brand: 'Legacy',
    category: catMap.Wallets,
    price: 10.0,
    oldPrice: 15.0,
    images: [{ url: IMG('Leather Wallet'), public_id: 'seed-wallet-1' }],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    stock: 80,
    isFeatured: false,
    isNew: true,
    tags: ['wallet', 'leather', 'rfid'],
  },
  {
    name: 'UV-Protection Sun Glasses',
    description: 'Polarized lenses with 100% UV protection. Lightweight acetate frame with anti-glare coating.',
    brand: 'Ralph Lauren',
    category: catMap['Sun Glasses'],
    price: 16.0,
    oldPrice: 22.0,
    images: [{ url: IMG('Sun Glasses'), public_id: 'seed-sunglasses-1' }],
    sizes: ['One Size'],
    colors: ['Black', 'Tortoise'],
    stock: 60,
    isFeatured: true,
    tags: ['sunglasses', 'uv', 'polarized'],
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Soft combed-cotton crew-neck tee with reinforced collar. Pre-shrunk for perfect fit after wash.',
    brand: 'Zellbury',
    category: catMap.Shirts,
    price: 12.0,
    oldPrice: 18.0,
    images: [{ url: IMG('T-Shirt'), public_id: 'seed-tshirt-1' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Heather Grey'],
    stock: 100,
    isFeatured: false,
    isNew: true,
    tags: ['tshirt', 'cotton', 'casual'],
  },
  {
    name: 'Casual bomber Jacket',
    description: 'Modern bomber silhouette with ribbed hem and a smooth satin finish. Ideal for spring and autumn evenings.',
    brand: 'Charcoal',
    category: catMap.Jackets,
    price: 28.0,
    oldPrice: 35.0,
    images: [{ url: IMG('Bomber Jacket'), public_id: 'seed-jacket-2' }],
    sizes: ['M', 'L', 'XL'],
    colors: ['Olive', 'Maroon'],
    stock: 35,
    isFeatured: true,
    tags: ['jacket', 'bomber', 'casual'],
  },
  {
    name: 'Stylish Snapback Cap',
    description: 'Adjustable flat-brim snapback cap made from breathable cotton twill. One size fits all.',
    brand: 'Legacy',
    category: catMap.Caps,
    price: 7.0,
    oldPrice: 10.0,
    images: [{ url: IMG('Cap'), public_id: 'seed-cap-1' }],
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Red'],
    stock: 90,
    isFeatured: false,
    isNew: false,
    tags: ['cap', 'snapback', 'accessory'],
  },
  {
    name: 'Premium Eau de Parfum 100ml',
    description: 'Long-lasting woody-amber fragrance with citrus top notes. Glass bottle with magnetic cap.',
    brand: 'Legacy',
    category: catMap.Perfume,
    price: 45.0,
    oldPrice: 60.0,
    images: [{ url: IMG('Perfume'), public_id: 'seed-perfume-1' }],
    sizes: ['50ml', '100ml'],
    colors: ['Amber'],
    stock: 25,
    isFeatured: true,
    isNew: true,
    tags: ['perfume', 'fragrance', 'luxury'],
  },
  {
    name: 'Classic Summer Dress',
    description: 'Flowy floral-print summer dress with adjustable straps. Lightweight rayon fabric perfect for warm days.',
    brand: 'Zellbury',
    category: catMap.Dresses,
    price: 35.0,
    oldPrice: 50.0,
    images: [{ url: IMG('Summer Dress'), public_id: 'seed-dress-1' }],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral', 'Sky Blue', 'Pink'],
    stock: 40,
    isFeatured: true,
    isNew: true,
    tags: ['dress', 'summer', 'floral'],
  },
  {
    name: 'Slim-Fit Polo Shirt',
    description: 'Classic two-button polo with ribbed collar. Piqué cotton for breathability and a sharp look.',
    brand: 'Ralph Lauren',
    category: catMap.Shirts,
    price: 22.0,
    oldPrice: 30.0,
    images: [{ url: IMG('Polo Shirt'), public_id: 'seed-polo-1' }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Burgundy', 'Forest'],
    stock: 70,
    isFeatured: false,
    isNew: true,
    tags: ['polo', 'shirt', 'smart-casual'],
  },
  {
    name: 'Running Sneakers',
    description: 'Cushioned running sneakers with breathable mesh upper and durable rubber outsole. Built for daily training.',
    brand: 'Uniworth',
    category: catMap.Footwear,
    price: 55.0,
    oldPrice: 75.0,
    images: [{ url: IMG('Sneakers'), public_id: 'seed-sneakers-1' }],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['Black', 'White', 'Grey'],
    stock: 50,
    isFeatured: true,
    isNew: false,
    tags: ['sneakers', 'running', 'sports'],
  },
];

const coupons = [
  {
    code: 'WELCOME10',
    description: '10% off your first order',
    type: 'percentage',
    value: 10,
    minOrderValue: 20,
    maxDiscount: 50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    usageLimit: 1000,
    isActive: true,
  },
  {
    code: 'SAVE25',
    description: 'Flat $25 off orders above $100',
    type: 'fixed',
    value: 25,
    minOrderValue: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    isActive: true,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      HomeSlide.deleteMany({}),
    ]);

    console.log('🌱 Inserting categories...');
    const catDocs = await Category.insertMany(categories);
    const catMap = catDocs.reduce((acc, c) => {
      acc[c.name] = c._id;
      return acc;
    }, {});

    console.log('🌱 Inserting products...');
    const productDocs = await Product.insertMany(buildProducts(catMap));

    console.log('🌱 Creating home slider from first 8 products...');
    const slideDocs = await Promise.all(
      productDocs.slice(0, 8).map((p, i) =>
        HomeSlide.create({ product: p._id, order: i, isActive: true })
      )
    );

    console.log('🌱 Inserting coupons...');
    await Coupon.insertMany(coupons);

    // ---- Always create a default admin user (env vars override defaults) ----
    // Default credentials — change in production via SEED_ADMIN_* env vars.
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@nexra.shop';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.SEED_ADMIN_NAME || 'Nexra Admin';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      // Update password + role to ensure admin can always log in after re-seed
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      existingAdmin.emailVerified = true;
      existingAdmin.name = adminName;
      await existingAdmin.save();
      console.log(`🌱 Admin user updated: ${adminEmail}`);
    } else {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        emailVerified: true,
      });
      console.log(`🌱 Admin user created: ${adminEmail}`);
    }

    // Also create a demo regular user for testing
    const demoEmail = 'demo@nexra.shop';
    const existingDemo = await User.findOne({ email: demoEmail });
    if (!existingDemo) {
      await User.create({
        name: 'Demo User',
        email: demoEmail,
        password: 'Demo@123',
        role: 'user',
        emailVerified: true,
      });
      console.log(`🌱 Demo user created: ${demoEmail}`);
    }

    console.log('');
    console.log('✅ Seed completed successfully.');
    console.log(`   Categories: ${catDocs.length}`);
    console.log(`   Products: ${productDocs.length}`);
    console.log(`   Home Slides: ${slideDocs.length}`);
    console.log(`   Coupons: ${coupons.length}`);
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  🔑 DEFAULT LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  Admin : ${adminEmail} / ${adminPassword}`);
    console.log(`  Demo  : ${demoEmail} / Demo@123`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('⚠️  Change the admin password in production by setting');
    console.log('   SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD env vars');
    console.log('   before running npm run seed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
