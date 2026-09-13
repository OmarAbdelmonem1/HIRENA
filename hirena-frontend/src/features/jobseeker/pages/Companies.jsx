import { useEffect, useState } from 'react';
import { getCompanies } from '../Services/jobseekerService';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { getCompanies().then(setCompanies).catch((e) => setError(e.response?.data?.message || 'Could not load companies.')); }, []);
  return <div className="profile-page"><section className="page-intro"><span className="eyebrow">MEET THE TEAMS</span><h1>Companies</h1><p>Explore the companies creating your next opportunity.</p></section>{error && <p className="form-error">{error}</p>}<div className="company-grid">{companies.map((company) => <article className="company-card" key={company.id}><div className="job-company-mark large">{company.companyName?.charAt(0) || 'H'}</div><h3>{company.companyName}</h3><span>{company.industry || 'Growing team'}</span><p>{company.description || 'Discover opportunities and learn more about this company.'}</p><small>{company.city || company.country || 'Location not specified'}</small></article>)}</div>{!companies.length && !error && <p className="empty-state">Loading companies…</p>}</div>;
}
