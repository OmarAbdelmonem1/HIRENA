import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCompanyJob,
  getCompanyJob,
  updateCompanyJob,
} from "../../services/companyService";
import { JOB_CATEGORIES } from "../../../../constants/jobSeekerProfile";

const initial = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  employmentType: "FULL_TIME",
  category: "SOFTWARE_ENGINEERING",
  experienceRequired: "",
  salaryMin: "",
  salaryMax: "",
  deadline: "",
};
export default function CompanyJobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (id)
      getCompanyJob(id)
        .then((job) =>
          setForm({
            ...initial,
            ...job,
            experienceRequired: job.experienceRequired ?? "",
            salaryMin: job.salaryMin ?? "",
            salaryMax: job.salaryMax ?? "",
          }),
        )
        .catch((e) =>
          setError(e.response?.data?.message || "Could not load job."),
        );
  }, [id]);
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const data = {
      ...form,
      experienceRequired:
        form.experienceRequired === "" ? null : Number(form.experienceRequired),
      salaryMin: form.salaryMin === "" ? null : Number(form.salaryMin),
      salaryMax: form.salaryMax === "" ? null : Number(form.salaryMax),
    };
    try {
      const job = id
        ? await updateCompanyJob(id, data)
        : await createCompanyJob(data);
      navigate(`/company/jobs/${job.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save job.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Jobs</p>
          <h1>{id ? "Edit job" : "Create job"}</h1>
        </div>
      </header>
      <form className="panel form-panel" onSubmit={submit}>
        {error && <p className="table-message error">{error}</p>}
        <div className="form-grid">
          <label>
            Job title
            <input name="title" value={form.title} onChange={change} required />
          </label>
          <label>
            Location
            <input name="location" value={form.location} onChange={change} />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={change}>
              {JOB_CATEGORIES.filter(([value]) => value).map(
                ([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </label>
          <label>
            Employment type
            <select
              name="employmentType"
              value={form.employmentType}
              onChange={change}
            >
              {[
                "FULL_TIME",
                "PART_TIME",
                "CONTRACT",
                "INTERNSHIP",
                "REMOTE",
                "HYBRID",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Experience required (years)
            <input
              type="number"
              min="0"
              name="experienceRequired"
              value={form.experienceRequired}
              onChange={change}
            />
          </label>
          <label>
            Salary min
            <input
              type="number"
              min="0"
              name="salaryMin"
              value={form.salaryMin}
              onChange={change}
            />
          </label>
          <label>
            Salary max
            <input
              type="number"
              min="0"
              name="salaryMax"
              value={form.salaryMax}
              onChange={change}
            />
          </label>
          <label>
            Deadline
            <input
              type="date"
              name="deadline"
              value={form.deadline || ""}
              onChange={change}
            />
          </label>
          <label className="full">
            Description
            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={change}
              required
            />
          </label>
          <label className="full">
            Requirements
            <textarea
              name="requirements"
              rows="5"
              value={form.requirements}
              onChange={change}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/company/jobs")}
          >
            Cancel
          </button>
          <button className="primary-button" disabled={saving}>
            {saving ? "Saving…" : id ? "Save changes" : "Create job"}
          </button>
        </div>
      </form>
    </div>
  );
}
