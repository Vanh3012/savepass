import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot Backend URL
  withCredentials: true, // Send Cookies for HttpSession
});

export default api;
