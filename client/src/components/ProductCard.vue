<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <span v-if="product.featured" class="product-card__badge">Destacado</span>
    </div>

    <div class="product-card__body">
      <p class="product-card__meta">{{ product.category }} · {{ product.goal }}</p>
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
    </div>
  </article>
</template>
