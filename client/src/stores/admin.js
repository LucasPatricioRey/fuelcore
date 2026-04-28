import { defineStore } from 'pinia'
import { createProduct, deactivateProduct, updateProduct } from '../services/productService'
import {
  getAdminOrders,
  getAdminProducts,
  getAdminSummary,
  updateAdminOrderStatus,
} from '../services/adminService'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    summary: null,
    orders: [],
    products: [],
    isLoadingSummary: false,
    isLoadingOrders: false,
    isLoadingProducts: false,
    isSavingProduct: false,
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
    async fetchProducts(token) {
      this.isLoadingProducts = true
      this.error = ''

      try {
        const data = await getAdminProducts(token)
        this.products = data.products ?? []
      } catch (error) {
        this.error = error.message ?? 'No se pudieron cargar los productos del panel.'
      } finally {
        this.isLoadingProducts = false
      }
    },
    async changeOrderStatus({ token, orderId, status }) {
      await updateAdminOrderStatus({ token, orderId, status })
      await this.fetchOrders(token)
      await this.fetchSummary(token)
    },
    async saveProduct({ token, productId, product }) {
      this.isSavingProduct = true
      this.error = ''

      try {
        if (productId) {
          await updateProduct({ token, productId, product })
        } else {
          await createProduct({ token, product })
        }

        await Promise.all([this.fetchProducts(token), this.fetchSummary(token)])
      } catch (error) {
        this.error = error.message ?? 'No se pudo guardar el producto.'
        throw error
      } finally {
        this.isSavingProduct = false
      }
    },
    async disableProduct({ token, productId }) {
      this.error = ''

      try {
        await deactivateProduct({ token, productId })
        await Promise.all([this.fetchProducts(token), this.fetchSummary(token)])
      } catch (error) {
        this.error = error.message ?? 'No se pudo desactivar el producto.'
        throw error
      }
    },
  },
})
