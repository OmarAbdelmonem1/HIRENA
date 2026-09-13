import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminJob, updateAdminJob } from "../../Services/JobsService";

const empty = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  employmentType: "FULL_TIME",
  experienceRequired: "",
  deadline: "",
};
const types = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "REMOTE",
  "HYBRID",
];
export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    getAdminJob(id)
      .then(({ job }) =>
        setForm({
          ...empty,
          ...job,
          salaryMin: job.salaryMin ?? "",
          salaryMax: job.salaryMax ?? "",
          experienceRequired: job.experienceRequired ?? "",
          deadline: job.deadline ?? "",
        }),
      )
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load job."),
      )
      .finally(() => setLoading(false));
  }, [id]);
  const change = (e) =>
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin || null,
        salaryMax: form.salaryMax || null,
        experienceRequired:
          form.experienceRequired === ""
            ? null
            : Number(form.experienceRequired),
        deadline: form.deadline || null,
      };
      await updateAdminJob(id, payload);
      navigate(`/admin/jobs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <button
            className="text-button back-link"
            onClick={() => navigate(`/admin/jobs/${id}`)}
          >
            ← Back to job details
          </button>
          <h1>Edit job</h1>
        </div>
      </header>
      {loading ? (
        <p className="table-message">Loading job…</p>
      ) : (
        <form className="panel modal-form job-edit-form" onSubmit={submit}>
          {error && <p className="modal-error">{error}</p>}
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Job title</label>
              <input
                required
                name="title"
                value={form.title}
                onChange={change}
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                required
                rows="6"
                name="description"
                value={form.description}
                onChange={change}
              />
            </div>
            <div className="form-group full-width">
              <label>Requirements</label>
              <textarea
                rows="5"
                name="requirements"
                value={form.requirements || ""}
                onChange={change}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={form.location || ""}
                onChange={change}
              />
            </div>
            <div className="form-group">
              <label>Job type</label>
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={change}
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Minimum salary</label>
              <input
                type="number"
                min="0"
                name="salaryMin"
                value={form.salaryMin}
                onChange={change}
              />
            </div>
            <div className="form-group">
              <label>Maximum salary</label>
              <input
                type="number"
                min="0"
                name="salaryMax"
                value={form.salaryMax}
                onChange={change}
              />
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                min="0"
                name="experienceRequired"
                value={form.experienceRequired}
                onChange={change}
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={change}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(`/admin/jobs/${id}`)}
            >
              Cancel
            </button>
            <button className="primary-button" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
