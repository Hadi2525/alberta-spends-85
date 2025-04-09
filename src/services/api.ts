
import axios from 'axios';

const BASE_URL = 'https://albertaspends.com/api/grants';

export interface ElementsResponse {
  ministries: string[];
  displayFiscalYears: string[];
}

export interface TrendsData {
  fiscalYear: string;
  totalAmount: number;
  recipientCount: number;
  averageGrantAmount: number;
}

export const fetchElements = async (): Promise<ElementsResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/elements`);
    return response.data;
  } catch (error) {
    console.error('Error fetching elements:', error);
    throw error;
  }
};

export const fetchTrends = async (): Promise<TrendsData[]> => {
  try {
    const response = await axios.post(`${BASE_URL}/trends`, {});
    return response.data;
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
};
