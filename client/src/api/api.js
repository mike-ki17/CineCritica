import axios from "axios";

// Usa variable de entorno de Vite
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;
