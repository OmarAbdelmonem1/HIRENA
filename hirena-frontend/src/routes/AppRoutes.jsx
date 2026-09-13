import { Routes, Route } from 'react-router-dom';

import Login from '../features/auth/Login';
import Welcome from '../features/auth/Welcome';
import RequireAuth from './RequireAuth';

import AdminRoutes from './admin/AdminRoutes';
import CompanyRoutes from './company/CompanyRoutes';
import RequireRole from './RequireRole';
import MainLayout from '../components/layout/MainLayout';
import Home from '../features/jobseeker/pages/Home';
import Jobs from '../features/jobseeker/pages/Jobs';
import JobDetails from '../features/jobseeker/pages/JobDetails';
import Apply from '../features/jobseeker/pages/Apply';
import Applications from '../features/jobseeker/pages/Applications';
import ApplicationDetails from '../features/jobseeker/pages/ApplicationDetails';
import SavedJobs from '../features/jobseeker/pages/SavedJobs';
import Notifications from '../features/jobseeker/pages/Notifications';
import Profile from '../features/jobseeker/pages/Profile';
import Companies from '../features/jobseeker/pages/Companies';
import CompanyDetails from '../features/jobseeker/pages/CompanyDetails';
import Register from '../features/auth/Register';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<RequireRole role="JOB_SEEKER"><MainLayout /></RequireRole>}>
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<Apply />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route
        path="/welcome"
        element={
          <RequireAuth>
            <Welcome />
          </RequireAuth>
        }
      />

      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/company/*" element={<CompanyRoutes />} />
    </Routes>
  );
}