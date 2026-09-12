import { Routes, Route } from 'react-router-dom';

import RequireRole from '../RequireRole';
import AdminLayout from '../../components/layout/AdminLayout';

import Dashboard from '../../features/admin/pages/Dashboard/Dashboard';

import JobSeekerRoutes from './JobSeekerRoutes';
import CompanyRoutes from './CompanyRoutes';


export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RequireRole role="ADMIN">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="users/*" element={<JobSeekerRoutes />} />
        <Route path="companies/*" element={<CompanyRoutes />} />

      </Route>
    </Routes>
  );
}