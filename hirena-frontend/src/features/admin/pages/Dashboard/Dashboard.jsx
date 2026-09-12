import { useState } from 'react';
import { useAuth } from '../../../../providers/AuthProvider';
import { getRouteByRole } from '../../../../constants/routes';
const metrics = [
  { label: 'Total Users', value: '1,250', change: '+12.5%', icon: 'users', tone: 'blue' },
  { label: 'Companies', value: '120', change: '+8.2%', icon: 'building', tone: 'purple' },
  { label: 'Active Jobs', value: '340', change: '+15.3%', icon: 'briefcase', tone: 'orange' },
  { label: 'Applications', value: '2,450', change: '+22.4%', icon: 'document', tone: 'green' },
];

const jobs = [
  { title: 'Java Developer', company: 'Google', location: 'Mountain View, CA', status: 'Active', posted: '2h ago', tone: 'green' },
  { title: 'React Developer', company: 'Microsoft', location: 'Redmond, WA', status: 'Active', posted: '5h ago', tone: 'green' },
  { title: 'DevOps Engineer', company: 'Amazon', location: 'Seattle, WA', status: 'Pending', posted: '1d ago', tone: 'orange' },
];

const applications = [
  { initials: 'AA', name: 'Ahmed Ali', role: 'Java Developer', company: 'Google', status: 'Pending', tone: 'orange', color: 'blue' },
  { initials: 'OA', name: 'Omar Ali', role: 'React Developer', company: 'Microsoft', status: 'Accepted', tone: 'green', color: 'purple' },
  { initials: 'SK', name: 'Sara Khaled', role: 'UX Designer', company: 'Apple', status: 'Reviewing', tone: 'blue', color: 'orange' },
];

function MetricIcon({ type }) {
  const paths = {
    users: <><circle cx="9" cy="7" r="3" /><path d="M3 19a6 6 0 0 1 12 0M16 4.5a3 3 0 0 1 0 5.8M18 13a5 5 0 0 1 3 6" /></>,
    building: <><path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M2 21h20M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    document: <><path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></>,
  };
  return <svg className="metric-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[type]}</svg>;
}

export default function Dashboard() {
  const auth = useAuth();
  const [notice, setNotice] = useState('');

  const handleAction = (label) => {
    setNotice(`${label} is ready to connect when the backend is available.`);
    window.setTimeout(() => setNotice(''), 3500);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <div className="header-actions">
          <button className="icon-button notification-button" aria-label="View notifications" onClick={() => handleAction('Notifications')}>
            <span className="notification-dot" />
            <span aria-hidden="true">♢</span>
          </button>
          <div className="admin-user">
            <div className="avatar">A</div>
            <div>
              <strong>{auth?.user?.email?.split('@')[0] || 'Admin'}</strong>
              <span>Administrator</span>
            </div>
            <span className="chevron">⌄</span>
          </div>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <h2>Welcome back, Admin <span aria-hidden="true">👋</span></h2>
          <p>Here&apos;s what&apos;s happening across HIRENA today.</p>
        </div>
        <span className="date-pill">Saturday, September 12, 2026</span>
      </section>

      <section className="metric-grid" aria-label="Platform statistics">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className={`metric-icon-wrap ${metric.tone}`}><MetricIcon type={metric.icon} /></div>
            <div className="metric-copy">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small><b>↗ {metric.change}</b> <em>vs last month</em></small>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div><h3>Applications overview</h3><p>Application activity over the last 7 days</p></div>
            <button className="select-button" onClick={() => handleAction('Time range')}>This week <span>⌄</span></button>
          </div>
          <div className="chart-legend"><span><i className="legend-dot blue" />Applications</span><span><i className="legend-dot purple" />Accepted</span></div>
          <div className="chart" role="img" aria-label="Applications trend chart">
            <div className="chart-y-axis"><span>120</span><span>90</span><span>60</span><span>30</span><span>0</span></div>
            <div className="chart-area">
              <div className="grid-lines"><i /><i /><i /><i /><i /></div>
              <svg viewBox="0 0 640 210" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4c7cf5" stopOpacity=".18" /><stop offset="1" stopColor="#4c7cf5" stopOpacity="0" /></linearGradient></defs>
                <path className="chart-fill" d="M0 170 C40 155 65 132 105 145 S155 110 205 126 S260 92 305 112 S355 80 405 96 S460 53 510 76 S565 40 640 54 V210 H0Z" />
                <path className="chart-line primary" d="M0 170 C40 155 65 132 105 145 S155 110 205 126 S260 92 305 112 S355 80 405 96 S460 53 510 76 S565 40 640 54" />
                <path className="chart-line secondary" d="M0 190 C42 181 68 170 105 177 S160 151 205 165 S260 142 305 153 S360 123 405 139 S455 110 510 124 S570 98 640 110" />
              </svg>
              <div className="chart-x-axis"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
            </div>
          </div>
        </article>

        <article className="panel status-panel">
          <div className="panel-heading"><div><h3>Job status</h3><p>Current job listings by status</p></div><button className="more-button" aria-label="More job status options" onClick={() => handleAction('Job status options')}>•••</button></div>
          <div className="status-content">
            <div className="donut"><div><strong>340</strong><span>Total jobs</span></div></div>
            <div className="status-list"><div><span><i className="legend-dot green" />Active</span><strong>180 <small>52.9%</small></strong></div><div><span><i className="legend-dot orange" />Pending</span><strong>60 <small>17.6%</small></strong></div><div><span><i className="legend-dot gray" />Closed</span><strong>70 <small>20.6%</small></strong></div><div><span><i className="legend-dot purple" />Draft</span><strong>30 <small>8.8%</small></strong></div></div>
          </div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel table-panel">
          <div className="panel-heading"><div><h3>Recent jobs</h3><p>Latest jobs posted on the platform</p></div><button className="text-button" onClick={() => handleAction('View all jobs')}>View all <span>→</span></button></div>
          <div className="table-wrap"><table><thead><tr><th>JOB TITLE</th><th>COMPANY</th><th>LOCATION</th><th>STATUS</th><th>POSTED</th></tr></thead><tbody>{jobs.map((job) => <tr key={job.title}><td><strong>{job.title}</strong></td><td>{job.company}</td><td>{job.location}</td><td><span className={`status-badge ${job.tone}`}>{job.status}</span></td><td>{job.posted}</td></tr>)}</tbody></table></div>
        </article>
        <article className="panel table-panel">
          <div className="panel-heading"><div><h3>Recent applications</h3><p>Latest candidate applications</p></div><button className="text-button" onClick={() => handleAction('View all applications')}>View all <span>→</span></button></div>
          <div className="application-list">{applications.map((application) => <div className="application-row" key={application.name}><div className={`app-avatar ${application.color}`}>{application.initials}</div><div className="application-person"><strong>{application.name}</strong><span>{application.role} · {application.company}</span></div><span className={`status-badge ${application.tone}`}>{application.status}</span></div>)}</div>
        </article>
      </section>

      <section className="quick-actions">
        <div><h3>Quick actions</h3><p>Common tasks to help you manage HIRENA</p></div>
        <div className="action-buttons"><button onClick={() => handleAction('Add user')}><span>＋</span>Add user</button><button onClick={() => handleAction('Add company')}><span>＋</span>Add company</button><button onClick={() => handleAction('Create job')}><span>＋</span>Create job</button></div>
      </section>
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}
