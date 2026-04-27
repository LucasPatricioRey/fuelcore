<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.clearCart()
})
</script>

<template>
  <main class="page-shell auth-page">
    <section class="auth-card">
      <p class="eyebrow">Pago recibido</p>
      <h1>Stripe te devolvio al sitio correctamente.</h1>
      <p class="auth-copy">
        El paso importante no es esta pantalla, sino el webhook del backend. Stripe envia el evento
        a tu servidor para marcar la orden como pagada y descontar stock.
      </p>

      <router-link class="primary-link" to="/mi-cuenta">Ver mi cuenta</router-link>
    </section>
  </main>
</template>
