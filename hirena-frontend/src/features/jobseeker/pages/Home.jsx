import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanies, getJobs } from "../services/jobseekerService";
import { JOB_CATEGORIES } from "../../../constants/jobSeekerProfile";

const categoryIcons = ["💻", "🎨", "☁️", "🛠️", "📊", "🧪", "🧰", "💼"];
const categories = JOB_CATEGORIES.filter(([value]) => value)
  .slice(0, 8)
  .map(([value, name], index) => ({ value, name, icon: categoryIcons[index] }));
export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [jobCount, setJobCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  useEffect(() => {
    getJobs({ size: 6, sort: "createdAt,desc" })
      .then((data) => {
        setJobs(data.content || []);
        setJobCount(data.totalElements || data.content?.length || 0);
      })
      .catch(() => setJobs([]));
    getCompanies({ size: 1 })
      .then((data) =>
        setCompanyCount(data.totalElements || data.content?.length || 0),
      )
      .catch(() => setCompanyCount(0));
  }, []);
  const search = (e) => {
    e.preventDefault();
    navigate(
      `/jobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`,
    );
  };
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-kicker">
            THE CAREER PLATFORM FOR YOUR NEXT MOVE
          </span>
          <h1>
            Find the right job.
            <br />
            <em>Build your future.</em>
          </h1>
          <p>
            Discover meaningful opportunities with companies building the
            future. Your next career move is closer than you think.
          </p>
        </div>
        <div className="hero-art">
          <div className="hero-orb">✦</div>
          <div className="hero-card hero-card-one">
            <span>New opportunity</span>
            <strong>Product Designer</strong>
            <small>Remote · Full time</small>
          </div>
          <div className="hero-card hero-card-two">
            <b>✓</b>
            <span>Career growth</span>
          </div>
        </div>
      </section>
      <section className="search-panel">
        <div>
          <span className="eyebrow">OPPORTUNITY AWAITS</span>
          <h2>Search your next role</h2>
        </div>
        <form className="job-search-form" onSubmit={search}>
          <label>
            <span>⌕</span>
            <input
              placeholder="Search job title / skills"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
          <label>
            <span>⌖</span>
            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <button className="primary-button">Search jobs</button>
        </form>
      </section>
      <section className="home-stats">
        <div>
          <strong>{jobCount || "10,000+"}</strong>
          <span>Jobs</span>
        </div>
        <div>
          <strong>{companyCount || "500+"}</strong>
          <span>Companies</span>
        </div>
        <div>
          <strong>98%</strong>
          <span>Career satisfaction</span>
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE JOBS</span>
            <h2>Explore Jobs</h2>
          </div>
          <button onClick={() => navigate("/jobs")}>View all jobs →</button>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.value}
              className="category-card"
              onClick={() => navigate(`/jobs?category=${category.value}`)}
            >
              <span>{category.icon}</span>
              <strong>{category.name}</strong>
              <small>Explore opportunities</small>
            </button>
          ))}
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CURATED FOR YOU</span>
            <h2>Featured Jobs</h2>
          </div>
          <button onClick={() => navigate("/jobs")}>View all jobs →</button>
        </div>
        <div className="job-card-grid">
          {jobs.slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {!jobs.length && (
            <p className="empty-state">
              Explore our jobs board to find your next opportunity.
            </p>
          )}
        </div>
      </section>
      <section className="how-section">
        <div>
          <span className="eyebrow">A SIMPLER WAY TO SEARCH</span>
          <h2>How HIRENA works</h2>
          <p>Everything you need to make your next move with confidence.</p>
        </div>
        <div className="how-steps">
          <Step
            number="01"
            title="Discover"
            text="Browse roles from companies that value your skills."
          />
          <Step
            number="02"
            title="Apply"
            text="Share your story with a simple, focused application."
          />
          <Step
            number="03"
            title="Grow"
            text="Connect with the team and start your next chapter."
          />
        </div>
      </section>
      <section className="home-cta">
        <div>
          <span className="eyebrow">READY WHEN YOU ARE</span>
          <h2>Your next opportunity is out there.</h2>
          <p>Take the first step toward work you'll be proud of.</p>
        </div>
        <button className="hero-cta" onClick={() => navigate("/jobs")}>
          Start exploring <span>→</span>
        </button>
      </section>
    </div>
  );
}
function Step({ number, title, text }) {
  return (
    <div className="how-step">
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
export function JobCard({ job }) {
  const navigate = useNavigate();
  return (
    <article className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="job-company-mark">
        {job.companyName?.charAt(0) || "H"}
      </div>
      <div className="job-card-body">
        <div className="job-card-top">
          <h3>{job.title}</h3>
          <span>♡</span>
        </div>
        <p>{job.companyName}</p>
        <div className="job-tags">
          <span>{job.location || "Remote"}</span>
          <span>{job.employmentType?.replaceAll("_", " ")}</span>
          {job.category && <span>{job.category.replaceAll("_", " ")}</span>}
        </div>
      </div>
    </article>
  );
}
