import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, includeInactive: true };
      if (search) params.search = search;
      // Admin should see all products including inactive — backend reads the
      // includeInactive flag and the JWT role to decide.
      const res = await api.get('/api/products', { params });
      setProducts(res.data.data || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.warn('Inventory load failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/products/${deleteTarget._id}`);
      toast.success(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete product.');
    }
  };

  const handleToggleFeatured = async (p) => {
    try {
      await api.put(`/api/products/${p._id}`, { isFeatured: !p.isFeatured });
      toast.success(p.isFeatured ? 'Removed from featured' : 'Added to featured');
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed.');
    }
  };

  const handleToggleNew = async (p) => {
    try {
      await api.put(`/api/products/${p._id}`, { isNew: !p.isNew });
      toast.success(p.isNew ? 'Removed from new arrivals' : 'Added to new arrivals');
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed.');
    }
  };

  return (
    <>
      <div className="adminPanel">
        <h3 className="adminPanelTitle">
          <span>Products ({total})</span>
          <div className="actions">
            <Link to="/admin/products/new" className="adminBtn primary">
              <Plus size={16} /> Add Product
            </Link>
          </div>
        </h3>

        <div className="adminSearchBar">
          <input
            type="text"
            placeholder="Search by name, brand, or tag…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {loading ? (
          <div className="adminEmpty">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="adminEmpty">
            <AlertTriangle size={48} />
            <p>No products found. Try a different search, or add a new product.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Featured</th>
                  <th>New</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.images?.[0]?.url || 'https://placehold.co/44x44/f3f4f6/999999?text=No'}
                        alt={p.name}
                        className="prodThumb"
                        loading="lazy"
                      />
                    </td>
                    <td>
                      <div className="prodName">
                        {p.name}
                      </div>
                      {p.images?.length === 0 && (
                        <span className="prodNoImage">
                          <ImageIcon size={11} /> No image
                        </span>
                      )}
                    </td>
                    <td>{p.brand || '—'}</td>
                    <td>${p.price?.toFixed(2)}</td>
                    <td>
                      <span style={{
                        color: p.stock === 0 ? '#ef4444' : p.stock <= 10 ? '#f59e0b' : '#10B981',
                        fontWeight: 600,
                      }}>
                        {p.stock}
                      </span>
                    </td>
                    <td>{p.sold || 0}</td>
                    <td>
                      <label className="adminToggle">
                        <input
                          type="checkbox"
                          checked={!!p.isFeatured}
                          onChange={() => handleToggleFeatured(p)}
                        />
                        <span className="toggleSlider" />
                      </label>
                    </td>
                    <td>
                      <label className="adminToggle">
                        <input
                          type="checkbox"
                          checked={!!p.isNew}
                          onChange={() => handleToggleNew(p)}
                        />
                        <span className="toggleSlider" />
                      </label>
                    </td>
                    <td>
                      <Link to={`/admin/products/${p._id}/edit`} className="actionBtn" title="Edit">
                        <Pencil size={14} />
                      </Link>
                      <button
                        className="actionBtn danger"
                        title="Delete"
                        onClick={() => setDeleteTarget(p)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="adminPagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={n === page ? 'active' : ''}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 16,
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 400, width: '100%' }}>
            <h4 style={{ marginBottom: 8, fontSize: 16, fontWeight: 600 }}>Delete product?</h4>
            <p style={{ marginBottom: 20, color: '#6b7280', fontSize: 14 }}>
              Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="adminBtn secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="adminBtn danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;
