import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCompanyJob, getCompanyJobs } from '../../Services/companyService';

const text = (v) => v?.replaceAll('_', ' ') || '—';
const tone = (v) => v === 'APPROVED' ? 'green' : v === 'REJECTED' ? 'red' : 'orange';

export default function CompanyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]); const [query, setQuery] = useState(''); const [status, setStatus] = useState(''); const [error, setError] = useState('');
  const load = () => getCompanyJobs().then(setJobs).catch((e) => setError(e.response?.data?.message || 'Could not load jobs.'));
  useEffect(() => { load(); }, []);
  const remove = async (job) => { if (!window.confirm(`Delete "${job.title}"?`)) return; try { await deleteCompanyJob(job.id); load(); } catch (e) { setError(e.response?.data?.message || 'Could not delete job.'); } };
  const filtered = jobs.filter((job) => (!status || job.status === status) && job.title.toLowerCase().includes(query.toLowerCase()));
  return <div className="admin-page"><header className="admin-header"><div><p className="eyebrow">Management</p><h1>My jobs</h1></div><button className="primary-button" onClick={() => navigate('/company/jobs/create')}>+ Create job</button></header>
    <section className="panel table-panel"><div className="filters-row"><div className="search-box"><span>⌕</span><input placeholder="Search jobs..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Status: All</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></div>
      {error && <p className="table-message error">{error}</p>}<div className="table-wrap"><table><thead><tr><th>TITLE</th><th>LOCATION</th><th>TYPE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map((job) => <tr key={job.id}><td><strong>{job.title}</strong></td><td>{job.location || '—'}</td><td>{text(job.employmentType)}</td><td><span className={`status-badge ${tone(job.status)}`}>{text(job.status)}</span></td><td className="job-actions"><button onClick={() => navigate(`/company/jobs/${job.id}`)}>View</button><button onClick={() => navigate(`/company/jobs/${job.id}/edit`)}>Edit</button><button className="delete-action" onClick={() => remove(job)}>Delete</button></td></tr>)}</tbody></table>{!filtered.length && <p className="table-message">No jobs match your filters.</p>}</div>
    </section></div>;
}
