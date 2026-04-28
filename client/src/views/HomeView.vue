<script setup>
import { computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '../stores/products'

const productsStore = useProductsStore()

const featurePromos = [
  {
    title: 'Creatina y fuerza',
    copy: 'Mono, micronizada y formulas para sumar potencia en entrenamientos exigentes.',
    label: 'Mas buscado',
  },
  {
    title: 'Proteinas y recuperacion',
    copy: 'Whey, blends y opciones para completar el post entrenamiento.',
    label: 'Top ventas',
  },
  {
    title: 'Pre entreno y energia',
    copy: 'Lineas para foco, empuje y mejor arranque antes de cada sesion.',
    label: 'Novedades',
  },
]

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
  <main class="page-shell page-shell--home">
    <section class="home-hero">
      <div class="home-hero__main">
        <p class="eyebrow">FuelCore performance store</p>
        <h1>Suplementos, promociones y categorias listas para comprar.</h1>
        <p class="home-hero__copy">
          Compra creatina, proteinas, pre entrenos y combos con una experiencia directa, comercial
          y mas cercana a una tienda real del rubro fitness argentino.
        </p>

        <div class="hero-actions home-hero__actions">
          <router-link class="primary-link" to="/tienda">Comprar suplementos</router-link>
          <router-link class="secondary-link" to="/tienda">Ver ofertas del catalogo</router-link>
        </div>

        <div class="home-hero__benefits">
          <span>Envios a todo el pais</span>
          <span>Promociones bancarias</span>
          <span>Checkout con Mercado Pago</span>
        </div>
      </div>

      <aside class="home-hero__aside">
        <article class="home-promo home-promo--primary">
          <small>Beneficio destacado</small>
          <h2>Aprovecha el beneficio del envio gratis en compras seleccionadas.</h2>
          <p>Compra tus suplementos y completa el carrito con una lectura simple y comercial.</p>
        </article>

        <div class="home-promo-grid">
          <article v-for="promo in featurePromos" :key="promo.title" class="home-promo">
            <small>{{ promo.label }}</small>
            <h3>{{ promo.title }}</h3>
            <p>{{ promo.copy }}</p>
          </article>
        </div>
      </aside>
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
  </main>
</template>
