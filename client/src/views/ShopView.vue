<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '../stores/products'

const productsStore = useProductsStore()
const categoryOptions = ['todas', 'proteinas', 'creatina', 'pre-entrenos', 'packs']
const goalOptions = ['todos', 'recuperacion', 'fuerza', 'energia', 'rendimiento']
const quickPicks = ['Mas vendidos', 'Nuevos ingresos', 'Combos', 'Marcas premium']

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
  <main class="page-shell page-shell--storefront">
    <section class="shop-banner">
      <div class="shop-banner__copy">
        <p class="eyebrow">Tienda online</p>
        <h1>Explora un catalogo con lectura de tienda real, filtros claros y productos listos para comprar.</h1>
        <p class="hero-copy">
          FuelCore ordena la compra por categoria, objetivo y precio para que la navegacion se
          sienta mas parecida a una tienda comercial que a una maqueta de portfolio.
        </p>
      </div>

      <div class="shop-banner__meta">
        <article class="shop-banner__stat">
          <strong>{{ productsStore.items.length || 4 }}</strong>
          <span>productos visibles</span>
        </article>
        <article class="shop-banner__stat">
          <strong>{{ featuredCount || 3 }}</strong>
          <span>destacados activos</span>
        </article>
      </div>
    </section>

    <section class="quick-picks">
      <span v-for="pick in quickPicks" :key="pick">{{ pick }}</span>
    </section>

    <section class="filters-panel">
      <div class="filters-panel__header">
        <div>
          <p class="eyebrow">Filtrado comercial</p>
          <h2>Encuentra rapido la linea que mas te conviene</h2>
        </div>

        <button v-if="activeFilterCount" class="ghost-button shop-toolbar__reset" type="button" @click="resetFilters">
          Limpiar filtros
        </button>
      </div>

      <div class="filters-panel__grid">
        <label class="form-field">
          <span>Buscar producto</span>
          <input v-model="filters.search" type="text" placeholder="Whey, creatina, pre entreno..." />
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
            <option value="latest">Nuevos ingresos</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="name_asc">Nombre A-Z</option>
          </select>
        </label>
      </div>
    </section>

    <div class="results-bar">
      <strong>{{ productsStore.items.length }}</strong>
      <span>resultados listos para compra online</span>
    </div>

    <p v-if="productsStore.isLoading" class="state-message">Cargando productos...</p>
    <p v-else-if="productsStore.error" class="state-message">{{ productsStore.error }}</p>
    <p v-else-if="!productsStore.items.length" class="state-message">
      No encontramos productos para esa combinacion. Ajusta los filtros y vuelve a intentar.
    </p>

    <section v-else class="product-grid product-grid--commerce">
      <ProductCard
        v-for="product in productsStore.items"
        :key="product._id ?? product.slug"
        :product="product"
      />
    </section>
  </main>
</template>
