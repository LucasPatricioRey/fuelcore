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
})

const activeFilterCount = computed(() =>
  [filters.search, filters.category !== 'todas', filters.goal !== 'todos', filters.sort !== 'latest']
    .filter(Boolean)
    .length,
)

const featuredCount = computed(() => productsStore.items.filter((product) => product.featured).length)

const loadProducts = () =>
  productsStore.fetchProducts({
    search: filters.search.trim(),
    category: filters.category === 'todas' ? '' : filters.category,
    goal: filters.goal === 'todos' ? '' : filters.goal,
    sort: filters.sort,
  })

onMounted(loadProducts)

watch(
  () => [filters.search, filters.category, filters.goal, filters.sort],
  () => {
    loadProducts()
  },
)

const resetFilters = () => {
  filters.search = ''
  filters.category = 'todas'
  filters.goal = 'todos'
  filters.sort = 'latest'
}
</script>

<template>
  <main class="page-shell">
    <section class="shop-hero shop-hero--premium">
      <div>
        <p class="eyebrow">Catalogo FuelCore</p>
        <h1>Suplementos seleccionados para rendimiento, fuerza y recuperacion.</h1>
        <p class="hero-copy">
          Recorre una seleccion orientada a entrenamiento, constancia y progreso diario, con una
          presentacion clara y foco comercial.
        </p>
      </div>

      <div class="shop-hero__stats">
        <article class="shop-stat">
          <strong>{{ productsStore.items.length || 4 }}</strong>
          <span>productos visibles</span>
        </article>
        <article class="shop-stat">
          <strong>{{ featuredCount || 3 }}</strong>
          <span>selecciones destacadas</span>
        </article>
      </div>
    </section>

    <section class="shop-toolbar shop-toolbar--panel">
      <div class="section-heading section-heading--inline">
        <div>
          <p class="eyebrow">Explora mejor</p>
          <h2>Busca y filtra segun tu objetivo</h2>
        </div>

        <button v-if="activeFilterCount" class="ghost-button shop-toolbar__reset" type="button" @click="resetFilters">
          Limpiar filtros
        </button>
      </div>

      <div class="shop-filters-grid">
        <label class="form-field">
          <span>Buscar</span>
          <input v-model="filters.search" type="text" placeholder="Creatina, proteina, pack..." />
        </label>

        <label class="form-field">
          <span>Categoria</span>
          <select v-model="filters.category">
            <option v-for="category in categoryOptions" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </label>

        <label class="form-field">
          <span>Objetivo</span>
          <select v-model="filters.goal">
            <option v-for="goal in goalOptions" :key="goal" :value="goal">
              {{ goal }}
            </option>
          </select>
        </label>

        <label class="form-field">
          <span>Ordenar</span>
          <select v-model="filters.sort">
            <option value="latest">Mas recientes</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="name_asc">Nombre A-Z</option>
          </select>
        </label>
      </div>
    </section>

    <p v-if="productsStore.isLoading" class="state-message">Cargando productos...</p>
    <p v-else-if="productsStore.error" class="state-message">{{ productsStore.error }}</p>
    <p v-else-if="!productsStore.items.length" class="state-message">
      No encontramos productos para esos filtros. Prueba otra combinacion.
    </p>

    <section v-else class="product-grid">
      <ProductCard
        v-for="product in productsStore.items"
        :key="product._id ?? product.slug"
        :product="product"
      />
    </section>
  </main>
</template>
