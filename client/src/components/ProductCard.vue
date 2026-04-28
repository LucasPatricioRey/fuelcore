<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'
import { getProductImage, handleProductImageError } from '../utils/productVisuals'

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

const installmentText = computed(() => {
  const installmentAmount = Math.round(props.product.price / 3)
  return `3 x ${formatPrice(installmentAmount)}`
})

const categoryLabel = computed(() =>
  (props.product.category ?? '')
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
)
</script>

<template>
  <article class="product-card product-card--commerce">
    <div class="product-card__media product-card__media--commerce">
      <img
        :src="getProductImage(product)"
        :alt="product.name"
        loading="lazy"
        @error="handleProductImageError($event, product)"
      />
      <span v-if="product.comparePrice" class="product-card__badge">Oferta</span>
      <span class="product-card__goal">{{ categoryLabel }}</span>
    </div>

    <div class="product-card__body product-card__body--commerce">
      <div class="product-card__intro">
        <p class="product-card__meta">{{ product.goal }} / {{ categoryLabel }}</p>
        <h3>{{ product.name }}</h3>
      </div>

      <div class="product-card__price-block">
        <div class="product-card__price-copy">
          <p v-if="product.comparePrice" class="product-card__compare">
            {{ formatPrice(product.comparePrice) }}
          </p>
          <strong>{{ formatPrice(product.price) }}</strong>
        </div>

        <span class="product-card__installments">{{ installmentText }} sin interes</span>
      </div>

      <div class="product-card__footer">
        <span class="product-card__shipping">En stock</span>
        <span class="product-card__stock">{{ product.stock }} unidades</span>
      </div>

      <div class="product-card__actions">
        <button class="primary-button product-card__buy" type="button" @click="handleAddToCart">
          Agregar al carrito
        </button>
        <button
          class="ghost-button product-card__detail"
          type="button"
          @click="router.push(`/productos/${product.slug}`)"
        >
          Ver detalle
        </button>
      </div>
    </div>
  </article>
</template>
