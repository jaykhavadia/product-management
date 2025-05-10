import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));;
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const createProduct = (data) =>
  api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteProduct = (id) => api.delete(`/products/${id}`);
