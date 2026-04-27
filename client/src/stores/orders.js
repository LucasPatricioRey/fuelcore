import { defineStore } from 'pinia'
import { getMyOrders } from '../services/orderService'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    items: [],
    isLoading: false,
    error: '',
  }),
  actions: {
    async fetchMyOrders(token) {
      this.isLoading = true
      this.error = ''

      try {
        const data = await getMyOrders(token)
        this.items = data.orders ?? []
      } catch (error) {
        this.error = error.message ?? 'No se pudieron cargar las ordenes.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
