import api from "../../../api/axios";

/**
 * Fetches a page of lightweight job seeker projections for the admin Users table.
 * Backend: GET /api/admin/users?page=&size=&sort=
 * Returns a Spring Page object: { content, totalElements, totalPages, number, size, ... }
 */
export const getAdminUsers = async ({
  page = 0,
  size = 100,
  sort = "createdAt,desc",
} = {}) => {
  const response = await api.get("/api/admin/users", {
    params: { page, size, sort },
  });

  return response.data;
};

/**
 * Fetches the full job seeker profile for the admin user-details view.
 * Backend: GET /api/admin/users/{id}
 */
export const getAdminUserById = async (id) => {
  const response = await api.get(`/api/admin/users/${id}`);

  return response.data;
};
