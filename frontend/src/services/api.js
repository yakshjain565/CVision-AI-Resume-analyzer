import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const uploadResume = (formData) => API.post('/resumes/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getMyResume = () => API.get('/resumes/my-resume');
export const getJobs = () => API.get('/jobs');
export const getJobMatches = () => API.get('/jobs/matches/my');

export default API;