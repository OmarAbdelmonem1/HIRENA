import OpenCvButton from "./OpenCvButton";

export default function CvCard({ application, loadCv, onError, description }) {
  return (
    <section className="application-side-card cv-card">
      <div className="cv-icon">CV</div>
      <p className="eyebrow">Resume</p>
      <h3>{application.jobSeekerCvFileName || "No CV uploaded"}</h3>
      <p>
        {application.jobSeekerCvFileName
          ? description
          : "This candidate has not uploaded a CV yet."}
      </p>
      {application.jobSeekerCvFileName && (
        <OpenCvButton loadCv={loadCv} onError={onError} />
      )}
    </section>
  );
}
