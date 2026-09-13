import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllApplications } from "../../services/applicationsService";
const PAGE_SIZE = 10;

type ApplicationStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";

interface Application {
  id: number;
  jobSeekerFirstName?: string;
  jobSeekerLastName?: string;
  jobSeekerEmail?: string;
  jobTitle?: string;
  companyName?: string;
  status: ApplicationStatus;
  appliedAt?: string;
}

function initials(firstName?: string, lastName?: string) {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

function statusTone(status: ApplicationStatus) {
  switch (status) {
    case "ACCEPTED":
      return "green";
    case "REJECTED":
      return "red";
    case "REVIEWING":
      return "blue";
    case "PENDING":
    default:
      return "yellow";
  }
}

export default function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      setLoading(true);
      setError("");

      try {
        // زي صفحة Users: نجيب دفعة كبيرة ونعمل search/filter/pagination على الكلاينت
        const data = await getAllApplications({
          page: 0,
          size: 1000,
          sort: "appliedAt,desc",
        });
        if (!cancelled) setApplications(data.content || []);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load applications",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadApplications();
    return () => {
      cancelled = true;
    };
  }, []);

  const jobs = useMemo(() => {
    const unique = new Set(
      applications
        .map((a) => a.jobTitle)
        .filter((title): title is string => Boolean(title)),
    );
    return Array.from(unique).sort();
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((app) => {
      const fullName =
        `${app.jobSeekerFirstName || ""} ${app.jobSeekerLastName || ""}`.toLowerCase();
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        app.jobSeekerEmail?.toLowerCase().includes(query) ||
        app.jobTitle?.toLowerCase().includes(query) ||
        app.companyName?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter.toUpperCase();
      const matchesJob = jobFilter === "all" || app.jobTitle === jobFilter;

      return matchesSearch && matchesStatus && matchesJob;
    });
  }, [applications, search, statusFilter, jobFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, jobFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / PAGE_SIZE),
  );
  const pageApplications = filteredApplications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(
      (a) => a.status === "PENDING" || a.status === "REVIEWING",
    ).length;
    const accepted = applications.filter((a) => a.status === "ACCEPTED").length;
    const rejected = applications.filter((a) => a.status === "REJECTED").length;
    return { total, pending, accepted, rejected };
  }, [applications]);

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
          <h1>Applications</h1>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <h2>Candidate applications</h2>
          <p>Review and manage job applications on HIRENA</p>
        </div>
      </section>

      <section className="metric-grid" aria-label="Application statistics">
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Total applications</span>
            <strong>{stats.total.toLocaleString()}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Pending / Reviewing</span>
            <strong className="tone-blue">
              {stats.pending.toLocaleString()}
            </strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Accepted</span>
            <strong className="tone-green">
              {stats.accepted.toLocaleString()}
            </strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Rejected</span>
            <strong className="tone-red">
              {stats.rejected.toLocaleString()}
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
              placeholder="Search by candidate, email, job or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Status: All</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            <option value="all">Job: All</option>
            {jobs.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="table-message error">{error}</p>}
        {loading && !error && (
          <p className="table-message">Loading applications…</p>
        )}
        {!loading && !error && filteredApplications.length === 0 && (
          <p className="table-message">No applications match your filters.</p>
        )}

        {!loading && !error && filteredApplications.length > 0 && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>CANDIDATE</th>
                    <th>JOB</th>
                    <th>COMPANY</th>
                    <th>STATUS</th>
                    <th>APPLIED AT</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {pageApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="user-cell">
                          <div className="app-avatar blue">
                            {initials(
                              app.jobSeekerFirstName,
                              app.jobSeekerLastName,
                            )}
                          </div>
                          <div>
                            <strong>
                              {app.jobSeekerFirstName} {app.jobSeekerLastName}
                            </strong>
                            <span className="user-subtext">
                              {app.jobSeekerEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{app.jobTitle}</td>
                      <td>{app.companyName}</td>
                      <td>
                        <span
                          className={`status-badge ${statusTone(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {app.appliedAt
                          ? new Date(app.appliedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="actions-cell">
                        <button
                          className="more-button"
                          aria-label="Row actions"
                          onClick={() =>
                            setOpenMenuId(openMenuId === app.id ? null : app.id)
                          }
                        >
                          •••
                        </button>
                        {openMenuId === app.id && (
                          <div className="row-menu">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/admin/applications/${app.id}`);
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
    </div>
  );
}
