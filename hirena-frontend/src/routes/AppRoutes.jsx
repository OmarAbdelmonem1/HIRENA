import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/Login";
import Welcome from "../features/auth/Welcome";
import RequireAuth from "./RequireAuth";

import AdminRoutes from "./admin/AdminRoutes";
import CompanyRoutes from "./company/CompanyRoutes";
import RequireRole from "./RequireRole";
import MainLayout from "../components/layout/MainLayout";
import Home from "../features/jobseeker/pages/Home";
import Register from "../features/auth/Register";
import { jobSeekerRoutes } from "./jobseeker/JobSeekerRoutes";
import {
  About,
  Contact,
  Privacy,
  Terms,
} from "../features/public/pages/PublicInfoPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>
      <Route
        element={
          <RequireRole role="JOB_SEEKER">
            <MainLayout />
          </RequireRole>
        }
      >
        {jobSeekerRoutes}
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
