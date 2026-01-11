import axios from 'axios';

export const SERVER_URL = 'http://localhost:5000';
export const API_URL = `${SERVER_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('im in api.js');

   // console.log('Token:', token);
  //  console.log('Config:', config);

  //  console.log("im ending api.js");
    
  

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
