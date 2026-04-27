<script setup>
const metrics = [
  { value: '+120', label: 'ordenes simuladas', note: 'flujo real con pagos y stock' },
  { value: '24 hs', label: 'enfoque comercial', note: 'brand, carrito y admin alineados' },
  { value: 'Full stack', label: 'base conectada', note: 'Vue, Express, Mongo y Mercado Pago' },
]

const categories = [
  {
    name: 'Proteinas',
    description: 'Formulas para recuperar mejor y sostener volumen de entrenamiento.',
    accent: 'Performance',
  },
  {
    name: 'Creatina',
    description: 'Potencia pura para series pesadas, sprints y constancia semanal.',
    accent: 'Potencia',
  },
  {
    name: 'Pre entrenos',
    description: 'Energia, foco y sensacion de empuje antes de entrar al gimnasio.',
    accent: 'Impulso',
  },
]

const pillars = [
  'Checkout real con Mercado Pago y ordenes persistidas.',
  'Cuenta de cliente con historial de compras y estados.',
  'Panel admin con facturacion, stock bajo y ordenes recientes.',
]
</script>

<template>
  <main class="page-shell">
    <section class="hero hero--editorial">
      <div class="hero__content">
        <p class="eyebrow">FuelCore Performance Supply</p>
        <h1>Marca premium para gente que entrena con objetivo.</h1>
        <p class="hero-copy">
          Suplementacion, combos y accesorios presentados como un e-commerce serio: visual fuerte,
          checkout real y una operacion que ya se siente comercial.
        </p>

        <div class="hero-actions">
          <router-link class="primary-link" to="/tienda">Comprar linea principal</router-link>
          <router-link class="secondary-link" to="/admin">Ver dashboard</router-link>
        </div>

        <div class="hero-metrics">
          <article v-for="metric in metrics" :key="metric.label" class="hero-metric-card">
            <strong>{{ metric.value }}</strong>
            <span>{{ metric.label }}</span>
            <small>{{ metric.note }}</small>
          </article>
        </div>
      </div>

      <aside class="hero-spotlight">
        <div class="hero-spotlight__panel">
          <p class="eyebrow">Lanzamiento de temporada</p>
          <h2>Stack de fuerza, energia y recuperacion.</h2>
          <p>
            Una direccion visual mas agresiva, mas marca y menos demo generica. El objetivo es que
            la tienda se vea como algo que podria salir a vender mañana.
          </p>
        </div>

        <div class="hero-spotlight__grid">
          <article class="spotlight-tile spotlight-tile--primary">
            <span>Creatina</span>
            <strong>300 g micronizada</strong>
          </article>
          <article class="spotlight-tile">
            <span>Proteina</span>
            <strong>Blend post training</strong>
          </article>
          <article class="spotlight-tile">
            <span>Pack</span>
            <strong>Fuerza + recuperacion</strong>
          </article>
        </div>
      </aside>
    </section>

    <section class="section-block section-block--split">
      <div class="section-heading section-heading--narrow">
        <p class="eyebrow">Direccion de marca</p>
        <h2>Una tienda pensada para portfolio, pero con tension comercial real.</h2>
      </div>

      <div class="info-grid info-grid--editorial">
        <article v-for="pillar in pillars" :key="pillar" class="info-card">
          <h3>{{ pillar }}</h3>
          <p>Base funcional lista para crecer sin rehacer auth, pagos ni panel operativo.</p>
        </article>
      </div>
    </section>

    <section class="categories categories--showcase">
      <div class="section-heading">
        <p class="eyebrow">Categorias destacadas</p>
        <h2>Lineas creadas para cubrir fuerza, rendimiento y recuperacion.</h2>
      </div>

      <div class="category-grid category-grid--immersive">
        <article v-for="category in categories" :key="category.name" class="category-card">
          <span class="category-card__accent">{{ category.accent }}</span>
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
          <router-link class="secondary-link" to="/tienda">Ver productos</router-link>
        </article>
      </div>
    </section>

    <section class="preview-cta preview-cta--wide">
      <div class="preview-cta__content">
        <p class="eyebrow">Siguiente paso visual</p>
        <h2>Recorre la tienda y mirala ya como una marca, no como un scaffold.</h2>
      </div>

      <router-link class="primary-link" to="/tienda">Ir al catalogo completo</router-link>
    </section>
  </main>
</template>
