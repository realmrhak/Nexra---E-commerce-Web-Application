import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import ProductItem from '../../Components/ProductItem';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users/me/wishlist');
      setItems(res.data.data || []);
    } catch (err) {
      console.warn('Wishlist load failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const handleDelete = (deletedId) => {
    setItems((prev) => prev.filter((p) => p._id !== deletedId));
    // Also remove from server wishlist
    api.delete(`/api/users/me/wishlist/${deletedId}`).catch(() => {});
  };

  if (!isAuthenticated) {
    return (
      <section className="section" style={{ padding: '60px 0' }}>
        <div className="container text-center">
          <Heart size={64} style={{ opacity: 0.3, marginBottom: 16 }} />
          <h2>Please log in to view your wishlist</h2>
          <Link to="/login" className="adminBtn primary" style={{ marginTop: 16, display: 'inline-flex' }}>
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="d-flex align-items-center mb-4 flex-wrap" style={{ gap: 8 }}>
          <div style={{ flex: 1 }}>
            <h2 className="hd mb-0" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Heart size={22} color="#10B981" /> My Wishlist
            </h2>
            <p className="text-light text-sml mb-0">
              {loading ? 'Loading…' : `${items.length} item(s) in your wishlist`}
            </p>
          </div>
          <Link to="/shop" className="adminBtn outline">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading wishlist…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-5" style={{
            background: 'var(--card-bg, #fff)', borderRadius: 12, padding: 60,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <Heart size={64} style={{ opacity: 0.2, marginBottom: 16 }} />
            <h4 style={{ color: 'var(--text-color, #1a1a1a)', marginBottom: 8 }}>Your wishlist is empty</h4>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link to="/shop" className="adminBtn primary" style={{ display: 'inline-flex' }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="productGrid">
            {items.map((product) => (
              <ProductItem
                key={product._id}
                itemView="four"
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
