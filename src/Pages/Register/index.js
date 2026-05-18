import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(form);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-wrapper">
        <div className="auth-card">

          {/* Logo */}
          <div className="auth-logo text-center mb-3">
            <h4 className="auth-brand">
              Ne<span className="brand-x">x</span>ra
            </h4>
            <small>Inventory App</small>
          </div>

          <h5 className="auth-title text-center mb-4">
            Create your account
          </h5>

          <form onSubmit={handleSubmit}>

            {/* Name */}
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
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-group-custom">
                <Lock className="input-icon-left" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="custom-input"
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
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
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                required
              />
              <label className="form-check-label">
                I agree to the terms and privacy
              </label>
            </div>

            {/* Button */}
            <button type="submit" className="auth-btn">
              Sign up
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer mt-3 text-center">
            <small>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </small>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;