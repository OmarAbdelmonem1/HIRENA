import api from '../../../api/axios';

type QueryParams = Record<string, string | number | boolean | undefined>;

export async function getAllApplications(params: QueryParams = {}) {
  return (await api.get('/api/admin/applications', { params })).data;
}

export async function getApplicationById(id: string | number) {
  return (await api.get(`/api/admin/applications/${id}`)).data;
}
