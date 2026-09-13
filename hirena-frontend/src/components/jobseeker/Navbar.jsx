import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import logoFull from "../../assets/hirena-logo-full.svg";
import { getUnreadNotificationCount } from "../../features/jobseeker/Services/jobseekerService";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    if (user?.role === "JOB_SEEKER" && token)
      getUnreadNotificationCount()
        .then((data) => setUnread(data.count || 0))
        .catch(() => setUnread(0));
  }, [user, token]);
  const link = ({ isActive }) => `main-nav-link ${isActive ? "active" : ""}`;
  const signOut = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="main-navbar">
      <div className="main-nav-inner">
        <NavLink to="/" className="main-logo">
          <img src={logoFull} alt="HIRENA" />
        </NavLink>
        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <nav className={`main-nav-menu ${open ? "open" : ""}`}>
          <NavLink end to="/" className={link} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/jobs" className={link} onClick={() => setOpen(false)}>
            Jobs
          </NavLink>
          <NavLink
            to="/companies"
            className={link}
            onClick={() => setOpen(false)}
          >
            Companies
          </NavLink>
          {user && (
            <NavLink
              to="/applications"
              className={link}
              onClick={() => setOpen(false)}
            >
              Applications
            </NavLink>
          )}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <NavLink
                to="/notifications"
                className={({ isActive }) => `nav-bell ${isActive ? "active" : ""}`}
                aria-label="Notifications"
                title={unread ? `${unread} unread notifications` : "Notifications"}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8.5h18C21 16 18 16 18 9Zm-8.5 11h5" />
                </svg>
                {unread > 0 && (
                  <span className="nav-notification-count">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </NavLink>
              <NavLink to="/profile" className="nav-profile">
                <span className="nav-avatar">
                  {(user.email || "U").charAt(0).toUpperCase()}
                </span>
                <span>Profile</span>
                <span className="nav-chevron">⌄</span>
              </NavLink>
              <button className="nav-logout" onClick={signOut}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">
                Sign in
              </Link>
              <Link to="/register" className="nav-register">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
