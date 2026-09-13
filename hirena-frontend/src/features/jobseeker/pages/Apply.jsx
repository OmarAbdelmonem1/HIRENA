import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applyToJob, getJob } from "../Services/jobseekerService";
export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load job."),
      );
  }, [id]);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await applyToJob(id, coverLetter);
      navigate("/applications");
    } catch (e) {
      setError(e.response?.data?.message || "Could not submit application.");
    } finally {
      setSaving(false);
    }
  };
  if (!job)
    return <p className="empty-state">{error || "Loading application…"}</p>;
  return (
    <div className="narrow-page">
      <button
        type="button"
        className="back-link"
        onClick={() => navigate(`/jobs/${id}`)}
      >
        ← Back to job
      </button>
      <section className="application-form panel">
        <span className="eyebrow">YOUR NEXT CHAPTER</span>
        <h1>Apply for {job.title}</h1>
        <p className="form-intro">
          Tell {job.companyName} why you are a great fit.
        </p>
        {error && <p className="form-error">{error}</p>}
        <form method="post" action={`/jobs/${id}/apply`} onSubmit={submit}>
          <label>
            Cover letter
            <textarea
              rows="10"
              placeholder="Share your experience, motivation, and what you would bring to this role…"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </label>
          <div className="form-actions">
            <button type="button" onClick={() => navigate(`/jobs/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Submitting…" : "Submit application →"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
