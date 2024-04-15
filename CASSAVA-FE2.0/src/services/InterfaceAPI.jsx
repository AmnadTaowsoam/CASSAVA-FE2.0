import axios from "axios";

// BASE URL for the Interface API
const INTERFACE_ENDPOINT = import.meta.env.VITE_REACT_APP_INTERFACE_ENDPOINT;
const apiClient = axios.create({
  baseURL: INTERFACE_ENDPOINT,
  headers: {
    "Content-Type": "application/json", // Ensure JSON content type for all requests
  },
});

const useInterfaceAPIService = () => {
  // Updated login function to use new endpoint and handle username/password
  const login = async (username) => {
    console.log("Login function entered with:", username);
    try {
      const response = await apiClient.post("/api/auth/login", { username });
      const receivedToken = response.data.token;  // Assuming the token is returned directly under data.token
      localStorage.setItem("token", receivedToken);
      console.log("Token received and stored:", receivedToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const validatePayload = (payload) => {
    if (!payload.inslot ||!payload.batch || !payload.material || !payload.plant || !payload.operation || !payload.miccode || typeof payload.result !== 'number') {
      console.error("Validation error: Missing or invalid fields", payload);
      return false;
    }
    return true;
  };

  // Updated function to send quality data to the specific endpoint
  const sendPayload = async (payload) => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      console.error("No token found, please login first.");
      throw new Error("Authentication required. Please login.");
    }
  
    if (!validatePayload(payload)) {
      throw new Error("Payload validation failed. Check the console for more details.");
    }
  
    try {
      const response = await apiClient.post(
        "/api/quality-data",
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("Payload sent successfully:", payload);
      return response.data;
    } catch (error) {
      console.error("Error sending payload:", error);
      throw error;
    }
  };

  return { login, sendPayload };
};

export default useInterfaceAPIService;
