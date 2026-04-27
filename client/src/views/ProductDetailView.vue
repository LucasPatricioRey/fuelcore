<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'
import { formatPrice } from '../utils/formatters'
import { getProductImage, getProductTheme, handleProductImageError } from '../utils/productVisuals'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const product = ref(null)
const quantity = ref(1)
const error = ref('')
const isLoading = ref(true)

const canIncrease = computed(() => product.value && quantity.value < product.value.stock)
const theme = computed(() => getProductTheme(product.value?.category))

onMounted(async () => {
  try {
    product.value = await productsStore.fetchProductBySlug(route.params.slug)
  } catch {
    error.value = 'No se pudo cargar el producto seleccionado.'
  } finally {
    isLoading.value = false
  }
})

const addToCart = () => {
  if (!product.value) {
    return
  }

  cartStore.addItem(product.value, quantity.value)
  router.push('/carrito')
}
</script>

<template>
  <main class="page-shell">
    <p v-if="isLoading" class="state-message">Cargando detalle del producto...</p>
    <p v-else-if="error" class="state-message">{{ error }}</p>

    <section v-else-if="product" class="product-detail">
      <div
        class="product-detail__media"
        :style="{ '--product-accent': theme.accent, '--product-glow': theme.shadow }"
      >
        <img
          :src="getProductImage(product)"
          :alt="product.name"
          @error="handleProductImageError($event, product)"
        />
        <div class="product-detail__glow"></div>
      </div>

      <div class="product-detail__content">
        <p class="eyebrow">{{ theme.eyebrow }} / {{ product.category }}</p>
        <h1>{{ product.name }}</h1>
        <p class="hero-copy">{{ product.description }}</p>

        <div class="detail-meta">
          <span>Objetivo: {{ product.goal }}</span>
          <span>Sabor: {{ product.flavor || 'No especificado' }}</span>
          <span>Stock: {{ product.stock }} unidades</span>
        </div>

        <div class="detail-price">
          <p v-if="product.comparePrice" class="product-card__compare">
            {{ formatPrice(product.comparePrice) }}
          </p>
          <strong>{{ formatPrice(product.price) }}</strong>
        </div>

        <div class="detail-actions detail-actions--panel">
          <div class="quantity-selector">
            <button class="ghost-button" type="button" @click="quantity = Math.max(1, quantity - 1)">
              -
            </button>
            <span>{{ quantity }}</span>
            <button class="ghost-button" type="button" :disabled="!canIncrease" @click="quantity += 1">
              +
            </button>
          </div>

          <button class="primary-button" type="button" @click="addToCart">Agregar al carrito</button>
        </div>
      </div>
    </section>
  </main>
</template>
