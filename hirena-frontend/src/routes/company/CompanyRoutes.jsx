import { Routes, Route, Navigate } from 'react-router-dom';
import RequireRole from '../RequireRole';
import CompanyLayout from '../../components/layout/CompanyLayout';
import CompanyDashboard from '../../features/company/pages/Dashboard/CompanyDashboard';
import CompanyJobs from '../../features/company/pages/Jobs/CompanyJobs';
import CompanyJobForm from '../../features/company/pages/Jobs/CompanyJobForm';
import CompanyJobDetails from '../../features/company/pages/Jobs/CompanyJobDetails';
import CompanyApplications from '../../features/company/pages/Applications/CompanyApplications';
import CompanyApplicationDetails from '../../features/company/pages/Applications/CompanyApplicationDetails';

export default function CompanyRoutes() {
  return (
    <Routes>
      <Route element={<RequireRole role="COMPANY"><CompanyLayout /></RequireRole>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="jobs" element={<CompanyJobs />} />
        <Route path="jobs/create" element={<CompanyJobForm />} />
        <Route path="jobs/:id" element={<CompanyJobDetails />} />
        <Route path="jobs/:id/edit" element={<CompanyJobForm />} />
        <Route path="applications" element={<CompanyApplications />} />
        <Route path="applications/:id" element={<CompanyApplicationDetails />} />
      </Route>
    </Routes>
  );
}
