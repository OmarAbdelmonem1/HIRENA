import api from "../../../api/axios";

/**
 * Fetches a page of companies for the admin Companies table.
 * Backend: GET /api/admin/companies?page=&size=&sort=
 * Returns a Spring Page object: { content, totalElements, totalPages, number, size, ... }
 */
export const getAdminCompanies = async ({ page = 0, size = 1000, sort = "createdAt,desc" } = {}) => {
  const response = await api.get("/api/admin/companies", {
    params: { page, size, sort },
  });
  return response.data;
};

/**
 * Fetches a single company by ID for admin view/edit.
 * Backend: GET /api/admin/companies/{id}
 */
export const getCompanyById = async (id) => {
  const response = await api.get(`/api/company/${id}`);
  return response.data;
};

/**
 * Creates a new company as admin.
 * Backend: POST /api/admin/companies
 */
export const createAdminCompany = async (companyData) => {
  const response = await api.post("/api/admin/companies", companyData);
  return response.data;
};

/**
 * Updates an existing company as admin.
 * Backend: PUT /api/admin/companies/{id}
 */
export const updateAdminCompany = async (id, companyData) => {
  const response = await api.put(`/api/admin/companies/${id}`, companyData);
  return response.data;
};

/**
 * Deletes a company by ID as admin.
 * Backend: DELETE /api/admin/companies/{id}
 */
export const deleteAdminCompany = async (id) => {
  const response = await api.delete(`/api/admin/companies/${id}`);
  return response.data;
};
