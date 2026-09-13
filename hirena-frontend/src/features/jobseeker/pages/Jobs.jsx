import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getJobs } from '../Services/jobseekerService';
import { JobCard } from './Home';
export default function Jobs() {
  const [params] = useSearchParams(); const navigate = useNavigate(); const [jobs, setJobs] = useState([]); const [keyword, setKeyword] = useState(params.get('keyword') || ''); const [location, setLocation] = useState(params.get('location') || ''); const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); getJobs({ size: 50, sort: 'createdAt,desc' }).then((data) => setJobs(data.content || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = jobs.filter((job) => `${job.title} ${job.companyName} ${job.description}`.toLowerCase().includes(keyword.toLowerCase()) && (!location || job.location?.toLowerCase().includes(location.toLowerCase())));
  return <div className="listing-page"><section className="listing-hero"><span className="eyebrow">MAKE YOUR MOVE</span><h1>Find your next opportunity</h1><p>Search roles that match your ambitions and skills.</p><div className="listing-search"><input placeholder="Job title or keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} /><input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} /><button className="primary-button">Search</button></div></section><div className="listing-layout"><aside className="listing-sidebar"><strong>Search results</strong><span>{filtered.length} opportunities found</span><button onClick={() => { setKeyword(''); setLocation(''); }}>Clear filters</button></aside><main><div className="section-heading"><h2>All jobs</h2><button onClick={() => navigate('/')}>← Back home</button></div>{loading ? <p className="empty-state">Loading opportunities…</p> : <div className="job-card-grid">{filtered.map((job) => <JobCard key={job.id} job={job} />)}{!filtered.length && <p className="empty-state">No jobs match your search. Try another keyword.</p>}</div>}</main></div></div>;
}
