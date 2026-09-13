export default function CandidateProfileCard({ application }) {
  return (
    <section className="application-card">
      <div className="card-heading">
        <p className="eyebrow">Candidate profile</p>
        <h2>Professional snapshot</h2>
      </div>
      <div className="candidate-facts">
        <div>
          <span>Email</span>
          <strong>{application.jobSeekerEmail || "Not available"}</strong>
        </div>
        <div>
          <span>Phone</span>
          <strong>{application.jobSeekerPhone || "Not available"}</strong>
        </div>
        <div>
          <span>Location</span>
          <strong>
            {[application.jobSeekerCity, application.jobSeekerCountry]
              .filter(Boolean)
              .join(", ") || "Not specified"}
          </strong>
        </div>
        <div>
          <span>Target role</span>
          <strong>
            {application.jobSeekerTargetJobTitle || "Not specified"}
          </strong>
        </div>
        <div>
          <span>Experience</span>
          <strong>{application.jobSeekerYearsOfExperience ?? 0} years</strong>
        </div>
      </div>
      <h3>Professional summary</h3>
      <p className="detail-copy">
        {application.jobSeekerBio || "No professional summary provided."}
      </p>
    </section>
  );
}
