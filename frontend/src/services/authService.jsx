import API_ENDPOINTS from "../config/api";

// Helper function for error handling
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response data:", errorData);
    throw new Error(errorData.message || "Something went wrong!");
  }
  return await response.json();
};

// Register user
export const register = async (email, password) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    if (!data.token || !data.user) {
      throw new Error("Registration failed: Missing token or user data");
    }

    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    if (!data.token || !data.user) {
      throw new Error("Login failed: Missing token or user data");
    }

    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// //authService.jsx

// const API_URL = "http://localhost:5000/api/auth";

// // Helper function for error handling
// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Something went wrong!");
//   }
//   return await response.json();
// };

// // Register user
// export const register = async (email, password) => {
//   const response = await fetch(`${API_URL}/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   return handleResponse(response);
// };

// // Login user
// export const login = async (email, password) => {
//   const response = await fetch(`${API_URL}/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   return handleResponse(response);
// };
