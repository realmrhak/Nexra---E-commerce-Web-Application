import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Store, Tag, Image as ImageIcon, BarChart3, Settings as SettingsIcon,
  Database, RefreshCw, AlertTriangle, CheckCircle,
} from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const [seedStatus, setSeedStatus] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/seed-status');
      setSeedStatus(res.data.data);
    } catch (err) {
      console.warn('Seed status failed:', err.message);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleSeed = async () => {
    if (!confirm(
      'This will CLEAR all existing data and re-seed the database with default products, categories, coupons, and users. Are you sure?'
    )) return;
    setSeeding(true);
    try {
      const res = await api.post('/api/admin/seed');
      toast.success(`Database seeded! ${res.data.data.products} products, ${res.data.data.categories} categories.`);
      loadStatus();
    } catch (err) {
      toast.error(err?.message || 'Seed failed.');
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    {
      title: 'Store Front',
      desc: 'Preview how customers see your store. Toggle product visibility, featured items, and new arrivals from the Inventory page.',
      link: '/',
      linkText: 'Visit Store',
      icon: Store,
    },
    {
      title: 'Manage Products',
      desc: 'Add, edit, or delete products. Upload multiple images per product. Mark products as Featured (shows on home slider) or New Arrival (shows in New Products section).',
      link: '/admin/inventory',
      linkText: 'Go to Inventory',
      icon: Tag,
    },
    {
      title: 'Categories',
      desc: 'Create categories with images and icons. Categories appear in the home page slider, the sidebar filter, and the navigation menu.',
      link: '/admin/categories',
      linkText: 'Manage Categories',
      icon: ImageIcon,
    },
    {
      title: 'Sales Analytics',
      desc: 'View detailed sales reports, top-performing products, and customer trends on the Dashboard.',
      link: '/admin',
      linkText: 'View Dashboard',
      icon: BarChart3,
    },
  ];

  return (
    <>
      <div className="adminPanel">
        <h3 className="adminPanelTitle">
          <SettingsIcon size={18} style={{ marginRight: 8 }} />
          Admin Settings
        </h3>
        <p style={{ color: 'var(--text-muted, #6b7280)', fontSize: 14, marginBottom: 24 }}>
          Welcome to the Nexra admin panel. Use the cards below to manage every aspect of your store.
          Changes you make here are reflected immediately on the customer-facing website.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                style={{
                  background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)',
                  borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: 'linear-gradient(135deg, #10B981, #0e9f6e)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} />
                </div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-color, #1a1a1a)' }}>{c.title}</h4>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted, #6b7280)', flex: 1 }}>{c.desc}</p>
                <Link to={c.link} className="adminBtn outline" style={{ alignSelf: 'flex-start' }}>
                  {c.linkText} →
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Database Seed Section */}
      <div className="adminPanel">
        <h3 className="adminPanelTitle">
          <Database size={18} style={{ marginRight: 8 }} />
          Database Management
        </h3>

        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 16,
          background: 'var(--bg-secondary, #f5f7fa)', borderRadius: 8, marginBottom: 16,
        }}>
          {seedStatus?.isEmpty ? (
            <>
              <AlertTriangle size={20} color="#f59e0b" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-color, #1a1a1a)' }}>
                  Database is empty
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted, #6b7280)' }}>
                  No products found. Click "Seed Database" below to populate with default data.
                </div>
              </div>
            </>
          ) : (
            <>
              <CheckCircle size={20} color="#10B981" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-color, #1a1a1a)' }}>
                  Database has data
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted, #6b7280)' }}>
                  {seedStatus ? `${seedStatus.products} products · ${seedStatus.categories} categories · ${seedStatus.users} users` : 'Loading…'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Seed button */}
        <div style={{
          border: '1px solid var(--border-color, #e5e7eb)', borderRadius: 8, padding: 20,
          background: 'var(--card-bg, #fff)',
        }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: 'var(--text-color, #1a1a1a)' }}>
            Seed / Reset Database
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-muted, #6b7280)', lineHeight: 1.5 }}>
            This will <strong>clear all existing data</strong> and re-populate the database with:
          </p>
          <ul style={{ margin: '0 0 16px', paddingLeft: 20, fontSize: 13, color: 'var(--text-color, #1a1a1a)', lineHeight: 1.8 }}>
            <li><strong>10 categories</strong> (Shirts, Pants, Jackets, etc.)</li>
            <li><strong>12 demo products</strong> with images, sizes, colors, prices</li>
            <li><strong>8 home slides</strong> (for the Best Sellers slider)</li>
            <li><strong>2 coupons</strong> (WELCOME10, SAVE25)</li>
            <li><strong>Admin user</strong> — admin@nexra.shop / Admin@123</li>
            <li><strong>Demo user</strong> — demo@nexra.shop / Demo@123</li>
          </ul>
          <button
            className="adminBtn primary"
            onClick={handleSeed}
            disabled={seeding}
            style={{ background: seeding ? '#9ca3af' : '#10B981' }}
          >
            <RefreshCw size={16} className={seeding ? 'spin' : ''} />
            {seeding ? 'Seeding…' : 'Seed Database'}
          </button>
          <p style={{ margin: '12px 0 0', fontSize: 11, color: '#f59e0b' }}>
            ⚠️ This action cannot be undone. All current products, orders, and users will be replaced.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="adminPanel">
        <h3 className="adminPanelTitle">How "Add Feature to Website" Works</h3>
        <div style={{ fontSize: 14, color: 'var(--text-color, #374151)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 12 }}>
            <strong>Admins can control what appears on the public website</strong> using the toggles in the
            Inventory page. Here's how each toggle affects the customer-facing site:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li style={{ marginBottom: 6 }}>
              <strong>Active</strong> — When ON, the product is visible on the store. When OFF, the product
              is hidden from all public pages (search, listings, related products) but remains in the database.
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Featured</strong> — When ON, the product appears in the "Best Sellers" slider on the
              home page. Use this to highlight your top products.
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>New Arrival</strong> — When ON, the product appears in the "New Products" section on
              the home page. Use this to showcase the latest inventory.
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Category Active</strong> — In the Categories page, toggling a category off hides it
              from the navigation menu, sidebar filters, and home page category slider.
            </li>
          </ul>
          <p>
            To add a new product to the home page slider, simply go to
            <Link to="/admin/products/new" style={{ color: '#10B981', margin: '0 4px' }}>Add Product</Link>
            (or edit an existing one) and turn ON the "Featured" toggle. The product will immediately appear
            in the home page "Best Sellers" carousel that all users see.
          </p>
        </div>
      </div>
    </>
  );
};

export default Settings;
