import axios from 'axios';
import { MilkRecord, MilkResponse, SummaryStats } from '../types/milk';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const milkApi = {
  // Get all milk records
  getAllRecords: async (page = 1, limit = 10, farmerName?: string, collectionPoint?: string, distributionStatus?: string): Promise<MilkResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (farmerName) params.append('farmerName', farmerName);
    if (collectionPoint) params.append('collectionPoint', collectionPoint);
    if (distributionStatus) params.append('distributionStatus', distributionStatus);
    
    const response = await api.get(`/milk?${params}`);
    return response.data;
  },

  // Get records by farmer
  getRecordsByFarmer: async (farmerId: string): Promise<MilkRecord[]> => {
    const response = await api.get(`/milk/farmer/${farmerId}`);
    return response.data;
  },

  // Get records by collection point
  getRecordsByCollectionPoint: async (point: string): Promise<MilkRecord[]> => {
    const response = await api.get(`/milk/collection-point/${point}`);
    return response.data;
  },

  // Get single record by ID
  getRecordById: async (id: string): Promise<MilkRecord> => {
    const response = await api.get(`/milk/${id}`);
    return response.data;
  },

  // Create new milk record
  createRecord: async (record: Omit<MilkRecord, '_id' | 'totalAmount' | 'createdAt' | 'updatedAt'>): Promise<MilkRecord> => {
    const response = await api.post('/milk', record);
    return response.data;
  },

  // Update milk record
  updateRecord: async (id: string, record: Partial<MilkRecord>): Promise<MilkRecord> => {
    const response = await api.put(`/milk/${id}`, record);
    return response.data;
  },

  // Delete milk record
  deleteRecord: async (id: string): Promise<void> => {
    await api.delete(`/milk/${id}`);
  },

  // Get summary statistics
  getSummaryStats: async (): Promise<SummaryStats> => {
    const response = await api.get('/milk/stats/summary');
    return response.data;
  },
};

export default api;
