import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Truck, CheckCircle, XCircle, Package } from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewOrder, setViewOrder] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/api/orders/admin/all', { params });
      let items = res.data.data || [];
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(
          (o) =>
            o.orderNumber?.toLowerCase().includes(q) ||
            o.user?.name?.toLowerCase().includes(q) ||
            o.user?.email?.toLowerCase().includes(q)
        );
      }
      setOrders(items);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.warn('Orders load failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${STATUS_LABELS[newStatus]}`);
      load();
      if (viewOrder?._id === orderId) {
        setViewOrder({ ...viewOrder, status: newStatus });
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update order status.');
    }
  };

  return (
    <>
      <div className="adminPanel">
        <h3 className="adminPanelTitle">
          <span>Orders ({total})</span>
        </h3>

        <div className="adminSearchBar">
          <input
            type="text"
            placeholder="Search by order #, customer name, or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
          >
            <option value="">All statuses</option>
            {STATUS_FLOW.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="adminEmpty">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="adminEmpty">
            <Package size={48} />
            <p>No orders found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600 }}>{o.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{o.user?.name || '—'}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{o.user?.email}</div>
                    </td>
                    <td>{o.items?.length || 0}</td>
                    <td style={{ fontWeight: 600, color: '#10B981' }}>${o.total?.toFixed(2)}</td>
                    <td>
                      <span className={`adminStatus ${o.paymentStatus}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`adminStatus ${o.status}`}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {STATUS_FLOW.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="actionBtn" title="View" onClick={() => setViewOrder(o)}>
                        <Eye size={14} />
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
            {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 10).map((n) => (
              <button key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
            <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {viewOrder && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: 16,
          }}
          onClick={() => setViewOrder(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: 12, padding: 24,
              maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                {viewOrder.orderNumber}
              </h3>
              <button className="adminBtn secondary" onClick={() => setViewOrder(null)}>Close</button>
            </div>

            <div style={{ marginBottom: 16, fontSize: 13, color: '#374151' }}>
              <strong>Customer:</strong> {viewOrder.user?.name} ({viewOrder.user?.email})<br />
              <strong>Date:</strong> {new Date(viewOrder.createdAt).toLocaleString()}<br />
              <strong>Payment:</strong> {viewOrder.paymentMethod.toUpperCase()} ({viewOrder.paymentStatus})
            </div>

            <h5 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Shipping Address</h5>
            <div style={{ fontSize: 13, color: '#374151', marginBottom: 16, lineHeight: 1.6 }}>
              {viewOrder.shippingAddress?.fullName}<br />
              {viewOrder.shippingAddress?.line1}<br />
              {viewOrder.shippingAddress?.line2 && <>{viewOrder.shippingAddress.line2}<br /></>}
              {viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.state} {viewOrder.shippingAddress?.postalCode}<br />
              {viewOrder.shippingAddress?.country}<br />
              Phone: {viewOrder.shippingAddress?.phone}
            </div>

            <h5 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Items</h5>
            <div style={{ marginBottom: 16 }}>
              {viewOrder.items?.map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <img
                    src={it.image || 'https://placehold.co/40x40/f3f4f6/999999?text=No'}
                    alt={it.name}
                    style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{it.name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>
                      Qty: {it.quantity}
                      {it.size ? ` · Size: ${it.size}` : ''}
                      {it.color ? ` · Color: ${it.color}` : ''}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Subtotal:</span><span>${viewOrder.subtotal?.toFixed(2)}</span>
              </div>
              {viewOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#ef4444' }}>
                  <span>Discount:</span><span>-${viewOrder.discount?.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Shipping:</span>
                <span>{viewOrder.shippingCost === 0 ? 'Free' : `$${viewOrder.shippingCost?.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Tax:</span><span>${viewOrder.tax?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: '#10B981', marginTop: 8 }}>
                <span>Total:</span><span>${viewOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            {viewOrder.notes && (
              <div style={{ marginTop: 12, padding: 10, background: '#f9fafb', borderRadius: 8, fontSize: 13 }}>
                <strong>Notes:</strong> {viewOrder.notes}
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Update Status
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(viewOrder._id, s)}
                    className={`adminBtn ${viewOrder.status === s ? 'primary' : 'secondary'}`}
                    style={{ fontSize: 12, padding: '6px 12px' }}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
