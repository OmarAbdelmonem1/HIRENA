import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications } from "../services/jobseekerService";
export default function Applications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getApplications()
      .then(setApps)
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load applications."),
      );
  }, []);
  return (
    <div className="profile-page">
      <section className="page-intro">
        <span className="eyebrow">YOUR JOURNEY</span>
        <h1>My applications</h1>
        <p>Keep track of every opportunity you have explored.</p>
      </section>
      {error && <p className="form-error">{error}</p>}
      <div className="application-list">
        {apps.map((app) => (
          <button
            className="application-row"
            key={app.id}
            onClick={() => navigate(`/applications/${app.id}`)}
          >
            <div className="job-company-mark">
              {app.companyName?.charAt(0) || "H"}
            </div>
            <div>
              <strong>{app.jobTitle}</strong>
              <span>
                {app.companyName} · Applied{" "}
                {app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString()
                  : "recently"}
              </span>
            </div>
            <span className={`application-status ${app.status?.toLowerCase()}`}>
              {app.status}
            </span>
            <span>→</span>
          </button>
        ))}
        {!apps.length && !error && (
          <p className="empty-state">
            You have not applied to any jobs yet.{" "}
            <a href="/jobs">Explore jobs</a>
          </p>
        )}
      </div>
    </div>
  );
}
