import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/api/cart');
      setCart(res.data.data);
    } catch {
      // ignore — handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1, size = '', color = '') => {
      const res = await api.post('/api/cart', { productId, quantity, size, color });
      setCart(res.data.data);
      toast.success('Added to cart!');
      return res.data.data;
    },
    []
  );

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const res = await api.patch(`/api/cart/${itemId}`, { quantity });
    setCart(res.data.data);
    return res.data.data;
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const res = await api.delete(`/api/cart/${itemId}`);
    setCart(res.data.data);
    toast.success('Item removed.');
    return res.data.data;
  }, []);

  const clearCart = useCallback(async () => {
    await api.delete('/api/cart');
    setCart(null);
    await fetchCart();
  }, [fetchCart]);

  // Derived: total item count
  const itemCount = cart?.items?.reduce((acc, it) => acc + it.quantity, 0) || 0;
  const subtotal = cart?.items?.reduce((acc, it) => acc + it.price * it.quantity, 0) || 0;

  const value = {
    cart,
    loading,
    itemCount,
    subtotal,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;
