import { defineStore } from 'pinia'
import { getProducts } from '../services/productService'

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    isLoading: false,
    error: '',
  }),
  getters: {
    featuredProducts: (state) => state.items.filter((product) => product.featured),
  },
  actions: {
    async fetchProducts() {
      this.isLoading = true
      this.error = ''

      try {
        this.items = await getProducts()
      } catch (error) {
        this.error = error.message ?? 'No se pudieron cargar los productos.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
