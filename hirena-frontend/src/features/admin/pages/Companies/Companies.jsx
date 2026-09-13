import { useEffect, useMemo, useState } from "react";
import { COMPANY_INDUSTRIES } from "../../../../constants/company";
import { useNavigate } from "react-router-dom";
import {
  getAdminCompanies,
  createAdminCompany,
  updateAdminCompany,
  deleteAdminCompany,
} from "../../Services/CompaniesService";
import CompanyModal from "./CompanyModal";

const PAGE_SIZE = 10;

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

export function Companies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [notice, setNotice] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminCompanies({ page: 0, size: 1000 });
      setCompanies(data.content || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load companies",
      );
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const showToast = (msg) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 4000);
  };

  const industries = useMemo(() => {
    return COMPANY_INDUSTRIES.map(([value]) => value);
  }, []);

  const cities = useMemo(() => {
    const unique = new Set(companies.map((c) => c.city).filter(Boolean));
    return Array.from(unique).sort();
  }, [companies]);

  const sizes = useMemo(() => {
    const unique = new Set(companies.map((c) => c.companySize).filter(Boolean));
    return Array.from(unique).sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return companies.filter((c) => {
      const name = (c.companyName || "").toLowerCase();
      const industry = (c.industry || "").toLowerCase();
      const city = (c.city || "").toLowerCase();
      const country = (c.country || "").toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        industry.includes(query) ||
        city.includes(query) ||
        country.includes(query) ||
        c.website?.toLowerCase().includes(query) ||
        c.companyPhone?.includes(query);

      const matchesIndustry =
        industryFilter === "all" || c.industry === industryFilter;
      const matchesCity = cityFilter === "all" || c.city === cityFilter;
      const matchesSize = sizeFilter === "all" || c.companySize === sizeFilter;

      return matchesSearch && matchesIndustry && matchesCity && matchesSize;
    });
  }, [companies, search, industryFilter, cityFilter, sizeFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, industryFilter, cityFilter, sizeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompanies.length / PAGE_SIZE),
  );
  const pageCompanies = filteredCompanies.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const stats = useMemo(() => {
    const total = companies.length;
    const distinctIndustries = new Set(
      companies.map((c) => c.industry).filter(Boolean),
    ).size;
    const distinctCities = new Set(companies.map((c) => c.city).filter(Boolean))
      .size;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newThisWeek = companies.filter(
      (c) => c.createdAt && new Date(c.createdAt).getTime() >= weekAgo,
    ).length;

    return { total, distinctIndustries, distinctCities, newThisWeek };
  }, [companies]);

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const handleOpenAdd = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleModalSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingCompany) {
        await updateAdminCompany(editingCompany.id, payload);
        showToast(`Company "${payload.companyName}" updated successfully.`);
      } else {
        await createAdminCompany(payload);
        showToast(`Company "${payload.companyName}" created successfully.`);
      }
      setIsModalOpen(false);
      setEditingCompany(null);
      await loadCompanies();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAdminCompany(deleteTarget.id);
      showToast(`Company "${deleteTarget.companyName}" deleted successfully.`);
      setDeleteTarget(null);
      await loadCompanies();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete company",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Management</p>
          <h1>Companies</h1>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <h2>Registered Companies</h2>
          <p>Manage enterprise employers and recruiters on HIRENA</p>
        </div>
        <button className="primary-button" onClick={handleOpenAdd}>
          <span>＋</span> Add company
        </button>
      </section>

      <section className="metric-grid" aria-label="Company statistics">
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Total companies</span>
            <strong>{stats.total.toLocaleString()}</strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Industries</span>
            <strong className="tone-purple">
              {stats.distinctIndustries.toLocaleString()}
            </strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>Locations (Cities)</span>
            <strong className="tone-green">
              {stats.distinctCities.toLocaleString()}
            </strong>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-copy plain">
            <span>New this week</span>
            <strong className="tone-blue">
              {stats.newThisWeek.toLocaleString()}
            </strong>
          </div>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="filters-row">
          <div className="search-box">
            <span aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Search companies by name, industry, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="all">Industry: All</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">City: All</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
          >
            <option value="all">Size: All</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="table-message error">{error}</p>}
        {loading && !error && (
          <p className="table-message">Loading companies…</p>
        )}
        {!loading && !error && filteredCompanies.length === 0 && (
          <p className="table-message">No companies match your filters.</p>
        )}

        {!loading && !error && filteredCompanies.length > 0 && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>COMPANY</th>
                    <th>INDUSTRY</th>
                    <th>LOCATION</th>
                    <th>SIZE</th>
                    <th>FOUNDED</th>
                    <th>REGISTERED</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {pageCompanies.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="user-cell">
                          {c.logo ? (
                            <img
                              src={c.logo}
                              alt=""
                              className="company-logo-thumbnail"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "grid";
                              }}
                            />
                          ) : null}
                          <div
                            className="app-avatar purple"
                            style={{ display: c.logo ? "none" : "grid" }}
                          >
                            {initials(c.companyName)}
                          </div>
                          <div>
                            <strong>{c.companyName}</strong>
                            <span className="user-subtext">
                              {c.website ? (
                                <a
                                  href={
                                    c.website.startsWith("http")
                                      ? c.website
                                      : `https://${c.website}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {c.website.replace(/^https?:\/\//, "")}
                                </a>
                              ) : (
                                `User #${c.userId}`
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="skill-chip">
                          {c.industry || "General"}
                        </span>
                      </td>
                      <td>
                        {[c.city, c.country].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td>{c.companySize || "—"}</td>
                      <td>{c.foundedYear || "—"}</td>
                      <td>{formatDate(c.createdAt)}</td>
                      <td className="actions-cell">
                        <button
                          className="more-button"
                          aria-label="Row actions"
                          onClick={() =>
                            setOpenMenuId(openMenuId === c.id ? null : c.id)
                          }
                        >
                          •••
                        </button>
                        {openMenuId === c.id && (
                          <div className="row-menu">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/admin/companies/${c.id}`);
                              }}
                            >
                              View details
                            </button>
                            <button
                              onClick={() => {
                                handleOpenEdit(c);
                              }}
                            >
                              Edit company
                            </button>
                            <button
                              className="danger-text"
                              onClick={() => {
                                setOpenMenuId(null);
                                setDeleteTarget(c);
                              }}
                            >
                              Delete company
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                ‹
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  className={n === page ? "active" : ""}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </>
        )}
      </section>

      {/* Add / Edit Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingCompany}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="modal-backdrop"
          onClick={() => setDeleteTarget(null)}
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
                onClick={() => setDeleteTarget(null)}
              >
                ✕
              </button>
            </div>
            <p className="confirm-text">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.companyName}</strong> (ID: {deleteTarget.id}
              )? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={handleDeleteConfirm}
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

export default Companies;
