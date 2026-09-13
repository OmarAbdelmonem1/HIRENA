import api from "../../../api/axios";
export const getJobs = (params = {}) =>
  api.get("/api/jobs", { params }).then((r) => r.data);
export const getCompanies = (params = {}) =>
  api.get("/api/public/companies", { params }).then((r) => r.data);
export const getCompany = (id, params = {}) =>
  api.get(`/api/public/companies/${id}`, { params }).then((r) => r.data);
export const getJob = (id) => api.get(`/api/jobs/${id}`).then((r) => r.data);
export const applyToJob = (id, coverLetter) =>
  api.post(`/api/jobs/${id}/apply`, { coverLetter }).then((r) => r.data);
export const getApplications = () =>
  api.get("/api/jobseeker/applications").then((r) => r.data);
export const getApplication = (id) =>
  api.get(`/api/jobseeker/applications/${id}`).then((r) => r.data);
export const getNotifications = () =>
  api.get("/api/jobseeker/notifications").then((r) => r.data);
export const getUnreadNotificationCount = () =>
  api.get("/api/jobseeker/notifications/unread-count").then((r) => r.data);
export const markNotificationRead = (id) =>
  api.patch(`/api/jobseeker/notifications/${id}/read`);
export const deleteNotification = (id) =>
  api.delete(`/api/jobseeker/notifications/${id}`);
export const deleteAllNotifications = () =>
  api.delete("/api/jobseeker/notifications");
export const getProfile = () =>
  api.get("/api/jobseeker/profile").then((r) => r.data);
export const getMyCvFile = () =>
  api.get("/api/jobseeker/cv/file", { responseType: "blob" });
export const createProfile = (data) =>
  api.post("/api/jobseeker/profile", data).then((r) => r.data);
export const updateProfile = (data) =>
  api.put("/api/jobseeker/profile", data).then((r) => r.data);
export const uploadCv = (file, replace = false) => {
  const formData = new FormData();
  formData.append("file", file);
  return api({
    method: replace ? "put" : "post",
    url: "/api/jobseeker/cv",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};
export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post("/api/jobseeker/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
