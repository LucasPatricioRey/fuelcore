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

const featuredCount = computed(() => productsStore.items.filter((product) => product.featured).length)
</script>

<template>
  <main class="page-shell">
    <section class="shop-hero shop-hero--premium">
      <div>
        <p class="eyebrow">Catalogo FuelCore</p>
        <h1>Suplementos listos para verse como una tienda que vende de verdad.</h1>
        <p class="hero-copy">
          Vista comercial con filtros rapidos, cards mas trabajadas y una presentacion mucho mas
          alineada a una marca de performance premium.
        </p>
      </div>

      <div class="shop-hero__stats">
        <article class="shop-stat">
          <strong>{{ productsStore.items.length || 4 }}</strong>
          <span>productos activos</span>
        </article>
        <article class="shop-stat">
          <strong>{{ featuredCount || 3 }}</strong>
          <span>destacados en portada</span>
        </article>
      </div>
    </section>

    <section class="shop-toolbar shop-toolbar--panel">
      <div class="section-heading section-heading--inline">
        <div>
          <p class="eyebrow">Filtrar rapido</p>
          <h2>Elegi por categoria</h2>
        </div>
      </div>

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
