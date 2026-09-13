import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplications, getJob } from "../services/jobseekerService";
const saved = (id) =>
  JSON.parse(localStorage.getItem("saved_jobs") || "[]").some(
    (job) => String(job.id) === String(id),
  );
export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(saved(id));
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getJob(id), getApplications()])
      .then(([jobResult, applicationsResult]) => {
        if (cancelled) return;
        if (jobResult.status === "rejected") {
          throw jobResult.reason;
        }
        setJob(jobResult.value);
        if (applicationsResult.status === "fulfilled") {
          setHasApplied(
            (applicationsResult.value || []).some(
              (application) => String(application.jobId) === String(id),
            ),
          );
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e.response?.data?.message || "Could not load this job.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  const toggleSave = () => {
    const jobs = JSON.parse(localStorage.getItem("saved_jobs") || "[]");
    const next = isSaved
      ? jobs.filter((item) => String(item.id) !== String(id))
      : [...jobs, job];
    localStorage.setItem("saved_jobs", JSON.stringify(next));
    setIsSaved(!isSaved);
  };
  if (error) return <p className="empty-state">{error}</p>;
  if (!job) return <p className="empty-state">Loading opportunity…</p>;
  return (
    <div className="job-details-page">
      <button className="back-link" onClick={() => navigate("/jobs")}>
        ← Back to jobs
      </button>
      <section className="job-details-header">
        <div className="job-company-mark large">
          {job.companyName?.charAt(0) || "H"}
        </div>
        <div>
          <span className="eyebrow">{job.companyName}</span>
          <h1>{job.title}</h1>
          <p>
            {job.location || "Remote"} ·{" "}
            {job.employmentType?.replaceAll("_", " ")} ·{" "}
            {job.experienceRequired || 0}+ years experience
            {job.category ? ` · ${job.category.replaceAll("_", " ")}` : ""}
          </p>
        </div>
        <button className="save-button" onClick={toggleSave}>
          {isSaved ? "♥ Saved" : "♡ Save job"}
        </button>
      </section>
      <div className="job-details-layout">
        <article className="job-details-copy">
          <h2>About the role</h2>
          <p>{job.description}</p>
          <h2>What you'll bring</h2>
          <p>
            {job.requirements ||
              "We are looking for curious, motivated people ready to make an impact."}
          </p>
        </article>
        <aside className="apply-card">
          <h3>Interested in this role?</h3>
          <p>Take the next step and introduce yourself to {job.companyName}.</p>
          <button
            className="primary-button full-button"
            onClick={() => navigate(`/jobs/${id}/apply`)}
            disabled={hasApplied}
          >
            {hasApplied ? "Applied" : "Apply now →"}
          </button>
          <div className="job-summary">
            <span>Unique views</span>
            <strong>{job.uniqueViewers ?? 0}</strong>
            <span>Salary</span>
            <strong>
              {job.salaryMin || job.salaryMax
                ? `${job.salaryMin || "—"} - ${job.salaryMax || "—"}`
                : "Not specified"}
            </strong>
            <span>Application deadline</span>
            <strong>{job.deadline || "Open until filled"}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
