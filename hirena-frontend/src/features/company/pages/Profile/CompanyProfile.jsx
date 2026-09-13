import { useEffect, useState } from "react";
import {
  createCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
} from "../../services/companyService";
import { COUNTRIES } from "../../../../constants/jobSeekerProfile";
import { COMPANY_INDUSTRIES } from "../../../../constants/company";

const initial = {
  companyName: "",
  description: "",
  industry: "",
  companyPhone: "",
  website: "",
  address: "",
  city: "",
  country: "",
  foundedYear: "",
  companySize: "",
  logo: "",
};

function CompanyProfile() {
  const [form, setForm] = useState(initial);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getCompanyProfile()
      .then((data) => {
        setForm({ ...initial, ...data });
        setExists(true);
      })
      .catch((e) => {
        if (e.response?.status !== 404)
          setError(
            e.response?.data?.message || "Could not load company profile.",
          );
      })
      .finally(() => setLoading(false));
  }, []);

  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const data = {
        ...form,
        foundedYear: form.foundedYear === "" ? null : Number(form.foundedYear),
      };
      const saved = exists
        ? await updateCompanyProfile(data)
        : await createCompanyProfile(data);
      setForm({ ...initial, ...saved });
      setExists(true);
      setMessage("Company profile saved successfully.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not save company profile.");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !exists) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      )
    ) {
      setError("Please upload a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Company logo must be 5 MB or smaller.");
      return;
    }
    setUploading(true);
    setError("");
    setMessage("");
    try {
      setForm({ ...initial, ...(await uploadCompanyLogo(file)) });
      setMessage("Company logo uploaded successfully.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not upload company logo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="company-page narrow-page">
      <section className="page-intro">
        <span className="eyebrow">COMPANY PROFILE</span>
        <h1>Build your company presence</h1>
        <p>
          Give candidates the information they need to trust and understand your
          company.
        </p>
      </section>
      <form className="profile-form panel" onSubmit={submit}>
        {(error || message) && (
          <div
            className={`profile-status ${error ? "is-error" : "is-success"}`}
            role="status"
          >
            <span>{error ? "!" : "✓"}</span>
            <p>{error || message}</p>
          </div>
        )}
        <div className="company-logo-card">
          <div className="company-logo-preview">
            {form.logo ? (
              <img src={form.logo} alt="Company logo" />
            ) : (
              form.companyName?.[0] || "?"
            )}
          </div>
          <div>
            <strong>Company logo</strong>
            <p>JPG, PNG, WebP, or GIF up to 5 MB.</p>
          </div>
          <label className="secondary-button upload-inline-button">
            {uploading ? "Uploading…" : "Upload logo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={uploadLogo}
              disabled={uploading || !exists}
            />
          </label>
        </div>
        <div className="form-two">
          <label>
            Company name
            <input
              name="companyName"
              value={form.companyName}
              onChange={change}
              required
            />
          </label>
          <label>
            Industry
            <select name="industry" value={form.industry || ""} onChange={change}>
              <option value="">Select industry</option>
              {COMPANY_INDUSTRIES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Company phone
            <input
              name="companyPhone"
              value={form.companyPhone}
              onChange={change}
            />
          </label>
          <label>
            Website
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={change}
              placeholder="https://example.com"
            />
          </label>
          <label>
            City
            <input name="city" value={form.city} onChange={change} />
          </label>
          <label>
            Country
            <select name="country" value={form.country} onChange={change}>
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <label>
            Address
            <input name="address" value={form.address} onChange={change} />
          </label>
          <label>
            Founded year
            <input
              type="number"
              min="1800"
              max="2100"
              name="foundedYear"
              value={form.foundedYear}
              onChange={change}
            />
          </label>
          <label>
            Company size
            <input
              name="companySize"
              value={form.companySize}
              onChange={change}
              placeholder="e.g. 11-50 employees"
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            name="description"
            rows="6"
            value={form.description}
            onChange={change}
            placeholder="Tell candidates about your mission and culture..."
          />
        </label>
        <div className="form-actions">
          <button className="primary-button" disabled={loading || saving}>
            {saving ? "Saving…" : "Save company profile →"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompanyProfile;
