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
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginCredentials) {
    try {
      const response = await authService.login(credentials);
      token.value = response.access_token;
      localStorage.setItem("access_token", token.value);
      await fetchCurrentUser();
      if (!user.value) {
        throw new Error("No se pudo obtener datos del usuario");
      }
      return true;
    } catch (error: any) {
      console.error("Login fallido:", error);
      token.value = null;
      localStorage.removeItem("access_token");
      return false;
    }
  }

  async function signup(credentials: RegisterCredentials) {
    try {
      const response = await authService.register(credentials);
      token.value = response.access_token;
      localStorage.setItem("access_token", token.value);
      await fetchCurrentUser();
      return true;
    } catch (error) {
      console.error("Registro Fallido:", error);
      return false;
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return;
    loading.value = true;
    try {
      const response = await api.get("/auth/me");
      user.value = response.data;
      localStorage.setItem("user_data", JSON.stringify(user.value));
    } catch (error: any) {
      console.error("Falló la busqueda del usuario:", error);
      if (error.response?.status === 401) {
        token.value = null;
        localStorage.removeItem("access_token");
      }
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    authService.logout();
    token.value = null;
    user.value = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
  }

  function updateUser(nuevosDatos: any) {
    user.value = { ...user.value, ...nuevosDatos };
    localStorage.setItem("user_data", JSON.stringify(user.value));
  }

  async function initAuth() {
    if (token.value && !user.value) {
      await fetchCurrentUser();
    }
  }

  initAuth();

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    fetchCurrentUser,
    updateUser,
    initAuth,
  };
});
