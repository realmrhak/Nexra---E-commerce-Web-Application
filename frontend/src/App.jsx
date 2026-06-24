import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './Layouts/AuthLayout';
import MainLayout from './Layouts/MainLayout';
import AdminLayout from './Layouts/AdminLayout';
import Home from './Pages/Home';
import Listing from './Pages/Listing';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import OrderConfirmation from './Pages/OrderConfirmation';
import UserProfile from './Pages/Profile';
import Wishlist from './Pages/Wishlist';

// Admin pages
import AdminDashboard from './Pages/Admin/Dashboard';
import AdminInventory from './Pages/Admin/Inventory';
import AdminProductForm from './Pages/Admin/ProductForm';
import AdminOrders from './Pages/Admin/Orders';
import AdminCategories from './Pages/Admin/Categories';
import AdminUsers from './Pages/Admin/Users';
import AdminReviews from './Pages/Admin/Reviews';
import AdminSettings from './Pages/Admin/Settings';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/**
 * Block routes that require an authenticated user.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

/**
 * Block routes that require an admin user.
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* MAIN APP PAGES */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Listing />} />
                  <Route path="/shop/:id" element={<Listing />} />
                  <Route path="/category/:slug" element={<Listing />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order/:id"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* AUTH PAGES */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* ADMIN PAGES */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="products/new" element={<AdminProductForm mode="create" />} />
                  <Route path="products/:id/edit" element={<AdminProductForm mode="edit" />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
