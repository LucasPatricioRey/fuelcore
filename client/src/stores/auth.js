import { defineStore } from 'pinia'
import {
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  loginUser,
  registerUser,
  saveStoredToken,
} from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getStoredToken(),
    user: null,
    isLoading: false,
    isBootstrapping: false,
    error: '',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    isAdmin: (state) => state.user?.role === 'admin',
    userFullName: (state) =>
      state.user ? `${state.user.firstName} ${state.user.lastName}`.trim() : '',
  },
  actions: {
    async bootstrapSession() {
      if (!this.token || this.user || this.isBootstrapping) {
        return
      }

      this.isBootstrapping = true

      try {
        const { user } = await getCurrentUser(this.token)
        this.user = user
      } catch {
        this.logout()
      } finally {
        this.isBootstrapping = false
      }
    },
    async register(payload) {
      this.isLoading = true
      this.error = ''

      try {
        const data = await registerUser(payload)
        this.token = data.token
        this.user = data.user
        saveStoredToken(data.token)
        return data
      } catch (error) {
        this.error = error.message ?? 'No se pudo completar el registro.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async login(payload) {
      this.isLoading = true
      this.error = ''

      try {
        const data = await loginUser(payload)
        this.token = data.token
        this.user = data.user
        saveStoredToken(data.token)
        return data
      } catch (error) {
        this.error = error.message ?? 'No se pudo iniciar sesion.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.error = ''
      clearStoredToken()
    },
  },
})
