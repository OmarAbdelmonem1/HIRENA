import api from "../../../api/axios";

/**
 * Fetch admin dashboard payload from backend
 * GET /api/admin/dashboard
 */
export const getAdminDashboard = async () => {
  const res = await api.get("/api/admin/dashboard");
  return res.data;
};
