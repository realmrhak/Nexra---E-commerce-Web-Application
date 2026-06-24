import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.message || 'Could not send reset email.');
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

          {!submitted ? (
            <>
              <h5 className="auth-title text-center mb-2">Forgot your password?</h5>
              <p className="text-center text-muted mb-4" style={{ fontSize: "14px" }}>
                Enter your email and we'll send you a reset link
              </p>

              <form onSubmit={handleSubmit}>
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
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={submitting}>
                  {submitting ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h5 className="auth-title text-center mb-2">Check your email</h5>
              <p className="text-center text-muted mb-4" style={{ fontSize: "14px" }}>
                If an account exists for <strong>{email}</strong>, a password reset link has been sent.
              </p>
            </>
          )}

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
