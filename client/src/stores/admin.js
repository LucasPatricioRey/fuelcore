import { defineStore } from 'pinia'
import {
  getAdminOrders,
  getAdminSummary,
  updateAdminOrderStatus,
} from '../services/adminService'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    summary: null,
    orders: [],
    isLoadingSummary: false,
    isLoadingOrders: false,
    error: '',
  }),
  actions: {
    async fetchSummary(token) {
      this.isLoadingSummary = true
      this.error = ''

      try {
        const data = await getAdminSummary(token)
        this.summary = data.summary
      } catch (error) {
        this.error = error.message ?? 'No se pudo cargar el resumen admin.'
      } finally {
        this.isLoadingSummary = false
      }
    },
    async fetchOrders(token) {
      this.isLoadingOrders = true
      this.error = ''

      try {
        const data = await getAdminOrders(token)
        this.orders = data.orders ?? []
      } catch (error) {
        this.error = error.message ?? 'No se pudieron cargar las ordenes admin.'
      } finally {
        this.isLoadingOrders = false
      }
    },
    async changeOrderStatus({ token, orderId, status }) {
      await updateAdminOrderStatus({ token, orderId, status })
      await this.fetchOrders(token)
      await this.fetchSummary(token)
    },
  },
})
