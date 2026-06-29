import axios from 'axios';
import { api as apiConfig } from '../constants/api';
import { useAuthStore } from '../store/auth.store';

export const api = axios.create({
  baseURL: apiConfig.BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
