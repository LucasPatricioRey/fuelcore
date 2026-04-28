<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '../stores/products'

const productsStore = useProductsStore()
const route = useRoute()

const categoryOptions = [
  { value: 'todas', label: 'Todas las categorias' },
  { value: 'proteinas', label: 'Proteinas' },
  { value: 'creatina', label: 'Pre intra & creatina' },
  { value: 'pre-entrenos', label: 'Performance' },
  { value: 'packs', label: 'Vitaminas & suplementos' },
]

const goalOptions = [
  { value: 'todos', label: 'Todos los objetivos' },
  { value: 'recuperacion', label: 'Recuperacion' },
  { value: 'fuerza', label: 'Fuerza' },
  { value: 'energia', label: 'Energia' },
  { value: 'rendimiento', label: 'Control de peso' },
]

const filters = reactive({
  search: '',
  category: 'todas',
  goal: 'todos',
  sort: 'latest',
  minPrice: '',
  maxPrice: '',
})

const isCategoryOpen = ref(false)
const isGoalOpen = ref(false)

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

const selectedCategoryLabel = computed(
  () => categoryOptions.find((option) => option.value === filters.category)?.label ?? 'Categorias',
)

const selectedGoalLabel = computed(
  () => goalOptions.find((option) => option.value === filters.goal)?.label ?? 'Objetivos',
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

onMounted(() => {
  if (typeof route.query.q === 'string') {
    filters.search = route.query.q
  }

  loadProducts()
})

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

watch(
  () => route.query.q,
  (value) => {
    const nextSearch = typeof value === 'string' ? value : ''

    if (filters.search !== nextSearch) {
      filters.search = nextSearch
    }
  },
)

const activeFilters = computed(() => {
  const items = []

  if (filters.search) {
    items.push(`Busqueda: ${filters.search}`)
  }

  if (filters.category !== 'todas') {
    items.push(`Categoria: ${selectedCategoryLabel.value}`)
  }

  if (filters.goal !== 'todos') {
    items.push(`Objetivo: ${selectedGoalLabel.value}`)
  }

  if (filters.minPrice || filters.maxPrice) {
    items.push(`Precio: ${filters.minPrice || '0'} - ${filters.maxPrice || 'max'}`)
  }

  return items
})

const selectCategory = (value) => {
  filters.category = value
  isCategoryOpen.value = false
}

const selectGoal = (value) => {
  filters.goal = value
  isGoalOpen.value = false
}

const resetFilters = () => {
  filters.search = ''
  filters.category = 'todas'
  filters.goal = 'todos'
  filters.sort = 'latest'
  filters.minPrice = ''
  filters.maxPrice = ''
  isCategoryOpen.value = false
  isGoalOpen.value = false
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

        <div class="catalog-filter-dropdown">
          <button
            class="catalog-filter-dropdown__trigger"
            :class="{ 'catalog-filter-dropdown__trigger--open': isCategoryOpen }"
            type="button"
            @click="isCategoryOpen = !isCategoryOpen"
          >
            <span class="catalog-filter-dropdown__label">Categorias</span>
            <span class="catalog-filter-dropdown__value">{{ selectedCategoryLabel }}</span>
            <span class="catalog-filter-dropdown__icon">{{ isCategoryOpen ? '⌄' : '›' }}</span>
          </button>

          <div v-if="isCategoryOpen" class="catalog-filter-dropdown__panel">
            <button
              v-for="category in categoryOptions"
              :key="category.value"
              class="catalog-filter-dropdown__option"
              :class="{ 'catalog-filter-dropdown__option--active': filters.category === category.value }"
              type="button"
              @click="selectCategory(category.value)"
            >
              {{ category.label }}
            </button>
          </div>
        </div>

        <div class="catalog-filter-dropdown">
          <button
            class="catalog-filter-dropdown__trigger"
            :class="{ 'catalog-filter-dropdown__trigger--open': isGoalOpen }"
            type="button"
            @click="isGoalOpen = !isGoalOpen"
          >
            <span class="catalog-filter-dropdown__label">Objetivos</span>
            <span class="catalog-filter-dropdown__value">{{ selectedGoalLabel }}</span>
            <span class="catalog-filter-dropdown__icon">{{ isGoalOpen ? '⌄' : '›' }}</span>
          </button>

          <div v-if="isGoalOpen" class="catalog-filter-dropdown__panel">
            <button
              v-for="goal in goalOptions"
              :key="goal.value"
              class="catalog-filter-dropdown__option"
              :class="{ 'catalog-filter-dropdown__option--active': filters.goal === goal.value }"
              type="button"
              @click="selectGoal(goal.value)"
            >
              {{ goal.label }}
            </button>
          </div>
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
