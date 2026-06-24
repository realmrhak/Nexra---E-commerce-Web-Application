import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      // Redirect to wherever the user came from, or home
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } catch (err) {
      toast.error(err?.message || 'Login failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-logo text-center mb-3">
            <h4 className="auth-brand">
              Ne<span className="brand-x">x</span>ra
            </h4>
            <small>Inventory App</small>
          </div>

          <h5 className="auth-title text-center mb-4">Sign in to your account</h5>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <div className="input-group-custom">
                <Mail className="input-icon-left" />
                <input
                  type="email"
                  className="custom-input"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="d-flex justify-content-between">
                <label>Password</label>
              </div>
              <div className="input-group-custom">
                <Lock className="input-icon-left" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="custom-input"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                <label className="form-check-label">Remember me</label>
              </div>
              <Link to="/forgot-password" className="auth-link small-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-btn" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-footer mt-3 text-center">
            <small>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">Sign up</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
