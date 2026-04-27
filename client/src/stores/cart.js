import { defineStore } from 'pinia'

const STORAGE_KEY = 'fuelcore_cart'

const readStoredCart = () => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY)
    return rawValue ? JSON.parse(rawValue) : []
  } catch {
    return []
  }
}

const persistCart = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const clearStoredCart = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: readStoredCart(),
  }),
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) =>
      state.items.reduce((total, item) => total + item.price * item.quantity, 0),
  },
  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find((item) => item.slug === product.slug)

      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock)
      } else {
        this.items.push({
          _id: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          stock: product.stock,
          image: product.image,
          quantity: Math.min(quantity, product.stock),
        })
      }

      persistCart(this.items)
    },
    removeItem(slug) {
      this.items = this.items.filter((item) => item.slug !== slug)
      persistCart(this.items)
    },
    updateQuantity(slug, quantity) {
      const item = this.items.find((entry) => entry.slug === slug)

      if (!item) {
        return
      }

      if (quantity <= 0) {
        this.removeItem(slug)
        return
      }

      item.quantity = Math.min(quantity, item.stock)
      persistCart(this.items)
    },
    clearCart() {
      this.items = []
      persistCart(this.items)
    },
  },
})
