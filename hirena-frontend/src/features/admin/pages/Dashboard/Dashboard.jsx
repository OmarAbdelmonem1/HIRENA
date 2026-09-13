import { useEffect, useState } from "react";
import { useAuth } from "../../../../providers/AuthProvider";
import { getAdminDashboard } from "../../services/adminDashboardService";

function MetricIcon({ type }) {
  const paths = {
    users: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 19a6 6 0 0 1 12 0M16 4.5a3 3 0 0 1 0 5.8M18 13a5 5 0 0 1 3 6" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M2 21h20M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    document: (
      <>
        <path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5M8 13h8M8 17h5" />
      </>
    ),
  };
  return (
    <svg className="metric-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

export default function Dashboard() {
  const auth = useAuth();
  const [notice, setNotice] = useState("");

  const [metrics, setMetrics] = useState([
    {
      label: "Total Users",
      value: "—",
      change: "",
      icon: "users",
      tone: "blue",
    },
    {
      label: "Companies",
      value: "—",
      change: "",
      icon: "building",
      tone: "purple",
    },
    {
      label: "Active Jobs",
      value: "—",
      change: "",
      icon: "briefcase",
      tone: "orange",
    },
    {
      label: "Applications",
      value: "—",
      change: "",
      icon: "document",
      tone: "green",
    },
  ]);

  const [applicationOverview, setApplicationOverview] = useState([]);
  const [jobStatus, setJobStatus] = useState({
    total: 0,
    active: 0,
    pending: 0,
    closed: 0,
    draft: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getAdminDashboard();
        if (!mounted) return;

        // Stats -> metrics
        const s = data.stats || {};
        setMetrics([
          {
            label: "Total Users",
            value: (s.totalUsers ?? 0).toLocaleString(),
            change: "",
            icon: "users",
            tone: "blue",
          },
          {
            label: "Companies",
            value: (s.totalCompanies ?? 0).toLocaleString(),
            change: "",
            icon: "building",
            tone: "purple",
          },
          {
            label: "Active Jobs",
            value: (s.activeJobs ?? 0).toLocaleString(),
            change: "",
            icon: "briefcase",
            tone: "orange",
          },
          {
            label: "Applications",
            value: (s.totalApplications ?? 0).toLocaleString(),
            change: "",
            icon: "document",
            tone: "green",
          },
        ]);

        // Application overview
        setApplicationOverview(data.applicationOverview || []);

        // Job status
        setJobStatus(
          data.jobStatus || {
            total: 0,
            active: 0,
            pending: 0,
            closed: 0,
            draft: 0,
          },
        );

        // recent lists
        setRecentJobs(data.recentJobs || []);
        setRecentApplications(data.recentApplications || []);
      } catch (err) {
        /* keep defaults */
        console.error("Failed to load admin dashboard", err);
      } finally {
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAction = (label) => {
    setNotice(`${label} is ready to connect when the backend is available.`);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <div className="header-actions">
          <button
            className="icon-button notification-button"
            aria-label="View notifications"
            onClick={() => window.location.assign("/admin/notifications")}
          >
            <span className="notification-dot" />
            <span aria-hidden="true">♢</span>
          </button>
          <div className="admin-user">
            <div className="avatar">A</div>
            <div>
              <strong>{auth?.user?.email?.split("@")[0] || "Admin"}</strong>
              <span>Administrator</span>
            </div>
            <span className="chevron">⌄</span>
          </div>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <h2>
            Welcome back, Admin <span aria-hidden="true">👋</span>
          </h2>
          <p>Here&apos;s what&apos;s happening across HIRENA today.</p>
        </div>
        <span className="date-pill">{todayLabel}</span>
      </section>

      <section className="metric-grid" aria-label="Platform statistics">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className={`metric-icon-wrap ${metric.tone}`}>
              <MetricIcon type={metric.icon} />
            </div>
            <div className="metric-copy">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>
                {metric.change ? (
                  <>
                    <b>↗ {metric.change}</b> <em>vs last month</em>
                  </>
                ) : null}
              </small>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Applications overview</h3>
              <p>Application activity over the last 7 days</p>
            </div>
            <button
              className="select-button"
              onClick={() => handleAction("Time range")}
            >
              This week <span>⌄</span>
            </button>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-dot blue" />
              Applications
            </span>
            <span>
              <i className="legend-dot purple" />
              Accepted
            </span>
          </div>
          <div
            className="chart"
            role="img"
            aria-label="Applications trend chart"
          >
            <div className="chart-y-axis">
              <span>120</span>
              <span>90</span>
              <span>60</span>
              <span>30</span>
              <span>0</span>
            </div>
            <div className="chart-area">
              <div className="grid-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              {/* Simplified: chart lines are static SVG placeholders in current UI; update labels based on data */}
              <svg
                viewBox="0 0 640 210"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#4c7cf5" stopOpacity=".18" />
                    <stop offset="1" stopColor="#4c7cf5" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="chart-fill" d="M0 170 L640 170 V210 H0Z" />
                <path className="chart-line primary" d="M0 170 L640 170" />
                <path className="chart-line secondary" d="M0 190 L640 190" />
              </svg>
              <div className="chart-x-axis">
                {(applicationOverview.length
                  ? applicationOverview
                  : [
                      { day: "Mon" },
                      { day: "Tue" },
                      { day: "Wed" },
                      { day: "Thu" },
                      { day: "Fri" },
                      { day: "Sat" },
                      { day: "Sun" },
                    ]
                ).map((d, i) => (
                  <span key={i}>{d.day}</span>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="panel status-panel">
          <div className="panel-heading">
            <div>
              <h3>Job status</h3>
              <p>Current job listings by status</p>
            </div>
            <button
              className="more-button"
              aria-label="More job status options"
              onClick={() => handleAction("Job status options")}
            >
              •••
            </button>
          </div>
          <div className="status-content">
            <div className="donut">
              <div>
                <strong>{jobStatus.total}</strong>
                <span>Total jobs</span>
              </div>
            </div>
            <div className="status-list">
              <div>
                <span>
                  <i className="legend-dot green" />
                  Active
                </span>
                <strong>
                  {jobStatus.active}{" "}
                  <small>
                    {jobStatus.total
                      ? ((jobStatus.active / jobStatus.total) * 100).toFixed(
                          1,
                        ) + "%"
                      : "—"}
                  </small>
                </strong>
              </div>
              <div>
                <span>
                  <i className="legend-dot orange" />
                  Pending
                </span>
                <strong>
                  {jobStatus.pending}{" "}
                  <small>
                    {jobStatus.total
                      ? ((jobStatus.pending / jobStatus.total) * 100).toFixed(
                          1,
                        ) + "%"
                      : "—"}
                  </small>
                </strong>
              </div>
              <div>
                <span>
                  <i className="legend-dot gray" />
                  Closed
                </span>
                <strong>
                  {jobStatus.closed}{" "}
                  <small>
                    {jobStatus.total
                      ? ((jobStatus.closed / jobStatus.total) * 100).toFixed(
                          1,
                        ) + "%"
                      : "—"}
                  </small>
                </strong>
              </div>
              <div>
                <span>
                  <i className="legend-dot purple" />
                  Draft
                </span>
                <strong>
                  {jobStatus.draft}{" "}
                  <small>
                    {jobStatus.total
                      ? ((jobStatus.draft / jobStatus.total) * 100).toFixed(1) +
                        "%"
                      : "—"}
                  </small>
                </strong>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel table-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent jobs</h3>
              <p>Latest jobs posted on the platform</p>
            </div>
            <button
              className="text-button"
              onClick={() => handleAction("View all jobs")}
            >
              View all <span>→</span>
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>JOB TITLE</th>
                  <th>COMPANY</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th>POSTED</th>
                </tr>
              </thead>
              <tbody>
                {(recentJobs.length ? recentJobs : []).map((job) => (
                  <tr key={job.id}>
                    <td>
                      <strong>{job.title}</strong>
                    </td>
                    <td>{job.companyName}</td>
                    <td>{job.location}</td>
                    <td>
                      <span
                        className={`status-badge ${job.status?.toLowerCase()}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td>
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel table-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent applications</h3>
              <p>Latest candidate applications</p>
            </div>
            <button
              className="text-button"
              onClick={() => handleAction("View all applications")}
            >
              View all <span>→</span>
            </button>
          </div>
          <div className="application-list">
            {(recentApplications.length ? recentApplications : []).map((a) => (
              <div className="application-row" key={a.id}>
                <div className={`app-avatar`}>
                  {(a.jobSeekerName || "–")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="application-person">
                  <strong>{a.jobSeekerName || "—"}</strong>
                  <span>
                    {a.jobTitle} · {a.companyName}
                  </span>
                </div>
                <span className={`status-badge ${a.status?.toLowerCase()}`}>
                  {a.status}
                </span>
                <div className="application-time">
                  {a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="quick-actions">
        <div>
          <h3>Quick actions</h3>
          <p>Common tasks to help you manage HIRENA</p>
        </div>
        <div className="action-buttons">
          <button className="action">Create job</button>
          <button className="action">Invite company</button>
          <button className="action">Export reports</button>
        </div>
      </section>

      {notice && <div className="notice">{notice}</div>}
    </div>
  );
}
