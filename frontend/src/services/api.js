import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// 1. Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  updatePassword: (passwords) => api.put('/auth/update-password', passwords)
};

// 2. User & Profile API
export const userAPI = {
  updateStudentProfile: (data) => api.put('/users/student-profile', data),
  updateCompanyProfile: (data) => api.put('/users/company-profile', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  uploadResume: (formData) =>
    api.post('/users/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

// 3. Events API
export const eventAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getFeaturedEvents: () => api.get('/events/featured'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (formData) =>
    api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateEvent: (id, formData) =>
    api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  deleteEvent: (id) => api.delete(`/events/${id}`)
};

// 4. Registrations API
export const registrationAPI = {
  registerForEvent: (eventId, data) => api.post(`/registrations/${eventId}`, data),
  cancelRegistration: (id, reason) => api.put(`/registrations/${id}/cancel`, { reason }),
  getMyRegistrations: () => api.get('/registrations/my'),
  getEventParticipants: (eventId, params) => api.get(`/registrations/event/${eventId}`, { params }),
  verifyQRCode: (registrationId) => api.post('/registrations/verify-qr', { registrationId }),
  getExportUrl: (eventId) => `${API_BASE_URL}/registrations/event/${eventId}/export`
};

// 5. Jobs API
export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyCompanyJobs: () => api.get('/jobs/company/mine')
};

// 6. Applications API
export const applicationAPI = {
  applyForJob: (jobId, formData) =>
    api.post(`/applications/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getMyApplications: () => api.get('/applications/my'),
  getJobApplicants: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data)
};

// 7. Chatbot API
export const chatbotAPI = {
  ask: (question) => api.post('/chatbot/ask', { question }),
  getFAQs: () => api.get('/chatbot/faqs'),
  createFAQ: (data) => api.post('/chatbot/faqs', data),
  updateFAQ: (id, data) => api.put(`/chatbot/faqs/${id}`, data),
  deleteFAQ: (id) => api.delete(`/chatbot/faqs/${id}`)
};

// 8. Notifications API
export const notificationAPI = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

// 9. Announcements API
export const announcementAPI = {
  getAnnouncements: (params) => api.get('/announcements', { params }),
  createAnnouncement: (formData) =>
    api.post('/announcements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateAnnouncement: (id, formData) =>
    api.put(`/announcements/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`)
};

// 10. Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getAllStudents: (params) => api.get('/admin/students', { params }),
  getAllCompanies: () => api.get('/admin/companies'),
  toggleCompanyApproval: (id) => api.put(`/admin/companies/${id}/approval`)
};

export default api;
