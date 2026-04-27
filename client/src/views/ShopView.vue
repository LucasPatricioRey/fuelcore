<script setup>
import { computed, onMounted, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '../stores/products'

const productsStore = useProductsStore()
const selectedCategory = ref('todas')

onMounted(() => {
  if (!productsStore.items.length) {
    productsStore.fetchProducts()
  }
})

const categories = computed(() => {
  const uniqueCategories = new Set(productsStore.items.map((product) => product.category))
  return ['todas', ...uniqueCategories]
})

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'todas') {
    return productsStore.items
  }

  return productsStore.items.filter((product) => product.category === selectedCategory.value)
})
</script>

<template>
  <main class="page-shell">
    <section class="shop-hero">
      <p class="eyebrow">Catalogo inicial</p>
      <h1>Suplementos y packs listos para una tienda real.</h1>
      <p class="hero-copy">
        Esta vista ya consume la capa de productos y usa datos de respaldo si la API todavia no
        esta levantada.
      </p>
    </section>

    <section class="shop-toolbar">
      <div class="filter-list">
        <button
          v-for="category in categories"
          :key="category"
          class="filter-chip"
          :class="{ 'filter-chip--active': selectedCategory === category }"
          type="button"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <p v-if="productsStore.isLoading" class="state-message">Cargando productos...</p>
    <p v-else-if="productsStore.error" class="state-message">{{ productsStore.error }}</p>

    <section v-else class="product-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product._id ?? product.slug"
        :product="product"
      />
    </section>
  </main>
</template>
