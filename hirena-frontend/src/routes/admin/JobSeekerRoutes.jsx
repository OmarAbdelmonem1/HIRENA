import { Routes, Route } from 'react-router-dom';

import Users from '../../features/admin/pages/JobSeeker/Users';
import UserDetails from '../../features/admin/pages/JobSeeker/UserDetails';


export default function JobSeekerRoutes() {
  return (
    <Routes>
      <Route index element={<Users />} />
      <Route path=":id" element={<UserDetails />} />

    </Routes>
  );
}