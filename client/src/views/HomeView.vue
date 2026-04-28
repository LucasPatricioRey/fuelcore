<script setup>
import { computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '../stores/products'
import bannerFuelCore from '../assets/banner-fuelcore.png'

const productsStore = useProductsStore()

const categoryCards = [
  {
    name: 'Proteinas',
    copy: 'Whey, isolate y blends pensados para recuperacion y ganancia muscular.',
    count: '32 productos',
  },
  {
    name: 'Creatina',
    copy: 'Opciones para fuerza, potencia y mejor rendimiento en cada bloque de trabajo.',
    count: '14 productos',
  },
  {
    name: 'Pre entreno',
    copy: 'Mas energia, foco y sensacion de arranque para entrenar con intensidad.',
    count: '18 productos',
  },
  {
    name: 'Combos',
    copy: 'Arma tu stack con packs listos para objetivos concretos y mejor precio.',
    count: '8 combos',
  },
]

const brands = ['ENA', 'Star Nutrition', 'Xtrenght', 'Optimum Nutrition', 'Universal', 'MyProtein']

const trustPillars = [
  'Pago seguro con Mercado Pago',
  'Envios a todo el pais',
  'Cuenta con seguimiento de ordenes',
  'Stock y panel administrativo conectados',
]

onMounted(() => {
  if (!productsStore.items.length) {
    productsStore.fetchProducts({ featured: 'true' })
  }
})

const featuredProducts = computed(() => {
  const featured = productsStore.items.filter((product) => product.featured)
  return (featured.length ? featured : productsStore.items).slice(0, 4)
})
</script>

<template>
  <main class="page-shell--home">
    <section class="home-banner">
      <router-link class="home-banner__frame" to="/tienda">
        <img :src="bannerFuelCore" alt="FuelCore banner principal" />
      </router-link>
    </section>

    <div class="home-content-shell">
      <section class="home-promo-strip">
        <article class="home-promo-strip__card">
          <strong>Envios a todo el pais</strong>
          <span>Recibi tus suplementos con una experiencia de compra simple y segura.</span>
        </article>
        <article class="home-promo-strip__card">
          <strong>Mercado Pago protegido</strong>
          <span>Paga con checkout real y seguimiento desde tu cuenta.</span>
        </article>
        <article class="home-promo-strip__card">
          <strong>Combos y rendimiento</strong>
          <span>Arma tu stack con creatina, proteinas y pre entrenos en una sola tienda.</span>
        </article>
      </section>

      <section class="home-strip">
        <div class="home-strip__inner">
          <span v-for="brand in brands" :key="brand">{{ brand }}</span>
        </div>
      </section>

      <section class="home-categories">
        <div class="section-heading home-section-heading">
          <div>
            <p class="eyebrow">Categorias principales</p>
            <h2>Explora la tienda por linea de producto.</h2>
          </div>
          <router-link class="secondary-link" to="/tienda">Ver todo el catalogo</router-link>
        </div>

        <div class="home-categories__grid">
          <article v-for="category in categoryCards" :key="category.name" class="home-category-card">
            <span class="home-category-card__count">{{ category.count }}</span>
            <h3>{{ category.name }}</h3>
            <p>{{ category.copy }}</p>
            <router-link class="home-category-card__link" to="/tienda">Comprar ahora</router-link>
          </article>
        </div>
      </section>

      <section class="home-featured">
        <div class="section-heading home-section-heading">
          <div>
            <p class="eyebrow">Productos destacados</p>
            <h2>Selecciones fuertes para fuerza, energia y recuperacion.</h2>
          </div>
        </div>

        <div class="home-featured__toolbar">
          <span>Ofertas, top ventas y productos con salida rapida.</span>
          <router-link class="primary-link" to="/tienda">Ir a la tienda</router-link>
        </div>

        <p v-if="productsStore.isLoading" class="state-message">Cargando productos destacados...</p>
        <p v-else-if="productsStore.error" class="state-message">{{ productsStore.error }}</p>

        <section v-else class="product-grid product-grid--home">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product._id ?? product.slug"
            :product="product"
          />
        </section>
      </section>

      <section class="home-trust">
        <article v-for="pillar in trustPillars" :key="pillar" class="home-trust__card">
          <h3>{{ pillar }}</h3>
          <p>Una experiencia de compra que mantiene cuenta, carrito, checkout y operacion real.</p>
        </article>
      </section>
    </div>
  </main>
</template>
