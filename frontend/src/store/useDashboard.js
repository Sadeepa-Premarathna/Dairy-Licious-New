import { create } from 'zustand';
import api from '../api/axios.js';

const useDashboard = create((set, get) => ({
  // State
  kpis: null,
  series: null,
  loading: false,
  error: null,

  // Actions
  fetchKPIs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/dashboard/kpis');
      set({ kpis: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSeries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/dashboard/series');
      set({ series: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [kpisRes, seriesRes] = await Promise.all([
        api.get('/dashboard/kpis'),
        api.get('/dashboard/series')
      ]);
      set({ 
        kpis: kpisRes.data, 
        series: seriesRes.data, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useDashboard;
