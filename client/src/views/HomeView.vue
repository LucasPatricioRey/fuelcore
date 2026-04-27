<script setup>
const highlights = [
  'Catalogo listo para crecer',
  'Checkout preparado para Stripe',
  'Panel admin con enfoque comercial',
]

const categories = [
  { name: 'Proteinas', description: 'Recuperacion y masa muscular' },
  { name: 'Creatina', description: 'Potencia y rendimiento' },
  { name: 'Pre entrenos', description: 'Energia antes de entrenar' },
]
</script>

<template>
  <main class="page-shell">
    <section class="hero">
      <p class="eyebrow">FuelCore</p>
      <h1>Nutricion deportiva para rendir en serio.</h1>
      <p class="hero-copy">
        Base inicial del e-commerce: una marca fitness premium con catalogo, pagos,
        roles y dashboard de negocio.
      </p>

      <div class="hero-actions">
        <router-link class="primary-link" to="/tienda">Explorar lineas</router-link>
        <a class="secondary-link" href="#alcance">Ver alcance inicial</a>
      </div>
    </section>

    <section id="alcance" class="info-grid">
      <article v-for="item in highlights" :key="item" class="info-card">
        <h2>{{ item }}</h2>
        <p>Esta etapa deja lista la estructura para avanzar sin rehacer la base.</p>
      </article>
    </section>

    <section id="categorias" class="categories">
      <div class="section-heading">
        <p class="eyebrow">Categorias iniciales</p>
        <h2>Una tienda pensada para portfolio y negocio real.</h2>
      </div>

      <div class="category-grid">
        <article v-for="category in categories" :key="category.name" class="category-card">
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
        </article>
      </div>
    </section>

    <section class="preview-cta">
      <div class="preview-cta__content">
        <p class="eyebrow">Siguiente avance</p>
        <h2>El catalogo ya empieza a verse como una tienda.</h2>
      </div>

      <router-link class="primary-link" to="/tienda">Ir a la tienda</router-link>
    </section>
  </main>
</template>
