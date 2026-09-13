import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import logoFull from '../../assets/hirena-logo-full.svg';

export default function Navbar() {
  const { user, logout } = useAuth(); const navigate = useNavigate(); const [open, setOpen] = useState(false);
  const link = ({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`;
  const signOut = () => { logout(); navigate('/login'); };
  return <header className="main-navbar"><div className="main-nav-inner"><NavLink to="/" className="main-logo"><img src={logoFull} alt="HIRENA" /></NavLink><button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">☰</button><nav className={`main-nav-menu ${open ? 'open' : ''}`}><NavLink end to="/" className={link} onClick={() => setOpen(false)}>Home</NavLink><NavLink to="/jobs" className={link} onClick={() => setOpen(false)}>Jobs</NavLink><NavLink to="/companies" className={link} onClick={() => setOpen(false)}>Companies</NavLink>{user && <NavLink to="/applications" className={link} onClick={() => setOpen(false)}>Applications</NavLink>}</nav><div className="nav-actions">{user ? <><NavLink to="/notifications" className="nav-bell" aria-label="Notifications">♧</NavLink><NavLink to="/profile" className="nav-profile"><span className="nav-avatar">{(user.email || 'U').charAt(0).toUpperCase()}</span><span>Profile</span><span className="nav-chevron">⌄</span></NavLink><button className="nav-logout" onClick={signOut}>Logout</button></> : <><Link to="/login" className="nav-login">Sign in</Link><Link to="/register" className="nav-register">Get started</Link></>}</div></div></header>;
}
