import { Routes, Route } from 'react-router-dom';
import RequireRole from './RequireRole';
import Login from '../features/auth/Login';
import Welcome from '../features/auth/Welcome';
import Profile from '../features/jobSeeker/Profile';
import RequireAuth from './RequireAuth';
import AdminLayout from '../components/layout/AdminLayout';
import Dashboard from '../features/admin/pages/Dashboard/Dashboard';
import Users from '../features/admin/pages/JobSeeker/Users';
import UserDetails from '../features/admin/pages/JobSeeker/UserDetails';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/welcome"
        element={
          <RequireAuth>
            <Welcome />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireRole role="ADMIN">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />
      </Route>
    </Routes>
  );
}