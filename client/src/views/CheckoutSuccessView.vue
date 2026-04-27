<script setup>
import { onMounted } from 'vue'
import { clearStoredCart, useCartStore } from '../stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  clearStoredCart()
  cartStore.clearCart()
})
</script>

<template>
  <main class="page-shell auth-page">
    <section class="auth-card auth-card--feature">
      <p class="eyebrow">Pago recibido</p>
      <h1>Compra confirmada y vuelta correcta al sitio.</h1>
      <p class="auth-copy">
        Tu orden ya puede verse en la cuenta. El webhook termina de consolidar el pago, actualizar
        el estado y descontar stock del producto correspondiente.
      </p>

      <router-link class="primary-link" to="/mi-cuenta">Ver mi cuenta</router-link>
    </section>
  </main>
</template>
