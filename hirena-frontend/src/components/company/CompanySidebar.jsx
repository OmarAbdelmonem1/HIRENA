import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import logoFull from "../../assets/hirena-logo-full.svg";

export default function CompanySidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const link = ({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`;
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <img src={logoFull} alt="HIRENA" className="sidebar-logo-image" />
      </div>
      <div className="sidebar-section">
        <p className="sidebar-title">COMPANY</p>
        <NavLink to="/company/dashboard" className={link}>
          <span className="sidebar-icon">▦</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/company/jobs" className={link}>
          <span className="sidebar-icon">▣</span>
          <span>My Jobs</span>
        </NavLink>
        <NavLink to="/company/applications" className={link}>
          <span className="sidebar-icon">▤</span>
          <span>Applications</span>
        </NavLink>
        <NavLink to="/company/profile" className={link}>
          <span className="sidebar-icon">◉</span>
          <span>Company Profile</span>
        </NavLink>
        <NavLink to="/company/notifications" className={link}>
          <span className="sidebar-icon">♢</span>
          <span>Notifications</span>
        </NavLink>
      </div>
      <div className="sidebar-bottom">
        <button
          className="logout-button"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <span className="sidebar-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
