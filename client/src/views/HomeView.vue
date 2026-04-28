<script setup>
import { computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '../stores/products'
import bannerFuelCore from '../assets/banner-fuelcore.png'

const productsStore = useProductsStore()

const categoryCards = [
  {
    name: 'Proteinas',
    copy: 'Whey para recuperacion, masa muscular y constancia en la suplementacion diaria.',
    count: '1 producto',
  },
  {
    name: 'Creatina',
    copy: 'Creatina micronizada para fuerza, rendimiento y progreso sostenido en cada rutina.',
    count: '1 producto',
  },
  {
    name: 'Pre entreno',
    copy: 'Mas foco, energia y empuje con formulas fuertes para entrenamientos exigentes.',
    count: '1 producto',
  },
  {
    name: 'Control de peso',
    copy: 'Quemadores y soporte metabolico para etapas de definicion con lectura comercial real.',
    count: '1 producto',
  },
]

const brands = ['Iron Fuel', 'Whey Protein', 'Creatine', 'BCAA 2:1:1', 'Pre Workout', 'Protein Bar']

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
        <div class="section-heading home-section-heading home-section-heading--categories">
          <div class="home-section-heading__content">
            <p class="eyebrow">Categorias principales</p>
            <h2 class="home-section-heading__title home-section-heading__title--categories">
              Explora la tienda por linea de producto.
            </h2>
            <router-link class="secondary-link home-section-heading__link" to="/tienda">
              Ver todo el catalogo
            </router-link>
          </div>
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
        <div class="section-heading home-section-heading home-section-heading--featured">
          <div class="home-section-heading__content">
            <p class="eyebrow">Productos destacados</p>
            <h2 class="home-section-heading__title home-section-heading__title--featured">
              Selecciones fuertes para fuerza, energia y recuperacion.
            </h2>
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

      <section class="home-video">
        <div class="home-video__copy">
          <p class="eyebrow">Campana FuelCore</p>
          <h2>Rendimiento visual para cerrar la experiencia de marca.</h2>
          <p>
            Un bloque final mas de campaña, arriba del footer, para que la home termine con una
            sensacion mas fuerte de gimnasio, esfuerzo y suplementacion real.
          </p>
        </div>

        <div class="home-video__frame">
          <video
            class="home-video__media"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            controls
            poster="/products/pre-workout-350g.png"
          >
            <source src="/media/fuelcore-training.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </div>
  </main>
</template>
