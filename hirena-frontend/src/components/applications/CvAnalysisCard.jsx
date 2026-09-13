export default function CvAnalysisCard({ application }) {
  const analysis = application.cvAnalysis;
  const status = analysis?.status || "NOT_ANALYZED";

  return (
    <section className="application-card cv-analysis-result">
      <div className="cv-analysis-heading">
        <div>
          <p className="eyebrow">AI MATCH ANALYSIS</p>
          <h2>CV to job match</h2>
        </div>
        {status === "COMPLETED" && (
          <strong className="cv-score">{analysis.score}%</strong>
        )}
      </div>
      {status === "ANALYZING" && (
        <p>Analysis is in progress. This page will update automatically.</p>
      )}
      {status === "NOT_ANALYZED" && <p>No CV analysis is available.</p>}
      {status === "FAILED" && (
        <p className="table-message error">
          Analysis failed: {analysis.error || "Unknown error"}
        </p>
      )}
      {status === "COMPLETED" && (
        <>
          <p className="detail-copy">{analysis.summary}</p>
          <div className="cv-analysis-stats">
            Experience match: <strong>{analysis.experienceMatch}%</strong>
          </div>
          <div className="cv-analysis-columns">
            <div>
              <h3>Matched skills</h3>
              <ul>
                {analysis.matchedSkills?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Missing skills</h3>
              <ul>
                {analysis.missingSkills?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          {!!analysis.recommendations?.length && (
            <div>
              <h3>Recommendations</h3>
              <ul>
                {analysis.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
