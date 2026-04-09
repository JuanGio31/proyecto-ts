import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  authService,
  type LoginCredentials,
  type RegisterCredentials,
} from "../services/auth.services";
import api from "../services/api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("access_token"));
  const user = ref<any>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginCredentials) {
    try {
      const response = await authService.login(credentials);
      token.value = response.access_token;
      await fetchCurrentUser();
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  async function signup(credentials: RegisterCredentials) {
    try {
      const response = await authService.register(credentials);
      token.value = response.access_token;
      await fetchCurrentUser();
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  }

  async function fetchCurrentUser() {
    try {
      // Asumiendo que tienes un endpoint /users/me
      const response = await api.get("/usuarios");
      user.value = response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  function logout() {
    authService.logout();
    token.value = null;
    user.value = null;
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    fetchCurrentUser,
  };
});
