import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCompanies } from '../Services/jobseekerService';

export default function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ keyword: searchParams.get('keyword') || '', industry: searchParams.get('industry') || '' });
  useEffect(() => { getCompanies({ ...filters, page: Number(searchParams.get('page') || 0), size: 12 }).then((data) => { setCompanies(data.content || []); setPage(data); }).catch((e) => setError(e.response?.data?.message || 'Could not load companies.')); }, [searchParams]);
  const submit = (event) => { event.preventDefault(); const next = new URLSearchParams(); Object.entries(filters).forEach(([key, value]) => value && next.set(key, value)); setSearchParams(next); };
  const change = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  return <div className="profile-page"><section className="page-intro"><span className="eyebrow">MEET THE TEAMS</span><h1>Companies</h1><p>Explore companies and discover their open roles.</p><form className="listing-search jobs-search" onSubmit={submit}><input name="keyword" placeholder="Search company" value={filters.keyword} onChange={change} /><input name="industry" placeholder="Industry e.g. Technology" value={filters.industry} onChange={change} /><button className="primary-button">Search</button></form></section>{error && <p className="form-error">{error}</p>}<div className="company-grid">{companies.map((company) => <article className="company-card" key={company.id} onClick={() => navigate(`/companies/${company.id}`)}><div className="job-company-mark large">{company.companyName?.charAt(0) || 'H'}</div><h3>{company.companyName}</h3><span>{company.industry || 'Growing team'}</span><p>{company.description || 'Discover opportunities and learn more about this company.'}</p><small>{company.city || company.country || 'Location not specified'}</small><button className="text-button">View company →</button></article>)}</div>{!companies.length && !error && <p className="empty-state">No companies found.</p>}{page?.totalPages > 1 && <div className="pagination"><button disabled={page.first} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page.number - 1) })}>Previous</button><span>Page {page.number + 1} of {page.totalPages}</span><button disabled={page.last} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page.number + 1) })}>Next</button></div>}</div>;
}
