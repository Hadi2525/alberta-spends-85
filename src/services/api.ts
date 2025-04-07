
import axios from 'axios';

const API_BASE_URL = 'https://albertaspends-com.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL
});

export const fetchElements = async (filters = {}) => {
  const response = await api.post('/api/grants/elements', filters);
  return response.data;
};

export const fetchProgramsByMinistry = async (filters = {}) => {
  const response = await api.post('/api/grants/programs', filters);
  return response.data;
};

export const fetchTopRecipients = async (filters = {}) => {
  const response = await api.post('/api/grants/top', filters);
  return response.data;
};

export const fetchGrants = async (filters = {}) => {
  const response = await api.post('/api/grants', filters);
  return response.data;
};

export const fetchTrends = async (filters = {}) => {
  const response = await api.post('/api/grants/trends', filters);
  return response.data;
};

export const fetchDataQuality = async () => {
  const response = await api.get('/api/grants/data-quality');
  return response.data;
};

export default api;
