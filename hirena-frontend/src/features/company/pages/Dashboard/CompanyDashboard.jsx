import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCompanyApplications,
  getCompanyJobs,
} from "../../services/companyService";
import { formatShortDate, formatStatus } from "../../../../utils/formatters";

const tone = (status) =>
  status === "APPROVED" || status === "ACCEPTED"
    ? "green"
    : status === "REJECTED"
      ? "red"
      : "orange";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ jobs: [], applications: [] });
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([getCompanyJobs(), getCompanyApplications()])
      .then(([jobs, applications]) => setData({ jobs, applications }))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load dashboard."),
      );
  }, []);
  const { jobs, applications } = data;
  const active = jobs.filter((j) => j.status === "APPROVED").length;
  const pending = jobs.filter((j) => j.status === "PENDING").length;
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Company</p>
          <h1>Dashboard</h1>
        </div>
      </header>
      {error && <p className="table-message error">{error}</p>}
      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Total jobs</span>
            <strong>{jobs.length}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Active jobs</span>
            <strong className="tone-green">{active}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Applications</span>
            <strong>{applications.length}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Pending jobs</span>
            <strong className="tone-blue">{pending}</strong>
          </div>
        </article>
      </section>
      <section className="dashboard-grid">
        <div className="panel table-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Overview</p>
              <h2>Recent jobs</h2>
            </div>
            <button
              className="primary-button"
              onClick={() => navigate("/company/jobs/create")}
            >
              + Create job
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>STATUS</th>
                  <th>CREATED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job.id}>
                    <td>
                      <strong>{job.title}</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${tone(job.status)}`}>
                        {formatStatus(job.status)}
                      </span>
                    </td>
                    <td>{formatShortDate(job.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/company/jobs/${job.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!jobs.length && <p className="table-message">No jobs yet.</p>}
          </div>
        </div>
        <div className="panel table-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Pipeline</p>
              <h2>Recent applications</h2>
            </div>
            <button onClick={() => navigate("/company/applications")}>
              View all
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>JOB</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id}>
                    <td>
                      {app.jobSeekerFirstName} {app.jobSeekerLastName}
                    </td>
                    <td>{app.jobTitle}</td>
                    <td>
                      <span className={`status-badge ${tone(app.status)}`}>
                        {formatStatus(app.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!applications.length && (
              <p className="table-message">No applications yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
