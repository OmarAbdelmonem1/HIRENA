import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplication } from "../Services/jobseekerService";
export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getApplication(id)
      .then(setApp)
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load application."),
      );
  }, [id]);
  if (error) return <p className="empty-state">{error}</p>;
  if (!app) return <p className="empty-state">Loading application…</p>;
  return (
    <div className="narrow-page">
      <button className="back-link" onClick={() => navigate("/applications")}>
        ← Back to applications
      </button>
      <section className="application-detail panel">
        <span className={`application-status ${app.status?.toLowerCase()}`}>
          {app.status}
        </span>
        <h1>{app.jobTitle}</h1>
        <p className="detail-company">{app.companyName}</p>
        {app.cvAnalysisStatus === "COMPLETED" && (
          <section className="panel cv-analysis-result">
            <div className="cv-analysis-heading">
              <div>
                <span className="eyebrow">AI MATCH ANALYSIS</span>
                <h2>How well your CV matches</h2>
              </div>
              <strong className="cv-score">{app.cvScore}%</strong>
            </div>
            <p className="detail-copy">{app.cvAnalysisSummary}</p>
            <div className="cv-analysis-stats">
              <span>Experience match: <strong>{app.cvExperienceMatch}%</strong></span>
            </div>
            <div className="cv-analysis-columns">
              <div>
                <h3>Matched skills</h3>
                <ul>{app.cvMatchedSkills?.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h3>Skills to improve</h3>
                <ul>{app.cvMissingSkills?.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
            {!!app.cvRecommendations?.length && (
              <div>
                <h3>Recommendations</h3>
                <ul>{app.cvRecommendations.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            )}
          </section>
        )}
        {app.cvAnalysisStatus === "FAILED" && (
          <p className="form-error">
            Your application was submitted, but CV analysis could not be completed.
            {app.cvAnalysisError ? ` Reason: ${app.cvAnalysisError}` : ""}
          </p>
        )}
        {app.cvAnalysisStatus === "NOT_ANALYZED" && (
          <p className="detail-copy">
            Upload a PDF CV in your profile to receive a match analysis.
          </p>
        )}
        <div className="application-timeline">
          <div className="timeline-dot active" />
          <div>
            <strong>Application submitted</strong>
            <span>
              {app.appliedAt
                ? new Date(app.appliedAt).toLocaleString()
                : "Recently"}
            </span>
          </div>
          <div className="timeline-line" />
          <div
            className={`timeline-dot ${app.status !== "PENDING" ? "active" : ""}`}
          />
          <div>
            <strong>Current status</strong>
            <span>{app.status}</span>
          </div>
        </div>
        <h2>Your cover letter</h2>
        <p className="detail-copy">
          {app.coverLetter || "No cover letter provided."}
        </p>
      </section>
    </div>
  );
}
