<script setup>
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { items, subtotal } = storeToRefs(cartStore)

const form = reactive({
  fullName: authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : '',
  addressLine1: '',
  city: '',
  postalCode: '',
  country: 'Argentina',
})
</script>

<template>
  <main class="page-shell">
    <section class="cart-layout">
      <div class="auth-card">
        <p class="eyebrow">Checkout</p>
        <h1>Base lista para integrar pagos.</h1>
        <p class="auth-copy">
          Todavia no estamos cobrando. Esta pantalla prepara los datos que despues vamos a mandar
          al backend para crear la orden y delegar el pago a Stripe.
        </p>

        <form class="auth-form">
          <label class="form-field">
            <span>Nombre completo</span>
            <input v-model="form.fullName" type="text" placeholder="Nombre y apellido" />
          </label>

          <label class="form-field">
            <span>Direccion</span>
            <input v-model="form.addressLine1" type="text" placeholder="Calle y numero" />
          </label>

          <div class="form-grid">
            <label class="form-field">
              <span>Ciudad</span>
              <input v-model="form.city" type="text" placeholder="Buenos Aires" />
            </label>

            <label class="form-field">
              <span>Codigo postal</span>
              <input v-model="form.postalCode" type="text" placeholder="1000" />
            </label>
          </div>

          <label class="form-field">
            <span>Pais</span>
            <input v-model="form.country" type="text" />
          </label>

          <button class="primary-button" type="button" disabled>
            Checkout de Stripe en la siguiente etapa
          </button>
        </form>
      </div>

      <aside class="summary-card">
        <p class="eyebrow">Orden</p>
        <div v-for="item in items" :key="item.slug" class="summary-row">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <strong>{{ formatPrice(item.price * item.quantity) }}</strong>
        </div>
        <div class="summary-row summary-row--total">
          <span>Total estimado</span>
          <strong>{{ formatPrice(subtotal) }}</strong>
        </div>
      </aside>
    </section>
  </main>
</template>
