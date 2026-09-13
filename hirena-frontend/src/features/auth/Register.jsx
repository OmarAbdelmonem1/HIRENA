import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirmation: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await auth.register(form.email, form.password);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="auth-page"><div className="auth-visual"><Link to="/" className="auth-logo">HIRENA</Link><div><span className="hero-kicker">START YOUR JOURNEY</span><h1>Your future is waiting.</h1><p>Create your account in seconds. Complete your profile whenever you are ready.</p></div><span className="auth-quote">No experience? No problem. Just bring your ambition.</span></div><div className="auth-card-wrap"><form className="auth-card" onSubmit={submit}><Link to="/" className="auth-mobile-logo">HIRENA</Link><span className="eyebrow">JOIN HIRENA</span><h2>Create your account</h2><p className="auth-intro">Start with your email and password. You can complete the rest of your profile later.</p>{error && <p className="form-error">{error}</p>}<label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /></label><label>Password<input type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" required /></label><label>Confirm password<input type="password" minLength="6" value={form.confirmation} onChange={(e) => setForm({ ...form, confirmation: e.target.value })} placeholder="Repeat your password" required /></label><button className="primary-button auth-submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create job seeker account'}</button><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></form></div></div>;
}
