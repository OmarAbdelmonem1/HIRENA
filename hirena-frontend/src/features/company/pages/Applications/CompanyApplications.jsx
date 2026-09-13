import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getApplicationsForJob,
  getCompanyJobs,
} from "../../services/companyService";
import StatusBadge from "../../../../components/ui/StatusBadge";
import ErrorMessage from "../../../../components/ui/ErrorMessage";
import EmptyState from "../../../../components/ui/EmptyState";

const text = (value) => value?.replaceAll("_", " ") || "—";

export default function CompanyApplications() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selectedJobId = params.get("jobId");
  const selectedJob = jobs.find((job) => String(job.id) === selectedJobId);

  useEffect(() => {
    getCompanyJobs()
      .then((data) => setJobs(data))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load your jobs."),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedJobId) {
      setApplications([]);
      return;
    }
    setLoading(true);
    getApplicationsForJob(selectedJobId)
      .then(setApplications)
      .catch((e) =>
        setError(
          e.response?.data?.message ||
            "Could not load applications for this job.",
        ),
      )
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const filtered = useMemo(
    () =>
      applications.filter(
        (application) =>
          (!status || application.status === status) &&
          `${application.jobSeekerFirstName} ${application.jobSeekerLastName}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [applications, query, status],
  );

  const selectJob = (jobId) => setParams({ jobId: String(jobId) });

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Hiring pipeline</p>
          <h1>Applications by job</h1>
        </div>
      </header>
      <ErrorMessage message={error} />
      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2>Select a job</h2>
          </div>
          <span>{jobs.length} jobs</span>
        </div>
        <div className="job-selection-grid">
          {jobs.map((job) => (
            <button
              type="button"
              className={`job-selection-card ${selectedJobId === String(job.id) ? "selected" : ""}`}
              key={job.id}
              onClick={() => selectJob(job.id)}
            >
              <strong>{job.title}</strong>
              <span>{job.location || "Location not specified"}</span>
              <small>{text(job.status)}</small>
            </button>
          ))}
        </div>
        {!jobs.length && !loading && (
          <p className="table-message">
            Create a job before reviewing applications.
          </p>
        )}
      </section>
      {selectedJob && (
        <section className="panel table-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Step 2</p>
              <h2>Applications for {selectedJob.title}</h2>
            </div>
            <span>{applications.length} applicants</span>
          </div>
          <div className="filters-row">
            <div className="search-box">
              <span>⌕</span>
              <input
                placeholder="Search candidate..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Status: All</option>
              {["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>STATUS</th>
                  <th>APPLIED AT</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <strong>
                        {application.jobSeekerFirstName}{" "}
                        {application.jobSeekerLastName}
                      </strong>
                      <br />
                      <small>
                        {application.jobSeekerEmail || "Email not available"}
                      </small>
                    </td>
                    <td>
                      <StatusBadge status={application.status} />
                    </td>
                    <td>
                      {application.appliedAt
                        ? new Date(application.appliedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/company/applications/${application.id}`)
                        }
                      >
                        View candidate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <EmptyState message="No applications match your filters." />
            )}
          </div>
        </section>
      )}
      {!selectedJobId && !loading && (
        <p className="empty-state">
          Select a job above to view its applications.
        </p>
      )}
    </div>
  );
}
