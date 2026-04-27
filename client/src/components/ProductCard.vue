<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'

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
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <span v-if="product.featured" class="product-card__badge">Destacado</span>
    </div>

    <div class="product-card__body">
      <p class="product-card__meta">{{ product.category }} / {{ product.goal }}</p>
      <h3>{{ product.name }}</h3>
      <p class="product-card__description">{{ product.description }}</p>

      <div class="product-card__footer">
        <div>
          <p v-if="product.comparePrice" class="product-card__compare">
            {{ formatPrice(product.comparePrice) }}
          </p>
          <strong>{{ formatPrice(product.price) }}</strong>
        </div>

        <span class="product-card__stock">{{ product.stock }} disponibles</span>
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
