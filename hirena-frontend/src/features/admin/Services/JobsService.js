import api from '../../../api/axios';
export const getAdminJobs = async (params) => (await api.get('/api/admin/jobs', { params })).data;
export const getAdminJob = async (id) => (await api.get(`/api/admin/jobs/${id}`)).data;
export const updateAdminJob = async (id, body) => (await api.put(`/api/admin/jobs/${id}`, body)).data;
export const deleteAdminJob = async (id) => api.delete(`/api/admin/jobs/${id}`);
export const approveAdminJob = async (id) => (await api.patch(`/api/admin/jobs/${id}/approve`)).data;
export const rejectAdminJob = async (id, rejectionReason) => (await api.patch(`/api/admin/jobs/${id}/reject`, { rejectionReason })).data;
