import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!form.agree) {
      toast.error("Please accept the terms and privacy.");
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err?.message || 'Registration failed.');
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

          <h5 className="auth-title text-center mb-4">Create your account</h5>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <div className="input-group-custom">
                <User className="input-icon-left" />
                <input
                  type="text"
                  className="custom-input"
                  name="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

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
              <label>Password</label>
              <div className="input-group-custom">
                <Lock className="input-icon-left" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="custom-input"
                  name="password"
                  placeholder="Create a password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  minLength={6}
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

            <div className="form-group">
              <label>Confirm password</label>
              <div className="input-group-custom">
                <Lock className="input-icon-left" />
                <input
                  type={showConfirm ? "text" : "password"}
                  className="custom-input"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle confirm visibility"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                required
              />
              <label className="form-check-label">I agree to the terms and privacy</label>
            </div>

            <button type="submit" className="auth-btn" disabled={submitting}>
              {submitting ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <div className="auth-footer mt-3 text-center">
            <small>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">Sign in</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
