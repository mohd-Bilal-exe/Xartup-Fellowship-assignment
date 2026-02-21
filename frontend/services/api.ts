import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const companyService = {
  getCompanies: (params: any) => api.get('/companies', { params }),
  getCompany: (id: string) => api.get(`/companies/${id}`),
  enrichCompany: (id: string) => api.post(`/companies/${id}/enrich`),
  addNote: (id: string, content: string) => api.post(`/companies/${id}/notes`, { content }),
};

export const listService = {
  getLists: () => api.get('/lists'),
  createList: (name: string) => api.post('/lists', { name }),
  deleteList: (id: string) => api.delete(`/lists/${id}`),
  addToList: (listId: string, companyId: string) => api.post('/lists/add', { listId, companyId }),
  removeFromList: (listId: string, companyId: string) => api.post('/lists/remove', { listId, companyId }),
};

export const savedSearchService = {
  getSavedSearches: () => api.get('/saved-searches'),
  saveSearch: (name: string, query: string, filters: any) => api.post('/saved-searches', { name, query, filters }),
  deleteSavedSearch: (id: string) => api.delete(`/saved-searches/${id}`),
};

export default api;
