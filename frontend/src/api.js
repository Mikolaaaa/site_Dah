  import axios from 'axios';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const api = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Интерцептор: добавляем токен к каждому запросу
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Интерцептор: если 401 - редирект на логин
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  // Auth API
  export const authAPI = {
    login: (username, password) =>
      api.post('/api/auth/login', { username, password }),

    getMe: () => api.get('/api/auth/me'),

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    isAuthenticated: () => !!localStorage.getItem('token'),
  };

  // Photos API
  export const photoAPI = {
    getAll: (category, roomId) =>
      api.get('/api/photos', { params: { category, room_id: roomId } }),

    upload: (file, category, roomId) => {
      const formData = new FormData();
      formData.append('file', file);
      const params = new URLSearchParams({ category });
      if (roomId) params.append('room_id', roomId);
      return api.post(`/api/photos?${params}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },

    delete: (id) => api.delete(`/api/photos/${id}`),
  };

  // Rooms API
  export const roomAPI = {
    getAll: () => api.get('/api/rooms'),
    getOne: (id) => api.get(`/api/rooms/${id}`),
    create: (data) => api.post('/api/rooms', data),
    update: (id, data) => api.patch(`/api/rooms/${id}`, data),
    delete: (id) => api.delete(`/api/rooms/${id}`),
  };

  // Bookings API
  export const bookingAPI = {
    getAll: (roomId) => api.get('/api/bookings'),
    getBookedDates: () => api.get('/api/bookings/booked-dates'),
    create: (data) => api.post('/api/bookings', data),
    delete: (id) => api.delete(`/api/bookings/${id}`),
    updateStatus: (id, status) => api.patch(`/api/bookings/${id}/status`, null, {
      params: { status }
    }),
  };

  export default api;
