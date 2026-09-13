import { Routes, Route } from "react-router-dom";

import RequireRole from "../RequireRole";
import AdminLayout from "../../components/layout/AdminLayout";

import Dashboard from "../../features/admin/pages/Dashboard/Dashboard";

import JobSeekerRoutes from "./JobSeekerRoutes";
import CompanyRoutes from "./CompanyRoutes";
import JobRoutes from "./JobRoutes";
import Applications from "./ApplicationRoutes";
import AdminNotifications from "../../features/admin/pages/Notifications";

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
        <Route path="jobs/*" element={<JobRoutes />} />
        <Route path="applications/*" element={<Applications />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
    </Routes>
  );
}
