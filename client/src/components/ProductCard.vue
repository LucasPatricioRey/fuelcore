<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'
import { getProductImage, getProductTheme, handleProductImageError } from '../utils/productVisuals'

const router = useRouter()
const cartStore = useCartStore()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const handleAddToCart = () => {
  cartStore.addItem(props.product)
}

const theme = getProductTheme(props.product.category)
</script>

<template>
  <article class="product-card" :style="{ '--product-accent': theme.accent, '--product-glow': theme.shadow }">
    <div class="product-card__media">
      <img
        :src="getProductImage(product)"
        :alt="product.name"
        loading="lazy"
        @error="handleProductImageError($event, product)"
      />
      <div class="product-card__overlay"></div>
      <span v-if="product.featured" class="product-card__badge">Destacado</span>
      <span class="product-card__goal">{{ theme.eyebrow }}</span>
    </div>

    <div class="product-card__body">
      <div class="product-card__intro">
        <p class="product-card__meta">{{ product.category }} / {{ product.goal }}</p>
        <h3>{{ product.name }}</h3>
        <p class="product-card__description">{{ product.description }}</p>
      </div>

      <div class="product-card__footer">
        <div>
          <p v-if="product.comparePrice" class="product-card__compare">
            {{ formatPrice(product.comparePrice) }}
          </p>
          <strong>{{ formatPrice(product.price) }}</strong>
        </div>

        <span class="product-card__stock">
          <strong>{{ product.stock }}</strong>
          <small>disponibles</small>
        </span>
      </div>

      <div class="product-card__actions">
        <button class="ghost-button" type="button" @click="router.push(`/productos/${product.slug}`)">
          Ver detalle
        </button>
        <button class="primary-button" type="button" @click="handleAddToCart">Agregar</button>
      </div>
    </div>
  </article>
</template>
