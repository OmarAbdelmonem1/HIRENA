import { useState, useEffect } from "react";
import { COMPANY_INDUSTRIES } from "../../../../constants/company";

const INITIAL_FORM = {
  companyName: "",
  userId: "",
  industry: "",
  companyPhone: "",
  website: "",
  address: "",
  city: "",
  country: "",
  foundedYear: "",
  companySize: "",
  logo: "",
  description: "",
};

export default function CompanyModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || "",
        userId: initialData.userId != null ? initialData.userId : "",
        industry: initialData.industry || "",
        companyPhone: initialData.companyPhone || "",
        website: initialData.website || "",
        address: initialData.address || "",
        city: initialData.city || "",
        country: initialData.country || "",
        foundedYear:
          initialData.foundedYear != null ? initialData.foundedYear : "",
        companySize: initialData.companySize || "",
        logo: initialData.logo || "",
        description: initialData.description || "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.companyName.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!isEdit && (!formData.userId || isNaN(Number(formData.userId)))) {
      setError("A valid User ID is required.");
      return;
    }

    const payload = {
      ...formData,
      companyName: formData.companyName.trim(),
      userId: formData.userId ? Number(formData.userId) : null,
      foundedYear: formData.foundedYear ? Number(formData.foundedYear) : null,
      description: formData.description?.trim() || null,
      industry: formData.industry?.trim() || null,
      companyPhone: formData.companyPhone?.trim() || null,
      website: formData.website?.trim() || null,
      address: formData.address?.trim() || null,
      city: formData.city?.trim() || null,
      country: formData.country?.trim() || null,
      companySize: formData.companySize?.trim() || null,
      logo: formData.logo?.trim() || null,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Operation failed",
      );
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? "Edit Company" : "Add New Company"}</h3>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="companyName">Company Name *</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                placeholder="e.g. Acme Corp"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userId">
                User ID {isEdit ? "(Read-only)" : "*"}
              </label>
              <input
                id="userId"
                name="userId"
                type="number"
                disabled={isEdit}
                required={!isEdit}
                placeholder="e.g. 15"
                value={formData.userId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry || ""}
                onChange={handleChange}
              >
                <option value="">Select industry</option>
                {COMPANY_INDUSTRIES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="companyPhone">Phone</label>
              <input
                id="companyPhone"
                name="companyPhone"
                type="text"
                placeholder="e.g. +1 555-0199"
                value={formData.companyPhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="e.g. Cairo"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="e.g. Egypt"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="foundedYear">Founded Year</label>
              <input
                id="foundedYear"
                name="foundedYear"
                type="number"
                placeholder="e.g. 2020"
                value={formData.foundedYear}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="companySize">Company Size</label>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
              >
                <option value="">Select size...</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="e.g. 123 Tech Avenue"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="logo">Logo URL</label>
              <input
                id="logo"
                name="logo"
                type="text"
                placeholder="https://... or /uploads/..."
                value={formData.logo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                placeholder="Brief description of the company..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving…"
                : isEdit
                  ? "Update Company"
                  : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
