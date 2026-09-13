import api from '../../../api/axios';

export const getCompanyJobs = () => api.get('/api/company/jobs').then((r) => r.data);
export const getCompanyJob = (id) => api.get(`/api/company/jobs/${id}`).then((r) => r.data);
export const createCompanyJob = (data) => api.post('/api/company/jobs', data).then((r) => r.data);
export const updateCompanyJob = (id, data) => api.put(`/api/company/jobs/${id}`, data).then((r) => r.data);
export const deleteCompanyJob = (id) => api.delete(`/api/company/jobs/${id}`);
export const getCompanyApplications = () => api.get('/api/company/applications').then((r) => r.data);
export const getApplicationsForJob = (jobId) => api.get(`/api/company/jobs/${jobId}/applications`).then((r) => r.data);
export const getCompanyApplication = (id) => api.get(`/api/company/applications/${id}`).then((r) => r.data);
export const updateCompanyApplicationStatus = (id, status) => api.put(`/api/company/applications/${id}/status`, { status }).then((r) => r.data);
export const getCompanyApplicationCv = (id) => api.get(`/api/company/applications/${id}/cv`, { responseType: 'blob' }).then((r) => r);
export const getCompanyProfile = () => api.get('/api/company').then((r) => r.data);
export const createCompanyProfile = (data) => api.post('/api/company', data).then((r) => r.data);
export const updateCompanyProfile = (data) => api.put('/api/company', data).then((r) => r.data);
export const uploadCompanyLogo = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/company/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};
