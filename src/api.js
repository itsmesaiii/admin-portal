// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // your backend base URL
});

export default api;
