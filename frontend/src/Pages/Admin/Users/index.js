import { useEffect, useState, useCallback } from 'react';
import { Search, UserCheck, UserX, Shield, ShieldOff } from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const res = await api.get('/api/users/admin/all', { params });
      setUsers(res.data.data || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.warn('Users load failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      await api.patch(`/api/users/admin/${u._id}/role`, { role: newRole });
      toast.success(`${u.name} is now ${newRole}`);
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed.');
    }
  };

  const toggleActive = async (u) => {
    try {
      await api.patch(`/api/users/admin/${u._id}/status`, { active: !u.active });
      toast.success(u.active ? 'User deactivated' : 'User activated');
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed.');
    }
  };

  return (
    <div className="adminPanel">
      <h3 className="adminPanelTitle"><span>Users ({total})</span></h3>

      <div className="adminSearchBar">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="nexraSelect"
        >
          <option value="">All roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="adminEmpty">Loading users…</div>
      ) : users.length === 0 ? (
        <div className="adminEmpty"><p>No users found.</p></div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: '#6b7280' }}>{u.email}</td>
                  <td>
                    <span className={`adminStatus ${u.role === 'admin' ? 'delivered' : 'processing'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`adminStatus ${u.active === false ? 'cancelled' : 'delivered'}`}>
                      {u.active === false ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="actionBtn"
                      onClick={() => toggleRole(u)}
                      title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                    >
                      {u.role === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </button>
                    <button
                      className="actionBtn danger"
                      onClick={() => toggleActive(u)}
                      title={u.active === false ? 'Activate' : 'Deactivate'}
                    >
                      {u.active === false ? <UserCheck size={14} /> : <UserX size={14} />}
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
            <button key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Users;
