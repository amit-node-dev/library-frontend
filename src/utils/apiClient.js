import axios from "axios";
import { Navigate } from "react-router-dom";

// Helper function to get token
export const getToken = () => localStorage.getItem("accessToken");

// Helper function to clear auth data
const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userData");
};

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for token expiration error
    if (
      error.response &&
      error.response.data &&
      error.response.data.statusType === false &&
      error.response.data.data?.name === "TokenExpiredError"
    ) {
      console.warn("Session expired:", error.response.data.message);
      
      // Clear stored authentication data
      clearAuthData();
      
      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      
      return Promise.reject(new Error("Session expired. Please login again."));
    }
    
    // Handle other types of errors
    return Promise.reject(error);
  }
);

export default apiClient;