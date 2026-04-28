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
      <h1>Tu pedido fue recibido correctamente.</h1>
      <p class="auth-copy">
        Ya podes revisar la compra desde tu cuenta. En los proximos instantes el sistema termina
        de consolidar el pago y actualizar el estado de la orden.
      </p>

      <router-link class="primary-link auth-link" to="/mi-cuenta">Ver mi cuenta</router-link>
    </section>
  </main>
</template>
