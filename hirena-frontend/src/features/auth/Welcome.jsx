import React from 'react';
import { useAuth } from '../../providers/AuthProvider';

export default function Welcome() {
  const { user } = useAuth();
  const role = user?.role || '';
  const email = user?.email || '';

  return (
    <div>
      {role === 'JOB_SEEKER' ? (
        <h1>Hello job seeker</h1>
      ) : (
        <h1>Hello {role ? role.toLowerCase().replace('_',' ') : 'user'}</h1>
      )}
      {email && <p>{email}</p>}
    </div>
  );
}
