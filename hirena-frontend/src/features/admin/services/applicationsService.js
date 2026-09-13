import api from "../../../api/axios";

export async function getAllApplications(params = {}) {
  return (await api.get("/api/admin/applications", { params })).data;
}

export async function getApplicationById(id) {
  return (await api.get(`/api/admin/applications/${id}`)).data;
}

export async function getAdminApplicationCv(id) {
  return api.get(`/api/admin/applications/${id}/cv`, {
    responseType: "blob",
  });
}
