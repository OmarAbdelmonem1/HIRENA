import { useEffect, useState } from "react";
import useNotice from "../../../../hooks/useNotice";
import { useNavigate, useParams } from "react-router-dom";
import {
  approveAdminJob,
  deleteAdminJob,
  getAdminJob,
  rejectAdminJob,
} from "../../services/jobsService";

const label = (value) => value?.replaceAll("_", " ") || "—";
const date = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" })
    : "—";
const salary = (min, max) =>
  min || max ? `${min ?? "—"} – ${max ?? "—"}` : "Not specified";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { notice, showNotice: setNotice } = useNotice();
  const load = async () => {
    try {
      setData(await getAdminJob(id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load job details.");
    }
  };
  useEffect(() => {
    load();
  }, [id]);
  const moderate = async (action) => {
    try {
      if (action === "approve") await approveAdminJob(id);
      else {
        const reason = window.prompt("Optional rejection reason:");
        if (reason === null) return;
        await rejectAdminJob(id, reason);
      }
      setNotice(`Job ${action}d.`);
      load();
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not update status.");
    }
  };
  const remove = async () => {
    try {
      await deleteAdminJob(id);
      navigate("/admin/jobs");
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not delete job.");
      setDeleting(false);
    }
  };
  const job = data?.job;
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <button
            className="text-button back-link"
            onClick={() => navigate("/admin/jobs")}
          >
            ← Back to jobs
          </button>
          <h1>Job details</h1>
        </div>
        {job && (
          <div className="header-actions">
            <button
              className="secondary-button"
              onClick={() => navigate(`/admin/jobs/${id}/edit`)}
            >
              Edit job
            </button>
            <button className="danger-button" onClick={() => setDeleting(true)}>
              Delete job
            </button>
          </div>
        )}
      </header>
      {!data && !error && <p className="table-message">Loading job…</p>}
      {error && <p className="table-message error">{error}</p>}
      {job && (
        <>
          <section className="panel job-hero">
            <div>
              <p className="eyebrow">{job.companyName}</p>
              <h2>{job.title}</h2>
              <p>
                {job.location || "Location not specified"} ·{" "}
                {label(job.employmentType)} · {job.experienceRequired ?? "—"}{" "}
                years experience
              </p>
            </div>
            <div>
              <span
                className={`status-badge ${job.status === "APPROVED" ? "green" : job.status === "PENDING" ? "orange" : "red"}`}
              >
                {label(job.status)}
              </span>
              {job.status === "PENDING" && (
                <div className="inline-actions">
                  <button
                    className="primary-button"
                    onClick={() => moderate("approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="danger-button"
                    onClick={() => moderate("reject")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </section>
          <section className="metric-grid job-stats">
            <article className="metric-card">
              <div className="metric-copy plain">
                <span>Unique views</span>
                <strong>{data.uniqueViewers ?? 0}</strong>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-copy plain">
                <span>Applications</span>
                <strong>{data.applicationsCount ?? 0}</strong>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-copy plain">
                <span>Admitted</span>
                <strong className="tone-green">
                  {data.admittedApplications ?? 0}
                </strong>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-copy plain">
                <span>Rejected</span>
                <strong className="tone-red">
                  {data.rejectedApplications ?? 0}
                </strong>
              </div>
            </article>
          </section>
          <section className="dashboard-grid">
            <article className="panel">
              <div className="panel-heading">
                <h3>Job information</h3>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Company</dt>
                  <dd>{job.companyName}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{job.location || "—"}</dd>
                </div>
                <div>
                  <dt>Salary</dt>
                  <dd>{salary(job.salaryMin, job.salaryMax)}</dd>
                </div>
                <div>
                  <dt>Job type</dt>
                  <dd>{label(job.employmentType)}</dd>
                </div>
                <div>
                  <dt>Experience level</dt>
                  <dd>{job.experienceRequired ?? "—"} years</dd>
                </div>
                <div>
                  <dt>Posted date</dt>
                  <dd>{date(job.createdAt)}</dd>
                </div>
                <div>
                  <dt>Deadline</dt>
                  <dd>{date(job.deadline)}</dd>
                </div>
              </dl>
            </article>
            <article className="panel">
              <div className="panel-heading">
                <h3>Publishing status</h3>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Status</dt>
                  <dd>{label(job.status)}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{date(job.updatedAt)}</dd>
                </div>
                {job.rejectionReason && (
                  <div>
                    <dt>Rejection reason</dt>
                    <dd>{job.rejectionReason}</dd>
                  </div>
                )}
              </dl>
            </article>
          </section>
          <section className="panel job-copy">
            <h3>Description</h3>
            <p className="bio-text">{job.description}</p>
            <h3>Requirements</h3>
            <p className="bio-text">
              {job.requirements || "No requirements provided."}
            </p>
          </section>
        </>
      )}
      {deleting && (
        <div className="modal-backdrop" onClick={() => setDeleting(false)}>
          <div
            className="modal-container confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Delete job</h3>
            </div>
            <p className="confirm-text">
              Are you sure you want to delete this job? Its applications will
              also be removed.
            </p>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setDeleting(false)}
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
