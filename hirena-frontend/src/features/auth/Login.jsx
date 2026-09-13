import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { getRouteByRole } from "../../constants/routes";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await auth.login(form.email, form.password);
      navigate(location.state?.from?.pathname || getRouteByRole(user.role), {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Link to="/" className="auth-logo">
          HIRENA
        </Link>
        <div>
          <span className="hero-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Make your next move count.</h1>
          <p>
            Find meaningful work with teams that are building what comes next.
          </p>
        </div>
        <span className="auth-quote">
          “The right opportunity changes everything.”
        </span>
      </div>
      <div className="auth-card-wrap">
        <form className="auth-card" onSubmit={submit}>
          <Link to="/" className="auth-mobile-logo">
            HIRENA
          </Link>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to HIRENA</h2>
          <p className="auth-intro">
            Continue exploring opportunities made for you.
          </p>
          {error && <p className="form-error">{error}</p>}
          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </label>
          <button className="primary-button auth-submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <p className="auth-switch">
            New to HIRENA? <Link to="/register">Create a free account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
