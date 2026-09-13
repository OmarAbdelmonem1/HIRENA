import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminApplicationCv,
  getApplicationById,
} from "../../services/applicationsService.js";
import ApplicationHeader from "../../../../components/applications/ApplicationHeader";
import CandidateProfileCard from "../../../../components/applications/CandidateProfileCard";
import CoverLetterCard from "../../../../components/applications/CoverLetterCard";
import CvAnalysisCard from "../../../../components/applications/CvAnalysisCard";
import CvCard from "../../../../components/applications/CvCard";
import useApplicationPolling from "../../../../hooks/useApplicationPolling";
import LoadingState from "../../../../components/ui/LoadingState";
import ErrorMessage from "../../../../components/ui/ErrorMessage";
import EmptyState from "../../../../components/ui/EmptyState";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (e) {
        setError(e.response?.data?.message || e.message || "Failed to load application");
      } finally {
        if (showLoading) setLoading(false);
      }
    }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useApplicationPolling(
    () => load(false),
    application?.cvAnalysis?.status === "ANALYZING",
  );

  if (loading) return <LoadingState message="Loading application…" />;
  if (error) return <ErrorMessage message={error} />;
  if (!application) return <EmptyState message="Application not found." />;

  return (
    <div className="company-application-page">
      <ApplicationHeader
        application={application}
        eyebrow="Admin application review"
        backLabel="Back to applications"
        onBack={() => navigate("/admin/applications")}
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
            loadCv={() => getAdminApplicationCv(id)}
            onError={setError}
            description="Candidate resume attached to this application."
          />
          <section className="application-side-card">
            <p className="eyebrow">Application</p>
            <h3>Submission details</h3>
            <p>
              Submitted{" "}
              {application.appliedAt
                ? new Date(application.appliedAt).toLocaleString()
                : "—"}
            </p>
            <p>Company: {application.companyName || "Not available"}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
