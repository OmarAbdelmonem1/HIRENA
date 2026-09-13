import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCompanyById,
  updateAdminCompany,
  deleteAdminCompany,
} from "../../services/companiesService";
import CompanyModal from "./CompanyModal";

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCompany = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCompanyById(id);
      setCompany(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load company details",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, [id]);

  const showToast = (msg) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 4000);
  };

  const handleEditSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const updated = await updateAdminCompany(id, payload);
      setCompany(updated);
      setIsModalOpen(false);
      showToast("Company profile updated successfully.");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Failed to update company",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAdminCompany(id);
      navigate("/admin/companies");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete company",
      );
      setIsDeleting(false);
      setIsConfirmDeleteOpen(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <button
            className="text-button back-link"
            onClick={() => navigate("/admin/companies")}
          >
            <span>←</span> Back to companies
          </button>
          <h1>Company details</h1>
        </div>
        {company && (
          <div className="header-actions">
            <button
              className="secondary-button"
              onClick={() => setIsModalOpen(true)}
            >
              Edit profile
            </button>
            <button
              className="danger-button"
              onClick={() => setIsConfirmDeleteOpen(true)}
            >
              Delete company
            </button>
          </div>
        )}
      </header>

      {loading && <p className="table-message">Loading company…</p>}
      {error && <p className="table-message error">{error}</p>}

      {!loading && !error && company && (
        <>
          <section className="panel profile-header">
            {company.logo ? (
              <img
                src={company.logo}
                alt=""
                className="company-logo-large"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "grid";
                }}
              />
            ) : null}
            <div
              className="app-avatar purple profile-avatar"
              style={{ display: company.logo ? "none" : "grid" }}
            >
              {initials(company.companyName)}
            </div>
            <div className="profile-heading">
              <h2>{company.companyName}</h2>
              <p>
                {[company.industry, company.city, company.country]
                  .filter(Boolean)
                  .join(" · ") || "No industry set"}
              </p>
              <span className="skill-chip">
                {company.companySize
                  ? `${company.companySize} employees`
                  : "Company"}
              </span>
            </div>
          </section>

          <section className="dashboard-grid">
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Company information</h3>
                </div>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Company Name</dt>
                  <dd>{company.companyName}</dd>
                </div>
                <div>
                  <dt>User / Account ID</dt>
                  <dd>#{company.userId}</dd>
                </div>
                <div>
                  <dt>Industry</dt>
                  <dd>{company.industry || "—"}</dd>
                </div>
                <div>
                  <dt>Founded Year</dt>
                  <dd>{company.foundedYear || "—"}</dd>
                </div>
                <div>
                  <dt>Company Size</dt>
                  <dd>
                    {company.companySize
                      ? `${company.companySize} employees`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt>Member Since</dt>
                  <dd>{formatDate(company.createdAt)}</dd>
                </div>
                <div>
                  <dt>Last Updated</dt>
                  <dd>{formatDate(company.updatedAt)}</dd>
                </div>
              </dl>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Contact & Location</h3>
                </div>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Phone</dt>
                  <dd>
                    {company.companyPhone ? (
                      <a href={`tel:${company.companyPhone}`}>
                        {company.companyPhone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Website</dt>
                  <dd>
                    {company.website ? (
                      <a
                        href={
                          company.website.startsWith("http")
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {company.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{company.address || "—"}</dd>
                </div>
                <div>
                  <dt>City</dt>
                  <dd>{company.city || "—"}</dd>
                </div>
                <div>
                  <dt>Country</dt>
                  <dd>{company.country || "—"}</dd>
                </div>
              </dl>
            </article>
          </section>

          {company.description && (
            <section className="panel" style={{ marginTop: "20px" }}>
              <div className="panel-heading">
                <div>
                  <h3>About company</h3>
                </div>
              </div>
              <p className="bio-text">{company.description}</p>
            </section>
          )}
        </>
      )}

      {/* Edit Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={company}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      {isConfirmDeleteOpen && company && (
        <div
          className="modal-backdrop"
          onClick={() => setIsConfirmDeleteOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-container confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Delete Company</h3>
              <button
                className="icon-button"
                onClick={() => setIsConfirmDeleteOpen(false)}
              >
                ✕
              </button>
            </div>
            <p className="confirm-text">
              Are you sure you want to delete{" "}
              <strong>{company.companyName}</strong>? All associated jobs and
              company data will be permanently removed.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Delete Company"}
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}
