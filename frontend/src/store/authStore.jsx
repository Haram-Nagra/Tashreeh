import { create } from "zustand";
import { login, register } from "../services/authService";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  user: null,

  login: async (email, password) => {
    try {
      const data = await login(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        set({
          token: data.token,
          user: {
            ...data.user,
            id: data.user._id, // Transform _id to id
          },
        });
      } else {
        throw new Error("Login failed, no token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed!");
    }
  },

  register: async (email, password) => {
    try {
      const data = await register(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        set({
          token: data.token,
          user: {
            ...data.user,
            id: data.user._id, // Transform _id to id
          },
        });
      } else {
        throw new Error("Registration failed, no token received");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed!");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  setUser: (user) => {
    set({ user });
  },
}));

export default useAuthStore;
