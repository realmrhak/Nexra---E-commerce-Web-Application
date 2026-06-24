import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on mount, and refresh from server
  useEffect(() => {
    const stored = localStorage.getItem('nexra_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('nexra_user');
      }
    }

    const token = localStorage.getItem('nexra_token');
    if (token) {
      api
        .get('/api/auth/me')
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('nexra_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem('nexra_token');
          localStorage.removeItem('nexra_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('nexra_token', token);
    localStorage.setItem('nexra_user', JSON.stringify(user));
    setUser(user);
    toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    return user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('nexra_token', token);
    localStorage.setItem('nexra_user', JSON.stringify(user));
    setUser(user);
    toast.success(`Welcome to Nexra, ${user.name.split(' ')[0]}!`);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // ignore — clear local state regardless
    }
    localStorage.removeItem('nexra_token');
    localStorage.removeItem('nexra_user');
    setUser(null);
    toast.success('Logged out.');
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem('nexra_user', JSON.stringify(updated));
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
