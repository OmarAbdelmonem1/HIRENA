import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompanyJob } from '../../Services/companyService';
const text = (v) => v?.replaceAll('_', ' ') || '—';
export default function CompanyJobDetails() {
  const { id } = useParams(); const navigate = useNavigate(); const [job, setJob] = useState(null); const [error, setError] = useState('');
  useEffect(() => { getCompanyJob(id).then(setJob).catch((e) => setError(e.response?.data?.message || 'Could not load job.')); }, [id]);
  if (error) return <p className="table-message error">{error}</p>; if (!job) return <p className="table-message">Loading job…</p>;
  return <div className="admin-page"><header className="admin-header"><div><p className="eyebrow">Job details</p><h1>{job.title}</h1></div><div className="modal-actions"><button onClick={() => navigate('/company/jobs')}>← Back</button><button className="primary-button" onClick={() => navigate(`/company/jobs/${id}/edit`)}>Edit job</button></div></header><section className="panel detail-panel"><div className="detail-meta"><span className="status-badge">{text(job.status)}</span><span>{text(job.employmentType)}</span><span>{job.location || 'Location not specified'}</span><span>{job.experienceRequired ?? 0} years experience</span></div><h2>Description</h2><p className="detail-copy">{job.description}</p><h2>Requirements</h2><p className="detail-copy">{job.requirements || 'No requirements provided.'}</p><h2>Salary</h2><p>{job.salaryMin || job.salaryMax ? `${job.salaryMin || '—'} - ${job.salaryMax || '—'}` : 'Not specified'}</p><button className="primary-button" onClick={() => navigate(`/company/applications?jobId=${id}`)}>View applications</button></section></div>;
}
