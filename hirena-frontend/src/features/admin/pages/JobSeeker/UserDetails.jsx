import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminUserById } from '../../Services/JobSeekersService';

function initials(firstName, lastName) {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      setLoading(true);
      setError('');

      try {
        const data = await getAdminUserById(id);
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || err.message || 'Failed to load user'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <button className="text-button back-link" onClick={() => navigate('/admin/users')}>
            <span>←</span> Back to users
          </button>
          <h1>User details</h1>
        </div>
      </header>

      {loading && <p className="table-message">Loading user…</p>}
      {error && <p className="table-message error">{error}</p>}

      {!loading && !error && user && (
        <>
          <section className="panel profile-header">
            <div className="app-avatar blue profile-avatar">
              {initials(user.firstName, user.lastName)}
            </div>
            <div className="profile-heading">
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <p>{user.currentJobTitle || 'No title set'}</p>
              <span className={`status-badge ${user.enabled ? 'green' : 'red'}`}>
                {user.enabled ? 'Active' : 'Blocked'}
              </span>
            </div>
          </section>

          <section className="dashboard-grid">
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Contact information</h3>
                </div>
              </div>
              <dl className="detail-list">
                <div><dt>Email</dt><dd>{user.email || '—'}</dd></div>
                <div><dt>Phone</dt><dd>{user.phone || '—'}</dd></div>
                <div><dt>Address</dt><dd>{user.address || '—'}</dd></div>
                <div><dt>City</dt><dd>{user.city || '—'}</dd></div>
                <div><dt>Country</dt><dd>{user.country || '—'}</dd></div>
              </dl>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Career summary</h3>
                </div>
              </div>
              <dl className="detail-list">
                <div><dt>Current title</dt><dd>{user.currentJobTitle || '—'}</dd></div>
                <div><dt>Experience</dt><dd>{user.yearsOfExperience != null ? `${user.yearsOfExperience} yrs` : '—'}</dd></div>
                <div><dt>Expected salary</dt><dd>{user.expectedSalary != null ? user.expectedSalary.toLocaleString() : '—'}</dd></div>
                <div><dt>Availability</dt><dd>{user.availability || '—'}</dd></div>
                <div><dt>Joined</dt><dd>{formatDate(user.createdAt)}</dd></div>
              </dl>
            </article>
          </section>

          {user.bio && (
            <section className="panel">
              <div className="panel-heading"><div><h3>Bio</h3></div></div>
              <p className="bio-text">{user.bio}</p>
            </section>
          )}

          <section className="content-grid">
            <article className="panel">
              <div className="panel-heading"><div><h3>Work experience</h3></div></div>
              {user.workExperience?.length ? (
                <ul className="detail-timeline">
                  {user.workExperience.map((exp) => (
                    <li key={exp.id}>
                      <strong>{exp.jobTitle}</strong>
                      <span>{exp.companyName}</span>
                      <small>
                        {formatDate(exp.startDate)} – {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="table-message">No work experience added.</p>
              )}
            </article>

            <article className="panel">
              <div className="panel-heading"><div><h3>Education</h3></div></div>
              {user.education?.length ? (
                <ul className="detail-timeline">
                  {user.education.map((edu) => (
                    <li key={edu.id}>
                      <strong>{edu.degree}</strong>
                      <span>{edu.institutionName}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ''}</span>
                      <small>
                        {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="table-message">No education added.</p>
              )}
            </article>
          </section>

          <section className="content-grid">
            <article className="panel">
              <div className="panel-heading"><div><h3>Skills</h3></div></div>
              {user.skills?.length ? (
                <div className="skill-chips">
                  {user.skills.map((skill) => (
                    <span className="skill-chip" key={skill.id}>{skill.name}</span>
                  ))}
                </div>
              ) : (
                <p className="table-message">No skills added.</p>
              )}
            </article>

            <article className="panel">
              <div className="panel-heading"><div><h3>Certificates</h3></div></div>
              {user.certificates?.length ? (
                <ul className="detail-timeline">
                  {user.certificates.map((cert) => (
                    <li key={cert.id}>
                      <strong>{cert.name}</strong>
                      <span>{cert.issuingOrganization}</span>
                      <small>{formatDate(cert.issueDate)}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="table-message">No certificates added.</p>
              )}
            </article>
          </section>

          <section className="panel">
            <div className="panel-heading"><div><h3>CV</h3></div></div>
            {user.cv ? (
              <p className="table-message">{user.cv.fileName} · uploaded {formatDate(user.cv.uploadedAt)}</p>
            ) : (
              <p className="table-message">No CV uploaded.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
