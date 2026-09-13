import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobCard } from './Home';
export default function SavedJobs() {
  const navigate = useNavigate(); const [jobs, setJobs] = useState(() => JSON.parse(localStorage.getItem('saved_jobs') || '[]'));
  const remove = (id) => { const next = jobs.filter((job) => job.id !== id); localStorage.setItem('saved_jobs', JSON.stringify(next)); setJobs(next); };
  return <div className="profile-page"><section className="page-intro"><span className="eyebrow">KEEP AN EYE ON THEM</span><h1>Saved jobs</h1><p>Opportunities you want to come back to.</p></section><div className="job-card-grid">{jobs.map((job) => <div className="saved-job-wrap" key={job.id}><JobCard job={job} /><button onClick={() => remove(job.id)}>Remove</button></div>)}{!jobs.length && <p className="empty-state">No saved jobs yet. <button onClick={() => navigate('/jobs')}>Browse opportunities</button></p>}</div></div>;
}
