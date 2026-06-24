import { useState, useEffect, useCallback, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { Search, X, Check, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

/**
 * ProductPickerModal — lets an admin pick a product from the catalog.
 *
 * Props:
 *   open        : boolean — whether the modal is visible
 *   onClose     : () => void
 *   onSelect    : (productId) => void — called when admin confirms selection
 *   excludeIds  : string[] — product IDs to hide (e.g. already in slider)
 *   title       : string — modal title
 *   currentId   : string — currently selected product (highlighted)
 */
const ProductPickerModal = ({ open, onClose, onSelect, excludeIds = [], title = 'Pick a product', currentId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const searchTimer = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 24, includeInactive: true };
      if (search) params.search = search;
      const res = await api.get('/api/products', { params });
      // Filter out excluded IDs client-side
      const filtered = (res.data.data || []).filter(
        (p) => !excludeIds.includes(p._id)
      );
      setProducts(filtered);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.warn('Product picker load failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, excludeIds.join(',')]);

  useEffect(() => {
    if (open) {
      setSelected(currentId || null);
      setSearch('');
      setPage(1);
      load();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) load();
  }, [load, open]);

  // Debounce search
  const handleSearch = (val) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setPage(1), 300);
  };

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>
            {title}
          </h3>
          <Button onClick={onClose} style={{ minWidth: 'auto', padding: 4 }}>
            <X size={20} />
          </Button>
        </div>

        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', marginBottom: 16,
        }}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by product name, brand, or tag…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent',
            }}
          />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{total} products</span>
        </div>

        {/* Product grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            <AlertCircle size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
            <p>No products found. Try a different search, or create a product first in the admin dashboard.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
            maxHeight: 400,
            overflowY: 'auto',
            padding: 4,
          }}>
            {products.map((p) => {
              const isSelected = selected === p._id;
              const img = p.images?.[0]?.url || 'https://placehold.co/120x150/f3f4f6/999999?text=No+Image';
              return (
                <div
                  key={p._id}
                  onClick={() => setSelected(p._id)}
                  style={{
                    border: isSelected ? '2px solid #10B981' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 8,
                    cursor: 'pointer',
                    background: isSelected ? '#f0fdf4' : '#fff',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 22, height: 22, borderRadius: '50%',
                      background: '#10B981', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={14} />
                    </div>
                  )}
                  <div style={{
                    width: '100%', aspectRatio: '4/5',
                    background: '#f3f4f6', borderRadius: 6, overflow: 'hidden', marginBottom: 6,
                  }}>
                    <img
                      src={img}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: '#1a1a1a',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    lineHeight: 1.3,
                  }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>
                    ${p.price?.toFixed(2)}
                    {p.stock === 0 && (
                      <span style={{ color: '#ef4444', marginLeft: 4 }}>• Out</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            <button
              className="adminBtn secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span style={{ padding: '6px 12px', fontSize: 13, color: '#6b7280' }}>
              Page {page} of {pages}
            </span>
            <button
              className="adminBtn secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
          <button className="adminBtn secondary" onClick={onClose}>Cancel</button>
          <button
            className="adminBtn primary"
            onClick={handleConfirm}
            disabled={!selected}
            style={{ opacity: selected ? 1 : 0.5 }}
          >
            <Check size={16} /> Confirm Selection
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductPickerModal;
