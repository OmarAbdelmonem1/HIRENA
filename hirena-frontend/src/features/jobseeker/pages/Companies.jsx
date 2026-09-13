import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCompanies } from "../services/jobseekerService";
import useAsyncRequest from "../../../hooks/useAsyncRequest";
import useForm from "../../../hooks/useForm";

export default function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    data: page,
    error,
    execute: loadCompanies,
  } = useAsyncRequest(getCompanies, { initialData: { content: [] } });
  const companies = page?.content || [];
  const { values: filters, handleChange: change } = useForm({
    keyword: searchParams.get("keyword") || "",
    industry: searchParams.get("industry") || "",
  });
  useEffect(() => {
    loadCompanies({
      ...filters,
      page: Number(searchParams.get("page") || 0),
      size: 12,
    }).catch(() => {});
  }, [searchParams, loadCompanies]);
  const submit = (event) => {
    event.preventDefault();
    const next = new URLSearchParams();
    Object.entries(filters).forEach(
      ([key, value]) => value && next.set(key, value),
    );
    setSearchParams(next);
  };
  return (
    <div className="profile-page">
      <section className="page-intro">
        <span className="eyebrow">MEET THE TEAMS</span>
        <h1>Companies</h1>
        <p>Explore companies and discover their open roles.</p>
        <form className="listing-search jobs-search" onSubmit={submit}>
          <input
            name="keyword"
            placeholder="Search company"
            value={filters.keyword}
            onChange={change}
          />
          <input
            name="industry"
            placeholder="Industry e.g. Technology"
            value={filters.industry}
            onChange={change}
          />
          <button className="primary-button">Search</button>
        </form>
      </section>
      {error && <p className="form-error">{error}</p>}
      <div className="company-grid">
        {companies.map((company) => (
          <article
            className="company-card"
            key={company.id}
            onClick={() => navigate(`/companies/${company.id}`)}
          >
            <div className="job-company-mark large">
              {company.companyName?.charAt(0) || "H"}
            </div>
            <h3>{company.companyName}</h3>
            <span>{company.industry || "Growing team"}</span>
            <p>
              {company.description ||
                "Discover opportunities and learn more about this company."}
            </p>
            <small>
              {company.city || company.country || "Location not specified"}
            </small>
            <button className="text-button">View company →</button>
          </article>
        ))}
      </div>
      {!companies.length && !error && (
        <p className="empty-state">No companies found.</p>
      )}
      {page?.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page.first}
            onClick={() =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                page: String(page.number - 1),
              })
            }
          >
            Previous
          </button>
          <span>
            Page {page.number + 1} of {page.totalPages}
          </span>
          <button
            disabled={page.last}
            onClick={() =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                page: String(page.number + 1),
              })
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
