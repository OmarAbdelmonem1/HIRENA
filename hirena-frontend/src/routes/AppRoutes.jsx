import { Routes, Route } from 'react-router-dom';

import Login from '../features/auth/Login';
import Welcome from '../features/auth/Welcome';
import Profile from '../features/jobSeeker/Profile';
import RequireAuth from './RequireAuth';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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
    </Routes>
  );
}