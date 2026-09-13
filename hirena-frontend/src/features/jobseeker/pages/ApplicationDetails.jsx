import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplication } from '../Services/jobseekerService';
export default function ApplicationDetails() {
  const { id } = useParams(); const navigate = useNavigate(); const [app, setApp] = useState(null); const [error, setError] = useState('');
  useEffect(() => { getApplication(id).then(setApp).catch((e) => setError(e.response?.data?.message || 'Could not load application.')); }, [id]);
  if (error) return <p className="empty-state">{error}</p>; if (!app) return <p className="empty-state">Loading application…</p>;
  return <div className="narrow-page"><button className="back-link" onClick={() => navigate('/applications')}>← Back to applications</button><section className="application-detail panel"><span className={`application-status ${app.status?.toLowerCase()}`}>{app.status}</span><h1>{app.jobTitle}</h1><p className="detail-company">{app.companyName}</p><div className="application-timeline"><div className="timeline-dot active" /><div><strong>Application submitted</strong><span>{app.appliedAt ? new Date(app.appliedAt).toLocaleString() : 'Recently'}</span></div><div className="timeline-line" /><div className={`timeline-dot ${app.status !== 'PENDING' ? 'active' : ''}`} /><div><strong>Current status</strong><span>{app.status}</span></div></div><h2>Your cover letter</h2><p className="detail-copy">{app.coverLetter || 'No cover letter provided.'}</p></section></div>;
}
