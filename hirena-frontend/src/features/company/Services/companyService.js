import api from '../../../api/axios';

export const getCompanyJobs = () => api.get('/api/company/jobs').then((r) => r.data);
export const getCompanyJob = (id) => api.get(`/api/company/jobs/${id}`).then((r) => r.data);
export const createCompanyJob = (data) => api.post('/api/company/jobs', data).then((r) => r.data);
export const updateCompanyJob = (id, data) => api.put(`/api/company/jobs/${id}`, data).then((r) => r.data);
export const deleteCompanyJob = (id) => api.delete(`/api/company/jobs/${id}`);
export const getCompanyApplications = () => api.get('/api/company/applications').then((r) => r.data);
export const getCompanyApplication = (id) => api.get(`/api/company/applications/${id}`).then((r) => r.data);
export const updateCompanyApplicationStatus = (id, status) => api.put(`/api/company/applications/${id}/status`, { status }).then((r) => r.data);
