import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getJobs } from "../services/jobseekerService";
import { JobCard } from "./Home";
import { COUNTRIES, JOB_CATEGORIES } from "../../../constants/jobSeekerProfile";
import useAsyncRequest from "../../../hooks/useAsyncRequest";
import useForm from "../../../hooks/useForm";

const EMPLOYMENT_TYPES = [
  ["", "All employment types"],
  ["FULL_TIME", "Full time"],
  ["PART_TIME", "Part time"],
  ["CONTRACT", "Contract"],
  ["INTERNSHIP", "Internship"],
  ["REMOTE", "Remote"],
  ["HYBRID", "Hybrid"],
];

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    data: page,
    loading,
    error,
    execute: loadJobs,
  } = useAsyncRequest(getJobs, { initialData: { content: [] } });
  const jobs = page?.content || [];
  const { values: filters, setValues: setFilters, handleChange: change } = useForm({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    employmentType: searchParams.get("employmentType") || "",
    category: searchParams.get("category") || "",
    minExperience: searchParams.get("minExperience") || "",
    sort: searchParams.get("sort") || "createdAt,desc",
  });

  const load = (nextFilters = filters) =>
    loadJobs({
      ...nextFilters,
      page: Number(searchParams.get("page") || 0),
      size: 12,
      sort: nextFilters.sort,
    }).catch(() => {});

  useEffect(() => {
    load();
  }, [searchParams, loadJobs]);

  const search = (event) => {
    event.preventDefault();
    const next = new URLSearchParams();
    Object.entries(filters).forEach(
      ([key, value]) => value && next.set(key, value),
    );
    setSearchParams(next);
  };

  const clear = () => {
    const next = {
      keyword: "",
      location: "",
      employmentType: "",
      category: "",
      minExperience: "",
      sort: "createdAt,desc",
    };
    setFilters(next);
    setSearchParams({});
  };

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <div className="listing-page">
      <section className="listing-hero jobs-hero">
        <span className="eyebrow">MAKE YOUR MOVE</span>
        <h1>Find your next opportunity</h1>
        <p>Search thousands of roles using filters that match your goals.</p>
        <form className="listing-search jobs-search" onSubmit={search}>
          <input
            name="keyword"
            placeholder="Job title, skill, or company"
            value={filters.keyword}
            onChange={change}
          />
          <select
            name="location"
            value={filters.location}
            onChange={change}
            aria-label="Country"
          >
            <option value="">All countries</option>
            {COUNTRIES.map((country) => (
              <option value={country} key={country}>
                {country}
              </option>
            ))}
          </select>
          <button className="primary-button" type="submit">
            Search jobs
          </button>
        </form>
      </section>

      <div className="listing-layout jobs-listing-layout">
        <aside className="listing-sidebar jobs-filters">
          <div className="filter-heading">
            <strong>Filter jobs</strong>
            <button type="button" onClick={clear}>
              Clear all
            </button>
          </div>
          <label>
            Employment type
            <select
              name="employmentType"
              value={filters.employmentType}
              onChange={change}
            >
              {EMPLOYMENT_TYPES.map(([value, label]) => (
                <option value={value} key={value || "all"}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Category
            <select name="category" value={filters.category} onChange={change}>
              {JOB_CATEGORIES.map(([value, label]) => (
                <option value={value} key={value || "all-categories"}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Minimum experience
            <select
              name="minExperience"
              value={filters.minExperience}
              onChange={change}
            >
              <option value="">Any experience</option>
              <option value="0">Entry level</option>
              <option value="2">2+ years</option>
              <option value="5">5+ years</option>
              <option value="8">8+ years</option>
            </select>
          </label>
          <label>
            Sort by
            <select name="sort" value={filters.sort} onChange={change}>
              <option value="createdAt,desc">Newest first</option>
              <option value="createdAt,asc">Oldest first</option>
              <option value="title,asc">Title A-Z</option>
              <option value="experienceRequired,asc">Least experience</option>
            </select>
          </label>
          <button
            className="primary-button filter-apply"
            type="button"
            onClick={search}
          >
            Apply filters
          </button>
        </aside>

        <main>
          <div className="section-heading">
            <div>
              <span className="eyebrow">LATEST OPENINGS</span>
              <h2>{page?.totalElements || 0} opportunities</h2>
            </div>
            <button onClick={() => navigate("/")}>← Back home</button>
          </div>
          {loading && <p className="empty-state">Loading opportunities…</p>}
          {error && <p className="form-error">{error}</p>}
          {!loading && !error && (
            <div className="job-card-grid">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
          {!loading && !error && !jobs.length && (
            <p className="empty-state">
              No jobs match these filters. Try a different search.
            </p>
          )}
          {page && page.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page.first}
                onClick={() => goToPage(page.number - 1)}
              >
                Previous
              </button>
              <span>
                Page {page.number + 1} of {page.totalPages}
              </span>
              <button
                disabled={page.last}
                onClick={() => goToPage(page.number + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Jobs;
