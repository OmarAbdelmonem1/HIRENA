import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axios";
import { COUNTRIES } from "../../../../constants/jobSeekerProfile";
import {
  approveAdminJob,
  deleteAdminJob,
  getAdminJobs,
  rejectAdminJob,
} from "../../services/jobsService";
import { getAdminCompanies } from "../../services/companiesService";

const statusValues = ["PENDING", "APPROVED", "REJECTED", "CLOSED"];
const types = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "REMOTE",
  "HYBRID",
];
const text = (v) => v?.replaceAll("_", " ") || "—";
const date = (v) =>
  v
    ? new Date(v).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "—";

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState({ content: [], totalPages: 0 });
  const [stats, setStats] = useState({});
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    company: "",
    location: "",
    employmentType: "",
    experienceRequired: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [target, setTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const active = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== ""),
      );
      setJobs(await getAdminJobs({ ...active, page, size: 10 }));
      setError("");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    api
      .get("/api/admin/statistics")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);
  useEffect(() => {
    getAdminCompanies({ page: 0, size: 1000 })
      .then((response) => setCompanies(response.content || []))
      .catch(() => setCompanies([]));
  }, []);
  const companyNames = Array.from(
    new Set(companies.map((company) => company.companyName).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));
  const filter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(0);
  };
  const toast = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };
  const moderate = async (job, action) => {
    try {
      if (action === "approve") await approveAdminJob(job.id);
      else {
        const reason = window.prompt("Optional rejection reason:");
        if (reason === null) return;
        await rejectAdminJob(job.id, reason);
      }
      toast(`Job ${action}d.`);
      load();
    } catch (e) {
      toast(e.response?.data?.message || "Could not update the status.");
    }
  };
  const remove = async () => {
    try {
      await deleteAdminJob(target.id);
      setTarget(null);
      toast("Job deleted.");
      load();
    } catch (e) {
      toast(e.response?.data?.message || "Could not delete job.");
    }
  };
  const pages = Math.max(1, jobs.totalPages || 1);
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Management</p>
          <h1>Jobs</h1>
        </div>
      </header>
      <section className="welcome-row">
        <div>
          <h2>Job management</h2>
          <p>Review, edit, moderate, and remove jobs across HIRENA.</p>
        </div>
      </section>
      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Total jobs</span>
            <strong>{stats.totalJobs ?? "—"}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Active</span>
            <strong className="tone-green">{stats.approvedJobs ?? "—"}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Pending</span>
            <strong className="tone-blue">{stats.pendingJobs ?? "—"}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Closed</span>
            <strong className="tone-red">{stats.closedJobs ?? "—"}</strong>
          </div>
        </article>
      </section>
      <section className="panel table-panel">
        <div className="filters-row admin-job-filters">
          <div className="search-box">
            <span>⌕</span>
            <input
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => filter("search", e.target.value)}
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => filter("status", e.target.value)}
          >
            <option value="">Status: All</option>
            {statusValues.map((v) => (
              <option key={v} value={v}>
                {text(v)}
              </option>
            ))}
          </select>
          <select
            className="job-filter-input"
            value={filters.company}
            onChange={(e) => filter("company", e.target.value)}
          >
            <option value="">Company: All</option>
            {companyNames.map((companyName) => (
              <option key={companyName} value={companyName}>
                {companyName}
              </option>
            ))}
          </select>
          <select
            className="job-filter-input"
            value={filters.location}
            onChange={(e) => filter("location", e.target.value)}
          >
            <option value="">Country: All</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            value={filters.employmentType}
            onChange={(e) => filter("employmentType", e.target.value)}
          >
            <option value="">Type: All</option>
            {types.map((v) => (
              <option key={v} value={v}>
                {text(v)}
              </option>
            ))}
          </select>
          <select
            value={filters.experienceRequired}
            onChange={(e) => filter("experienceRequired", e.target.value)}
          >
            <option value="">Experience: All</option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
              <option key={v} value={v}>
                {v} years
              </option>
            ))}
          </select>
        </div>
        {error && <p className="table-message error">{error}</p>}
        {loading && <p className="table-message">Loading jobs…</p>}
        {!loading && !error && jobs.content.length === 0 && (
          <p className="table-message">No jobs match your filters.</p>
        )}
        {!loading && jobs.content.length > 0 && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>JOB TITLE</th>
                    <th>COMPANY</th>
                    <th>LOCATION</th>
                    <th>TYPE</th>
                    <th>STATUS</th>
                    <th>APPLICATIONS</th>
                    <th>CREATED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.content.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <strong>{job.title}</strong>
                      </td>
                      <td>{job.companyName}</td>
                      <td>{job.location || "—"}</td>
                      <td>{text(job.employmentType)}</td>
                      <td>
                        <span
                          className={`status-badge ${job.status === "APPROVED" ? "green" : job.status === "PENDING" ? "orange" : "red"}`}
                        >
                          {text(job.status)}
                        </span>
                      </td>
                      <td>{job.applicationsCount}</td>
                      <td>{date(job.createdAt)}</td>
                      <td className="job-actions">
                        <button
                          onClick={() => navigate(`/admin/jobs/${job.id}`)}
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                        >
                          Edit
                        </button>
                        {job.status === "PENDING" && (
                          <>
                            <button
                              className="approve-action"
                              onClick={() => moderate(job, "approve")}
                            >
                              Approve
                            </button>
                            <button
                              className="reject-action"
                              onClick={() => moderate(job, "reject")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="delete-action"
                          onClick={() => setTarget(job)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                ‹
              </button>
              {Array.from({ length: pages }, (_, i) => i)
                .slice(Math.max(0, page - 2), page + 3)
                .map((p) => (
                  <button
                    key={p}
                    className={p === page ? "active" : ""}
                    onClick={() => setPage(p)}
                  >
                    {p + 1}
                  </button>
                ))}
              <button
                disabled={page >= pages - 1}
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </div>
          </>
        )}
      </section>
      {target && (
        <div className="modal-backdrop" onClick={() => setTarget(null)}>
          <div
            className="modal-container confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Delete job</h3>
            </div>
            <p className="confirm-text">
              Are you sure you want to delete <strong>{target.title}</strong>?
              Its applications will also be removed.
            </p>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setTarget(null)}
              >
                Cancel
              </button>
              <button className="danger-button" onClick={remove}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}
