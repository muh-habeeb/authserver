import axios from "axios";
import create from "zustand";

const API_URL = "http://localhost:5000/api/auth"
export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    singup: async (email, password) => {
        set({ loading: true, error: null })
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password })
            set({ user: res.data.user, loading: false, isAuthenticated: true })
        } catch (error) {
            set({ loading: false, error: error.response.data.message || "Error  in signin up" })
            throw error; //catch the error in the component handle login 
        }
    }
}));