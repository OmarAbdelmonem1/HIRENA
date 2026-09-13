import StatusBadge from "../ui/StatusBadge";

export default function ApplicationHeader({
  application,
  eyebrow,
  backLabel,
  onBack,
}) {
  return (
    <header className="application-page-header">
      <button className="back-link" onClick={onBack}>
        ← {backLabel}
      </button>
      <div className="application-header-row">
        <div className="candidate-avatar">
          {application.jobSeekerFirstName?.charAt(0)}
          {application.jobSeekerLastName?.charAt(0)}
        </div>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>
            {application.jobSeekerFirstName} {application.jobSeekerLastName}
          </h1>
          <p className="application-subtitle">
            Application for <strong>{application.jobTitle}</strong>
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>
    </header>
  );
}
