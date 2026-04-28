import { defineStore } from 'pinia'
import { getProductBySlug, getProducts } from '../services/productService'

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    isLoading: false,
    error: '',
    lastFilters: {},
  }),
  getters: {
    featuredProducts: (state) => state.items.filter((product) => product.featured),
  },
  actions: {
    async fetchProducts(filters = {}) {
      this.isLoading = true
      this.error = ''
      this.lastFilters = filters

      try {
        this.items = await getProducts(filters)
      } catch (error) {
        this.error = error.message ?? 'No se pudieron cargar los productos.'
      } finally {
        this.isLoading = false
      }
    },
    async fetchProductBySlug(slug) {
      return getProductBySlug(slug)
    },
  },
})
