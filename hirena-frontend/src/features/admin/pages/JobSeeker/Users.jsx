import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminUsers } from "../../Services/JobSeekersService";

const PAGE_SIZE = 10;

function initials(firstName, lastName) {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        // Backend has no server-side search/filter yet, so we pull a single
        // large page and do search/filter/pagination on the client.
        const data = await getAdminUsers({ page: 0, size: 1000 });
        if (!cancelled) setUsers(data.content || []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load users",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(() => {
    const unique = new Set(users.map((u) => u.city).filter(Boolean));
    return Array.from(unique).sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.currentJobTitle?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.enabled) ||
        (statusFilter === "blocked" && !user.enabled);

      const matchesCity = cityFilter === "all" || user.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [users, search, statusFilter, cityFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, cityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pageUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.enabled).length;
    const blocked = users.filter((u) => !u.enabled).length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newThisWeek = users.filter(
      (u) => u.createdAt && new Date(u.createdAt).getTime() >= weekAgo,
    ).length;

    return { total, active, blocked, newThisWeek };
  }, [users]);

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Management</p>
          <h1>Users</h1>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <h2>Job seekers</h2>
          <p>Manage job seekers on HIRENA</p>
        </div>
        <button
          className="primary-button"
          onClick={() => {
            setNotice(
              "Add user is not available yet — no backend endpoint exists for this action.",
            );
            window.setTimeout(() => setNotice(""), 4000);
          }}
        >
          <span>＋</span>Add user
        </button>
      </section>

      <section className="metric-grid" aria-label="User statistics">
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Total users</span>
            <strong>{stats.total.toLocaleString()}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Active</span>
            <strong className="tone-green">
              {stats.active.toLocaleString()}
            </strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Blocked</span>
            <strong className="tone-red">
              {stats.blocked.toLocaleString()}
            </strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>New this week</span>
            <strong className="tone-blue">
              {stats.newThisWeek.toLocaleString()}
            </strong>
          </div>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="filters-row">
          <div className="search-box">
            <span aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">City: All</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="table-message error">{error}</p>}
        {loading && !error && <p className="table-message">Loading users…</p>}
        {!loading && !error && filteredUsers.length === 0 && (
          <p className="table-message">No users match your filters.</p>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>USER</th>
                    <th>EMAIL</th>
                    <th>LOCATION</th>
                    <th>STATUS</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="app-avatar blue">
                            {initials(user.firstName, user.lastName)}
                          </div>
                          <div>
                            <strong>
                              {user.firstName} {user.lastName}
                            </strong>
                            <span className="user-subtext">
                              {user.currentJobTitle || "No title set"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {[user.city, user.country].filter(Boolean).join(", ") ||
                          "—"}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${user.enabled ? "green" : "red"}`}
                        >
                          {user.enabled ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="more-button"
                          aria-label="Row actions"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === user.id ? null : user.id,
                            )
                          }
                        >
                          •••
                        </button>
                        {openMenuId === user.id && (
                          <div className="row-menu">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/admin/users/${user.id}`);
                              }}
                            >
                              View details
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                ‹
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  className={n === page ? "active" : ""}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </>
        )}
      </section>
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}
