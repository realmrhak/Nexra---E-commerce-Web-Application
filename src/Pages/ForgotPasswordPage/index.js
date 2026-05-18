import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later connect with API
    console.log("Reset link sent to:", email);

    setSubmitted(true);
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

          {!submitted ? (
            <>
              <h5 className="auth-title text-center mb-2">
                Forgot your password?
              </h5>

              <p className="text-center text-muted mb-4" style={{ fontSize: "14px" }}>
                Enter your email and we’ll send you a reset link
              </p>

              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="form-group">
                  <label>Email address</label>
                  <div className="input-group-custom">
                    <Mail className="input-icon-left" />
                    <input
                      type="email"
                      className="custom-input"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Button */}
                <button type="submit" className="auth-btn">
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <h5 className="auth-title text-center mb-2">
                Check your email
              </h5>

              <p className="text-center text-muted mb-4" style={{ fontSize: "14px" }}>
                We’ve sent a password reset link to <strong>{email}</strong>
              </p>
            </>
          )}

          {/* Back to Login */}
          <div className="auth-footer mt-3 text-center">
            <Link to="/login" className="auth-link d-inline-flex align-items-center">
              <ArrowLeft size={16} className="mr-1" />
              Back to Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;