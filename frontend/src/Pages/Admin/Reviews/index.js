import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Star } from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

// Reviews admin page — pulls top products with reviews, lists them all in one view.
const Reviews = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch products that have reviews via the products endpoint
      // (the backend doesn't yet expose a reviews aggregator, but we can
      // fetch all products and filter client-side for the admin view)
      const res = await api.get('/api/products', { params: { page, limit: 30 } });
      const items = (res.data.data || []).filter((p) => p.reviews?.length > 0);
      setProducts(items);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.warn('Reviews load failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDeleteReview = async (productId, reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/api/products/${productId}/reviews/${reviewId}`);
      toast.success('Review deleted.');
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed.');
    }
  };

  // Flatten reviews across products for a single list view
  const allReviews = products.flatMap((p) =>
    (p.reviews || []).map((r) => ({ ...r, product: p }))
  );

  return (
    <div className="adminPanel">
      <h3 className="adminPanelTitle">
        <span>Reviews ({allReviews.length})</span>
      </h3>

      {loading ? (
        <div className="adminEmpty">Loading reviews…</div>
      ) : allReviews.length === 0 ? (
        <div className="adminEmpty">
          <Star size={48} />
          <p>No reviews yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {allReviews.map((r) => (
            <div
              key={r._id}
              style={{
                border: '1px solid #e5e7eb', borderRadius: 8, padding: 14,
                display: 'flex', gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <strong style={{ fontSize: 14 }}>{r.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#f59e0b' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < r.rating ? '#f59e0b' : 'none'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  to={`/product/${r.product.slug || r.product._id}`}
                  style={{ fontSize: 12, color: '#10B981', marginBottom: 6, display: 'block' }}
                >
                  on: {r.product.name}
                </Link>
                <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{r.comment}</p>
              </div>
              <button
                className="actionBtn danger"
                onClick={() => handleDeleteReview(r.product._id, r._id)}
                title="Delete review"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="adminPagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 10).map((n) => (
            <button key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
