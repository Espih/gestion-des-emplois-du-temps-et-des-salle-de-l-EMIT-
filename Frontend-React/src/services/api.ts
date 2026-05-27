import axios from "axios";




const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  // baseURL: "http://localhost:5183/api",
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;

