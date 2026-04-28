<script setup>
const metrics = [
  {
    value: '4 lineas',
    label: 'catalogo principal',
    note: 'proteinas, creatina, pre entrenos y packs',
  },
  {
    value: 'Pagos online',
    label: 'checkout integrado',
    note: 'Mercado Pago conectado con ordenes y stock',
  },
  {
    value: 'Panel admin',
    label: 'control operativo',
    note: 'ventas, ordenes y productos con bajo stock',
  },
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
  'Compra online con Mercado Pago y ordenes registradas en tiempo real.',
  'Cuenta de cliente con seguimiento de compras y estados de pago.',
  'Panel administrativo con ventas, stock bajo y ordenes recientes.',
]
</script>

<template>
  <main class="page-shell">
    <section class="hero hero--editorial">
      <div class="hero__content">
        <p class="eyebrow">FuelCore Performance Supply</p>
        <h1>Marca premium para gente que entrena con objetivo.</h1>
        <p class="hero-copy">
          Suplementos, combos y accesorios presentados como una tienda de nutricion deportiva
          moderna, con compra real, seguimiento de ordenes y una identidad visual enfocada en
          rendimiento.
        </p>

        <div class="hero-actions">
          <router-link class="primary-link" to="/tienda">Explorar productos</router-link>
          <a class="secondary-link" href="#categorias">Ver categorias</a>
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
          <h2>Fuerza, energia y recuperacion en una sola seleccion.</h2>
          <p>
            Productos pensados para cubrir toda la rutina: pre entrenamiento, potencia,
            recuperacion y combinaciones listas para una compra mas simple.
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
        <h2>Una experiencia pensada para inspirar confianza desde la primera visita.</h2>
      </div>

      <div class="info-grid info-grid--editorial">
        <article v-for="pillar in pillars" :key="pillar" class="info-card">
          <h3>{{ pillar }}</h3>
          <p>
            Una estructura preparada para sostener crecimiento sin perder claridad visual ni orden
            operativo.
          </p>
        </article>
      </div>
    </section>

    <section id="categorias" class="categories categories--showcase">
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
        <p class="eyebrow">Explora la tienda</p>
        <h2>Descubri las lineas principales y empeza tu pedido desde el catalogo.</h2>
      </div>

      <router-link class="primary-link" to="/tienda">Ir al catalogo completo</router-link>
    </section>
  </main>
</template>
