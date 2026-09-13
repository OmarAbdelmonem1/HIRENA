import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCompanyApplication,
  getCompanyApplicationCv,
  updateCompanyApplicationStatus,
} from "../../services/companyService";
import ApplicationHeader from "../../../../components/applications/ApplicationHeader";
import CandidateProfileCard from "../../../../components/applications/CandidateProfileCard";
import CoverLetterCard from "../../../../components/applications/CoverLetterCard";
import CvAnalysisCard from "../../../../components/applications/CvAnalysisCard";
import CvCard from "../../../../components/applications/CvCard";
import useApplicationPolling from "../../../../hooks/useApplicationPolling";
import LoadingState from "../../../../components/ui/LoadingState";
import ErrorMessage from "../../../../components/ui/ErrorMessage";

export default function CompanyApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
      try {
        const data = await getCompanyApplication(id);
        setApplication(data);
      } catch (e) {
        setError(e.response?.data?.message || "Could not load application.");
      }
    }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useApplicationPolling(
    load,
    application?.cvAnalysis?.status === "ANALYZING",
  );

  const update = async (status) => {
    setSaving(true);
    setError("");
    try {
      setApplication(await updateCompanyApplicationStatus(id, status));
    } catch (e) {
      setError(e.response?.data?.message || "Could not update application.");
    } finally {
      setSaving(false);
    }
  };

  if (error && !application) return <ErrorMessage message={error} />;
  if (!application) return <LoadingState message="Loading application…" />;

  return (
    <div className="company-application-page">
      <ApplicationHeader
        application={application}
        eyebrow="Candidate review"
        backLabel="Back to applications"
        onBack={() => navigate(`/company/applications?jobId=${application.jobId}`)}
      />
      <div className="application-details-grid">
        <main>
          <CandidateProfileCard application={application} />
          <CvAnalysisCard application={application} />
          <CoverLetterCard application={application} />
        </main>
        <aside>
          <CvCard
            application={application}
            loadCv={() => getCompanyApplicationCv(id)}
            onError={setError}
            description="Review the candidate resume before making your decision."
          />
          <section className="application-side-card">
            <p className="eyebrow">Decision</p>
            <h3>Update application</h3>
            <ErrorMessage message={error} />
            {application.status !== "ACCEPTED" &&
            application.status !== "REJECTED" ? (
              <div className="decision-actions">
                <button
                  disabled={saving}
                  onClick={() => update("REJECTED")}
                  className="danger-button"
                >
                  Reject
                </button>
                <button
                  disabled={saving}
                  onClick={() => update("ACCEPTED")}
                  className="primary-button"
                >
                  Accept application
                </button>
              </div>
            ) : (
              <p className="decision-complete">
                This application is {application.status.toLowerCase()}.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
