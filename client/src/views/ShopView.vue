<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '../stores/products'

const productsStore = useProductsStore()
const categoryOptions = ['todas', 'proteinas', 'creatina', 'pre-entrenos', 'packs']
const goalOptions = ['todos', 'recuperacion', 'fuerza', 'energia', 'rendimiento']

const filters = reactive({
  search: '',
  category: 'todas',
  goal: 'todos',
  sort: 'latest',
  minPrice: '',
  maxPrice: '',
})

const activeFilterCount = computed(() =>
  [
    filters.search,
    filters.category !== 'todas',
    filters.goal !== 'todos',
    filters.sort !== 'latest',
    filters.minPrice,
    filters.maxPrice,
  ]
    .filter(Boolean)
    .length,
)

const loadProducts = () =>
  productsStore.fetchProducts({
    search: filters.search.trim(),
    category: filters.category === 'todas' ? '' : filters.category,
    goal: filters.goal === 'todos' ? '' : filters.goal,
    sort: filters.sort,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  })

onMounted(loadProducts)

watch(
  () => [filters.category, filters.goal, filters.sort],
  () => {
    loadProducts()
  },
)

let searchTimeout = null

watch(
  () => [filters.search, filters.minPrice, filters.maxPrice],
  () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      loadProducts()
    }, 250)
  },
)

const resetFilters = () => {
  filters.search = ''
  filters.category = 'todas'
  filters.goal = 'todos'
  filters.sort = 'latest'
  filters.minPrice = ''
  filters.maxPrice = ''
}
</script>

<template>
  <main class="page-shell page-shell--storefront">
    <section class="catalog-header">
      <div>
        <p class="eyebrow">Inicio · Suplementos</p>
        <h1>Suplementos</h1>
      </div>

      <label class="catalog-header__sort">
        <span>Ordenar</span>
        <select v-model="filters.sort">
          <option value="latest">Nuevos ingresos</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
          <option value="name_asc">Nombre A-Z</option>
        </select>
      </label>
    </section>

    <section class="catalog-layout">
      <aside class="catalog-sidebar">
        <div class="catalog-filter-box">
          <label class="form-field">
            <span>Categorías</span>
            <select v-model="filters.category">
              <option v-for="category in categoryOptions" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </label>
        </div>

        <div class="catalog-filter-box">
          <label class="form-field">
            <span>Marca / búsqueda</span>
            <input v-model="filters.search" type="text" placeholder="Whey, creatina, pre..." />
          </label>
        </div>

        <div class="catalog-filter-box">
          <label class="form-field">
            <span>Objetivo</span>
            <select v-model="filters.goal">
              <option v-for="goal in goalOptions" :key="goal" :value="goal">
                {{ goal }}
              </option>
            </select>
          </label>
        </div>

        <div class="catalog-filter-box">
          <span class="catalog-filter-box__title">Precio</span>
          <div class="catalog-filter-box__price">
            <input v-model="filters.minPrice" type="number" min="0" placeholder="Desde" />
            <input v-model="filters.maxPrice" type="number" min="0" placeholder="Hasta" />
          </div>
        </div>

        <button v-if="activeFilterCount" class="ghost-button catalog-filter-box__reset" type="button" @click="resetFilters">
          Limpiar filtros
        </button>
      </aside>

      <div class="catalog-results">
        <div class="results-bar results-bar--catalog">
          <strong>{{ productsStore.items.length }}</strong>
          <span>productos encontrados</span>
        </div>

        <p v-if="productsStore.isLoading" class="state-message">Cargando productos...</p>
        <p v-else-if="productsStore.error" class="state-message">{{ productsStore.error }}</p>
        <p v-else-if="!productsStore.items.length" class="state-message">
          No encontramos productos con esos filtros. Prueba otra combinacion.
        </p>

        <section v-else class="product-grid product-grid--catalog">
          <ProductCard
            v-for="product in productsStore.items"
            :key="product._id ?? product.slug"
            :product="product"
          />
        </section>
      </div>
    </section>
  </main>
</template>
