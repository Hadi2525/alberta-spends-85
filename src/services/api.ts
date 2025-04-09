
import axios from 'axios';

const API_BASE_URL = 'https://albertaspends.com';

const api = axios.create({
  baseURL: API_BASE_URL
});

export const fetchElements = async (filters = {}) => {
  const response = await api.get('/api/grants/elements');
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
  return response.data.trends;
};

export const fetchDataQuality = async () => {
  const response = await api.get('/api/grants/data-quality');
  return response.data;
};

export const fetchMultipleGrantRecipients = async (filters = {}) => {
  // This would be a real API call in production
  // For now, we're returning mock data that shows organizations receiving grants from multiple programs
  const mockData = [
    { recipient: "University of Alberta", count: 8, totalAmount: 18500000 },
    { recipient: "University of Calgary", count: 6, totalAmount: 8500000 },
    { recipient: "City of Calgary", count: 5, totalAmount: 12400000 },
    { recipient: "Alberta Innovates", count: 4, totalAmount: 5900000 },
    { recipient: "Athabasca University", count: 4, totalAmount: 3200000 },
    { recipient: "City of Edmonton", count: 4, totalAmount: 4800000 },
    { recipient: "NAIT", count: 3, totalAmount: 2700000 },
    { recipient: "Alberta Health Services", count: 3, totalAmount: 25000000 },
    { recipient: "ATCO Group", count: 3, totalAmount: 9200000 },
    { recipient: "SAIT", count: 3, totalAmount: 2200000 }
  ];
  
  return mockData;
};

export default api;
