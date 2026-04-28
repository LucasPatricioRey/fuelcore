<script setup>
const heroHighlights = [
  {
    title: 'Creatinas y pre entrenos',
    copy: 'Seleccion de fuerza, energia y pump para entrenar con mas intensidad.',
    note: 'Ofertas de la semana',
  },
  {
    title: 'Whey y blends premium',
    copy: 'Proteinas de rapida reposicion para completar la recuperacion post rutina.',
    note: 'Top ventas',
  },
]

const categories = [
  { name: 'Proteinas', count: '32 productos', copy: 'Whey, isolate, vegan y ganadores para todas las etapas.' },
  { name: 'Creatina', count: '14 productos', copy: 'Mono, micronizada y combinaciones para fuerza y explosividad.' },
  { name: 'Pre entreno', count: '18 productos', copy: 'Formula para foco, empuje y sensacion de arranque fuerte.' },
  { name: 'Salud & bienestar', count: '21 productos', copy: 'Vitaminas, omegas, adaptogenos y apoyo diario.' },
]

const brands = ['ENA', 'Star Nutrition', 'Xtrenght', 'MyProtein', 'BSN', 'Optimum Nutrition']

const trustPillars = [
  'Pago seguro con Mercado Pago',
  'Panel de ordenes y seguimiento real',
  'Stock y catalogo conectados a la base',
  'Diseño de tienda pensado para conversion',
]
</script>

<template>
  <main class="page-shell page-shell--storefront">
    <section class="storefront-hero">
      <div class="storefront-hero__main">
        <p class="eyebrow">FuelCore store</p>
        <h1>Suplementos, nutricion deportiva y accesorios en una tienda hecha para vender.</h1>
        <p class="hero-copy">
          Compra creatina, proteinas, pre entrenos y packs con una experiencia directa, visual y
          orientada al rendimiento. Todo presentado con la logica de un e-commerce real.
        </p>

        <div class="hero-actions">
          <router-link class="primary-link" to="/tienda">Comprar ahora</router-link>
          <router-link class="secondary-link" to="/tienda">Ver ofertas destacadas</router-link>
        </div>

        <div class="storefront-badges">
          <span>Envios a todo el pais</span>
          <span>Promociones bancarias</span>
          <span>Checkout con Mercado Pago</span>
        </div>
      </div>

      <aside class="storefront-hero__aside">
        <article class="feature-banner feature-banner--primary">
          <small>Promo exclusiva</small>
          <h2>Combos para fuerza y recuperacion con precio especial.</h2>
          <p>Arma el stack de entrenamiento sin salir del catalogo principal.</p>
        </article>

        <div class="feature-banner-grid">
          <article v-for="highlight in heroHighlights" :key="highlight.title" class="feature-banner">
            <small>{{ highlight.note }}</small>
            <h3>{{ highlight.title }}</h3>
            <p>{{ highlight.copy }}</p>
          </article>
        </div>
      </aside>
    </section>

    <section class="brand-shelf">
      <div class="section-heading section-heading--inline">
        <div>
          <p class="eyebrow">Marcas y lineas</p>
          <h2>Una vidriera de suplementos con lectura comercial inmediata.</h2>
        </div>
      </div>

      <div class="brand-shelf__rail">
        <span v-for="brand in brands" :key="brand">{{ brand }}</span>
      </div>
    </section>

    <section class="catalog-showcase">
      <div class="section-heading">
        <p class="eyebrow">Categorias principales</p>
        <h2>Organiza la tienda como lo haria una marca que vende todos los dias.</h2>
      </div>

      <div class="catalog-showcase__grid">
        <article v-for="category in categories" :key="category.name" class="catalog-showcase__card">
          <div>
            <span class="catalog-showcase__count">{{ category.count }}</span>
            <h3>{{ category.name }}</h3>
            <p>{{ category.copy }}</p>
          </div>

          <router-link class="secondary-link" to="/tienda">Ver categoria</router-link>
        </article>
      </div>
    </section>

    <section class="offer-strip">
      <div>
        <p class="eyebrow">Listo para comprar</p>
        <h2>Catalogo, carrito, checkout y panel administrativo en una sola experiencia.</h2>
      </div>
      <router-link class="primary-link" to="/tienda">Ir al catalogo</router-link>
    </section>

    <section class="trust-grid">
      <article v-for="pillar in trustPillars" :key="pillar" class="trust-grid__card">
        <h3>{{ pillar }}</h3>
        <p>
          Una base visual y funcional que muestra producto, proceso comercial y operacion real sin
          sentirse como demo.
        </p>
      </article>
    </section>
  </main>
</template>
