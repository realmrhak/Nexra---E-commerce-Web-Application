import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, Heart, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [orders, setOrders] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const loadOrders = useCallback(async () => {
    try {
      const res = await api.get('/api/orders?limit=5');
      setOrders(res.data.data || []);
    } catch (err) {
      console.warn('Orders load failed:', err.message);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/api/users/me', form);
      updateUser(res.data.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <section className="section profilePage" style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="profileSidebar" style={{
              background: 'var(--card-bg, #fff)',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: '#10B981', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 700, margin: '0 auto 12px',
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{user?.name}</h4>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>{user?.email}</p>
                {user?.role === 'admin' && (
                  <span style={{
                    display: 'inline-block', marginTop: 8, padding: '3px 10px',
                    background: '#d1fae5', color: '#065f46', borderRadius: 12,
                    fontSize: 11, fontWeight: 600,
                  }}>ADMIN</span>
                )}
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tabs.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', borderRadius: 8, border: 'none',
                        background: activeTab === t.id ? '#10B981' : 'transparent',
                        color: activeTab === t.id ? '#fff' : 'var(--text-color, #374151)',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        textAlign: 'left', textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={16} /> {t.label}
                    </button>
                  );
                })}
                <Link to="/wishlist" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 8,
                  background: 'transparent', color: 'var(--text-color, #374151)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  textAlign: 'left', textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}>
                  <Heart size={16} /> Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 8, border: 'none',
                    background: 'transparent', color: '#ef4444',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    textAlign: 'left', marginTop: 8,
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="col-md-9">
            {activeTab === 'profile' && (
              <div style={{
                background: 'var(--card-bg, #fff)', borderRadius: 12, padding: 28,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600 }}>
                  Update Profile
                </h3>
                <form onSubmit={handleSave} className="adminForm">
                  <div className="adminFormRow">
                    <div className="formGroup">
                      <label><User size={14} style={{ display: 'inline', marginRight: 4 }} />Full Name</label>
                      <input type="text" name="name" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="formGroup">
                      <label><Mail size={14} style={{ display: 'inline', marginRight: 4 }} />Email</label>
                      <input type="email" name="email" value={form.email} disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                  </div>
                  <div className="formGroup">
                    <label><Phone size={14} style={{ display: 'inline', marginRight: 4 }} />Phone</label>
                    <input type="tel" name="phone" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 234 567 890" />
                  </div>
                  <button type="submit" className="adminBtn primary" disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div style={{
                background: 'var(--card-bg, #fff)', borderRadius: 12, padding: 28,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600 }}>Recent Orders</h3>
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                    <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <p>No orders yet.</p>
                    <Link to="/shop" className="adminBtn primary" style={{ display: 'inline-flex', marginTop: 12 }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {orders.map((o) => (
                      <Link to={`/order/${o._id}`} key={o._id} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                        border: '1px solid #e5e7eb', borderRadius: 8,
                        textDecoration: 'none', color: 'inherit',
                        transition: 'box-shadow 0.15s ease',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-color, #1a1a1a)' }}>
                            {o.orderNumber}
                          </div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>
                            {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)
                          </div>
                        </div>
                        <span className={`adminStatus ${o.status}`}>{o.status}</span>
                        <div style={{ fontWeight: 700, color: '#10B981' }}>${o.total.toFixed(2)}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div style={{
                background: 'var(--card-bg, #fff)', borderRadius: 12, padding: 28,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600 }}>Saved Addresses</h3>
                {addresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                    <MapPin size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <p>No saved addresses yet. They'll appear here after your first order.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {addresses.map((addr, i) => (
                      <div key={i} style={{
                        border: '1px solid #e5e7eb', borderRadius: 8, padding: 16,
                        position: 'relative',
                      }}>
                        {addr.isDefault && (
                          <span style={{
                            position: 'absolute', top: 8, right: 8, padding: '2px 8px',
                            background: '#d1fae5', color: '#065f46', borderRadius: 10,
                            fontSize: 10, fontWeight: 600,
                          }}>DEFAULT</span>
                        )}
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{addr.fullName}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                          {addr.line1}<br />
                          {addr.line2 && <>{addr.line2}<br /></>}
                          {addr.city}, {addr.state} {addr.postalCode}<br />
                          {addr.country}<br />
                          {addr.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
