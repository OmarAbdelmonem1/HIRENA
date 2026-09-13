import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById } from "../../Services/ApplicationsService";

function statusTone(status) {
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

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getApplicationById(id);
        if (!cancelled) setApplication(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Failed to load application");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="table-message">Loading application…</p>;
  if (error) return <p className="table-message error">{error}</p>;
  if (!application) return <p className="table-message">Application not found.</p>;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Applications</p>
          <h1>Application #{application.id}</h1>
        </div>
        <button className="primary-button" onClick={() => navigate("/admin/applications")}>
          ← Back to applications
        </button>
      </header>

      <section className="panel">
        <div className="filters-row" style={{ justifyContent: "space-between" }}>
          <span className={`status-badge ${statusTone(application.status)}`}>{application.status}</span>

        </div>

        <div className="metric-grid" style={{ marginTop: "16px" }}>
          <article className="metric-card">
            <div className="metric-copy plain">
              <span>Candidate</span>
              <strong>
                {application.jobSeekerFirstName} {application.jobSeekerLastName}
              </strong>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-copy plain">
              <span>Email</span>
              <strong>{application.jobSeekerEmail}</strong>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-copy plain">
              <span>Job</span>
              <strong>{application.jobTitle}</strong>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-copy plain">
              <span>Company</span>
              <strong>{application.companyName}</strong>
            </div>
          </article>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h3>Cover letter</h3>
          <p>{application.coverLetter || "No cover letter provided."}</p>
        </div>

        <div style={{ marginTop: "16px" }}>
          <h3>Applied at</h3>
          <p>{application.appliedAt ? new Date(application.appliedAt).toLocaleString() : "—"}</p>
        </div>
      </section>
    </div>
  );
}
