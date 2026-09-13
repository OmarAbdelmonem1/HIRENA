import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompany } from "../services/jobseekerService";
import { JobCard } from "./Home";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getCompany(id)
      .then(setData)
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load company."),
      );
  }, [id]);
  if (error)
    return (
      <div className="profile-page">
        <p className="form-error">{error}</p>
      </div>
    );
  if (!data)
    return (
      <div className="profile-page">
        <p className="empty-state">Loading company…</p>
      </div>
    );
  const { company, jobs } = data;
  return (
    <div className="profile-page">
      <button className="back-link" onClick={() => navigate("/companies")}>
        ← Back to companies
      </button>
      <section className="company-profile-hero">
        <div className="job-company-mark large">
          {company.companyName?.charAt(0) || "H"}
        </div>
        <div>
          <span className="eyebrow">{company.industry || "Company"}</span>
          <h1>{company.companyName}</h1>
          <p>
            {company.city || company.country || "Location not specified"}
            {company.website ? ` · ${company.website}` : ""}
          </p>
        </div>
      </section>
      <section className="home-section">
        <h2>About {company.companyName}</h2>
        <p>
          {company.description ||
            "This company has not added a description yet."}
        </p>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <h2>Open positions</h2>
          <span>{jobs.totalElements} jobs</span>
        </div>
        <div className="job-card-grid">
          {jobs.content.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        {!jobs.content.length && (
          <p className="empty-state">No open positions right now.</p>
        )}
      </section>
    </div>
  );
}
