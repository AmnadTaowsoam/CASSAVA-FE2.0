import axios from "axios";

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_INTERFACE_ENDPOINT,
  
});

// Utility function to handle getting the stored token
const getToken = () => {
  const token = sessionStorage.getItem("interfaceAccessToken");
  if (!token) {
    console.error("Authentication token is missing. Please login again.");
    throw new Error("Authentication required.");
  }
  return token;
};

const predictionAPIService = {
  async login() {
    const username = sessionStorage.getItem("username");
    if (!username) {
      console.error("No username found in sessionStorage");
      throw new Error("Missing credentials");
    }

    try {
      const response = await apiClient.post("/api/auth/login", { username });
      if (response.status === 200 && response.data.accessToken) {
        sessionStorage.setItem("interfaceAccessToken", response.data.accessToken);
        sessionStorage.setItem("interfaceRefreshToken", response.data.refreshToken);
        return response.data.accessToken;
      } else {
        throw new Error("Failed to get token");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  async sandInterface({ inslot, batch, material, plant, operation, miccode, result }) {
    const token = sessionStorage.getItem("interfaceAccessToken");
    if (!token) {
      throw new Error("No Prediction token obtained");
    }

    const payload = {
      inslot, batch, material, plant, operation, miccode, result
    };

    try {
      const response = await apiClient.post("/api/quality-data", payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Check if the status code is either 200 (OK) or 201 (Created), both are successful
      if (response.status === 200 || response.status === 201) {
        return response.data;  // Successfully handle the data
      } else {
        throw new Error(`Failed to submit data: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error in sandInterface:", error.response ? error.response.data : error);
      throw new Error("Failed to interface data. Please check the input and try again.");
    }
  },
};

export default predictionAPIService;
