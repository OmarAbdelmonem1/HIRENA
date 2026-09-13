export default function CoverLetterCard({ application }) {
  return (
    <section className="application-card">
      <p className="eyebrow">Applicant message</p>
      <h2>Cover letter</h2>
      <p className="detail-copy">
        {application.coverLetter || "No cover letter provided."}
      </p>
    </section>
  );
}
