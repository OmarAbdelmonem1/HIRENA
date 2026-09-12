import { Routes, Route } from 'react-router-dom';

import Login from '../features/auth/Login';
import Welcome from '../features/auth/Welcome';
import RequireAuth from './RequireAuth';

import AdminRoutes from './admin/AdminRoutes';

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

      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}