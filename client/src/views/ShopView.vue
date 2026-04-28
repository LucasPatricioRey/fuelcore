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

const activeFilters = computed(() => {
  const items = []

  if (filters.search) {
    items.push(`Busqueda: ${filters.search}`)
  }

  if (filters.category !== 'todas') {
    items.push(`Categoria: ${filters.category}`)
  }

  if (filters.goal !== 'todos') {
    items.push(`Objetivo: ${filters.goal}`)
  }

  if (filters.minPrice || filters.maxPrice) {
    items.push(`Precio: ${filters.minPrice || '0'} - ${filters.maxPrice || 'max'}`)
  }

  return items
})

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
  <main class="page-shell page-shell--catalog">
    <section class="catalog-hero">
      <div class="catalog-hero__copy">
        <p class="eyebrow">Inicio / Suplementos</p>
        <h1>Suplementos</h1>
        <p class="catalog-hero__text">
          Catalogo completo de FuelCore con seleccion de proteinas, creatinas, pre entrenos y
          combos listos para comprar con una lectura comercial mas clasica.
        </p>
      </div>

      <div class="catalog-hero__meta">
        <strong>{{ productsStore.items.length }}</strong>
        <span>productos publicados</span>
      </div>
    </section>

    <section class="catalog-layout">
      <aside class="catalog-sidebar">
        <div class="catalog-filter-box catalog-filter-box--header">
          <div>
            <span class="catalog-filter-box__eyebrow">Filtrar</span>
            <h2>Filtros</h2>
          </div>
          <button
            v-if="activeFilterCount"
            class="ghost-button catalog-filter-box__reset"
            type="button"
            @click="resetFilters"
          >
            Limpiar
          </button>
        </div>

        <div class="catalog-filter-box">
          <label class="form-field">
            <span>Que estas buscando?</span>
            <input v-model="filters.search" type="text" placeholder="Marca, producto o categoria" />
          </label>
        </div>

        <div class="catalog-filter-box">
          <label class="form-field">
            <span>Categorias</span>
            <select v-model="filters.category">
              <option v-for="category in categoryOptions" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
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
      </aside>

      <div class="catalog-results">
        <div class="catalog-results__toolbar">
          <div class="results-bar results-bar--catalog">
            <strong>{{ productsStore.items.length }}</strong>
            <span>productos encontrados</span>
          </div>

          <label class="catalog-header__sort">
            <span>Ordenar</span>
            <select v-model="filters.sort">
              <option value="latest">Mas nuevos</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="name_asc">Nombre A-Z</option>
            </select>
          </label>
        </div>

        <div v-if="activeFilters.length" class="catalog-active-filters">
          <span v-for="filter in activeFilters" :key="filter">{{ filter }}</span>
        </div>

        <p v-if="productsStore.isLoading" class="state-message">Cargando productos...</p>
        <p v-else-if="productsStore.error" class="state-message">{{ productsStore.error }}</p>
        <p v-else-if="!productsStore.items.length" class="state-message">
          No encontramos productos con esos filtros. Proba otra combinacion.
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
