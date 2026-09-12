import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-mark">H</span>
        <div><h2>HIRENA</h2><span>ADMIN PANEL</span></div>
      </div>

      {/* Main */}
      <div className="sidebar-section">
        <p className="sidebar-title">MAIN</p>

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">▦</span>
          <span>Dashboard</span>
        </NavLink>
      </div>

      {/* Management */}
      <div className="sidebar-section">
        <p className="sidebar-title">MANAGEMENT</p>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">♙</span>
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/companies"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">▥</span>
          <span>Companies</span>
        </NavLink>

        <NavLink
          to="/admin/jobs"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">▣</span>
          <span>Jobs</span>
        </NavLink>

        <NavLink
          to="/admin/applications"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">▤</span>
          <span>Applications</span>
        </NavLink>
      </div>

      {/* Analytics */}
      <div className="sidebar-section">
        <p className="sidebar-title">ANALYTICS</p>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">⌁</span>
          <span>Reports</span>
        </NavLink>
      </div>

      {/* System */}
      <div className="sidebar-section">
        <p className="sidebar-title">SYSTEM</p>

        <NavLink
          to="/admin/notifications"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">♢</span>
          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">⚙</span>
          <span>Settings</span>
        </NavLink>
      </div>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button className="logout-button">
          <span className="sidebar-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}
