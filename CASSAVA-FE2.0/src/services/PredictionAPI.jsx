import axios from "axios";

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_PREDICT_ENDPOINT, // Ensure this environment variable is correctly set in your .env file
});

const predictionAPIService = {
  async login() {
    const username = sessionStorage.getItem("username");
    if (!username) {
      console.error("No username found in sessionStorage");
      throw new Error("Missing credentials");
    }

    try {
      const response = await apiClient.post("/login", { username });
      const { data, status } = response;

      if (status === 200 && data.accessToken) {
        console.log("Login successful");
        sessionStorage.setItem("predictAccessToken", data.accessToken);
        sessionStorage.setItem("predictRefreshToken", data.refreshToken);
        return data.accessToken; // Consider returning full `data` object if the refreshToken or other data might be needed later
      } else {
        throw new Error("Failed to get token");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error; // Consider more nuanced error handling or different error messages based on the error type or HTTP status code
    }
  },

  async sandPrediction({inslot, batch, month, plant, vendor, region, fines, bulk}) {
    const token = sessionStorage.getItem("predictAccessToken");
    if (!token) {
      throw new Error("No Prediction token obtained");
    }

    const payload = {
      inslot, batch, month, plant, vendor, region, fines, bulk
    };

    try {
      const response = await apiClient.post("/sand-predict", payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          
        }
      });
      return response.data;  // Directly return the data received from the API
    } catch (error) {
      console.error("Error in sandPrediction:", error.response ? error.response.data : error);
      throw error; // Rethrow the error to be handled or displayed by the calling function
    }
  },
};

export default predictionAPIService;
