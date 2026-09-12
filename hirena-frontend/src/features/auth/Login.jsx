import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { getRouteByRole } from '../../constants/routes';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!auth) {
      console.error('Auth context is null — AuthProvider not found');
      setError('Authentication provider not available. Make sure App is wrapped with AuthProvider.');
      return;
    }

    try {
const user = await auth.login(email, password);

navigate(getRouteByRole(user.role), {
  replace: true,
});
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div style={{maxWidth: 420}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div style={{marginBottom:8}}>
          <label>
            Email
            <br />
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>
        <div style={{marginBottom:8}}>
          <label>
            Password
            <br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
        </div>
        <button type="submit">Sign in</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <p style={{marginTop:12}}>Note: backend base URL is taken from VITE_API_BASE_URL (e.g. http://localhost:8080). If left blank, requests go to /api/... relative to the frontend host.</p>
    </div>
  );
}
