import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, TrendingUp, Package, AlertTriangle, PackageX,
  Users, ShoppingCart, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import api from '../../../api/axios';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/dashboard');
      setData(res.data.data);
    } catch (err) {
      console.warn('Dashboard load failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="adminEmpty">
        <div>Loading dashboard…</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="adminEmpty">
        <AlertTriangle size={48} />
        <p>Could not load dashboard data. Make sure the backend is running.</p>
      </div>
    );
  }

  const { stats, salesTrend, topProducts, recentOrders, categoryCounts } = data;

  // Simple SVG line chart for sales trend
  const maxRevenue = Math.max(...salesTrend.map((s) => s.revenue), 1);
  const chartW = 600;
  const chartH = 200;
  const padding = 30;
  const points = salesTrend
    .map((s, i) => {
      const x = padding + (i * (chartW - padding * 2)) / Math.max(1, salesTrend.length - 1);
      const y = chartH - padding - ((s.revenue / maxRevenue) * (chartH - padding * 2));
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <>
      {/* Stat cards */}
      <div className="adminStatCards">
        <StatCard
          icon={<DollarSign />}
          variant="green"
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          trend={stats.revenueTrendPct}
        />
        <StatCard
          icon={<TrendingUp />}
          variant="blue"
          label="Products Sold"
          value={stats.productsSold}
          trend={stats.productsSoldTrendPct}
        />
        <StatCard
          icon={<AlertTriangle />}
          variant="orange"
          label="Low Stock Items"
          value={stats.lowStockCount}
          trend={null}
          invertTrend
        />
        <StatCard
          icon={<PackageX />}
          variant="red"
          label="Out of Stock"
          value={stats.outOfStockCount}
          trend={null}
          invertTrend
        />
      </div>

      {/* Secondary mini-stats */}
      <div className="adminStatCards" style={{ marginBottom: 16 }}>
        <MiniStat icon={<Package />} label="Total Products" value={stats.totalProducts} variant="green" />
        <MiniStat icon={<Users />} label="Total Users" value={stats.totalUsers} variant="blue" />
        <MiniStat icon={<ShoppingCart />} label="Total Orders" value={stats.totalOrders} variant="orange" />
        <MiniStat icon={<ShoppingCart />} label="Pending Orders" value={stats.pendingOrders} variant="red" />
      </div>

      {/* Charts row */}
      <div className="adminChartRow">
        <div className="adminPanel">
          <h3 className="adminPanelTitle">
            Sales Overview (Last 6 Months)
            <Link to="/admin/orders" className="adminBtn outline" style={{ fontSize: 12, padding: '6px 12px' }}>
              View Orders
            </Link>
          </h3>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto' }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => {
              const y = padding + p * (chartH - padding * 2);
              return (
                <g key={p}>
                  <line x1={padding} y1={y} x2={chartW - padding} y2={y}
                    stroke="#f3f4f6" strokeWidth={1} />
                  <text x={padding - 5} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
                    ${Math.round(maxRevenue * (1 - p) / 1000)}k
                  </text>
                </g>
              );
            })}
            {/* Area fill */}
            <polygon
              points={`${padding},${chartH - padding} ${points} ${chartW - padding},${chartH - padding}`}
              fill="rgba(16, 185, 129, 0.12)"
            />
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="#10B981"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Points + labels */}
            {salesTrend.map((s, i) => {
              const x = padding + (i * (chartW - padding * 2)) / Math.max(1, salesTrend.length - 1);
              const y = chartH - padding - ((s.revenue / maxRevenue) * (chartH - padding * 2));
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={4} fill="#10B981" stroke="#fff" strokeWidth={2} />
                  <text x={x} y={chartH - padding + 16} textAnchor="middle" fontSize={10} fill="#6b7280">
                    {s.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="adminPanel">
          <h3 className="adminPanelTitle">Category Distribution</h3>
          {categoryCounts.length === 0 ? (
            <div className="adminEmpty" style={{ padding: 24 }}>
              <p>No products yet.</p>
            </div>
          ) : (
            categoryCounts.slice(0, 8).map((c) => {
              const total = categoryCounts.reduce((a, x) => a + x.count, 0) || 1;
              const pct = Math.round((c.count / total) * 100);
              return (
                <div key={c.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500 }}>{c.name}</span>
                    <span style={{ color: '#6b7280' }}>{c.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#10B981' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Top products + recent orders */}
      <div className="adminChartRow">
        <div className="adminPanel">
          <h3 className="adminPanelTitle">
            Top Selling Products
            <Link to="/admin/inventory" className="adminBtn outline" style={{ fontSize: 12, padding: '6px 12px' }}>
              View All
            </Link>
          </h3>
          {topProducts.length === 0 ? (
            <div className="adminEmpty" style={{ padding: 24 }}><p>No sales yet.</p></div>
          ) : (
            topProducts.map((p) => (
              <div key={p._id} className="adminTopProductItem">
                <img src={p.image || 'https://placehold.co/48x48/f3f4f6/999999?text=No'} alt={p.name} />
                <div className="info">
                  <h6>{p.name}</h6>
                  <span className="sub">{p.sold} sold · {p.stock} in stock</span>
                </div>
                <div className="revenue">${p.revenue.toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        <div className="adminPanel">
          <h3 className="adminPanelTitle">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <div className="adminEmpty" style={{ padding: 24 }}><p>No orders yet.</p></div>
          ) : (
            recentOrders.map((o) => (
              <div key={o._id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderBottom: '1px solid #f3f4f6',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a' }}>
                    {o.orderNumber}
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>
                    {o.user?.name || 'Unknown'} · {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`adminStatus ${o.status}`}>{o.status}</span>
                <div style={{ fontWeight: 700, color: '#10B981', fontSize: 13 }}>
                  ${o.total.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, label, value, trend, variant, invertTrend }) => (
  <div className="adminStatCard">
    <div className={`statIcon ${variant}`}>{icon}</div>
    <div className="statBody">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
      {trend !== null && trend !== undefined && (
        <div className={`statTrend ${(invertTrend ? trend < 0 : trend >= 0) ? 'up' : 'down'}`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}% vs last month
        </div>
      )}
    </div>
  </div>
);

const MiniStat = ({ icon, label, value, variant }) => (
  <div className="adminStatCard" style={{ padding: 14 }}>
    <div className={`statIcon ${variant}`} style={{ width: 40, height: 40, fontSize: 18 }}>
      {icon}
    </div>
    <div className="statBody">
      <div className="statLabel">{label}</div>
      <div className="statValue" style={{ fontSize: 18 }}>{value}</div>
    </div>
  </div>
);

export default Dashboard;
