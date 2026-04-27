<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { formatPrice } from '../utils/formatters'

const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const { user, userFullName } = storeToRefs(authStore)
const { items: orders, isLoading, error } = storeToRefs(ordersStore)

onMounted(() => {
  if (authStore.token) {
    ordersStore.fetchMyOrders(authStore.token)
  }
})
</script>

<template>
  <main class="page-shell account-page">
    <section class="account-hero">
      <p class="eyebrow">Mi cuenta</p>
      <h1>Sesion autenticada sobre la API real.</h1>
      <p class="hero-copy">
        Esta pantalla confirma que el token se guardo, el backend valido la sesion y el frontend
        pudo recuperar tu perfil.
      </p>
    </section>

    <section v-if="user" class="account-card">
      <div class="account-row">
        <span>Nombre completo</span>
        <strong>{{ userFullName }}</strong>
      </div>
      <div class="account-row">
        <span>Email</span>
        <strong>{{ user.email }}</strong>
      </div>
      <div class="account-row">
        <span>Rol</span>
        <strong>{{ user.role }}</strong>
      </div>
      <div class="account-row">
        <span>Telefono</span>
        <strong>{{ user.phone || 'Sin cargar' }}</strong>
      </div>
    </section>

    <section class="account-card account-card--wide">
      <p class="eyebrow">Mis ordenes</p>
      <p v-if="isLoading" class="state-message">Cargando ordenes...</p>
      <p v-else-if="error" class="state-message">{{ error }}</p>
      <p v-else-if="!orders.length" class="state-message">
        Todavia no hay compras registradas en esta cuenta.
      </p>

      <div v-else class="orders-list">
        <article v-for="order in orders" :key="order._id" class="order-card">
          <div class="summary-row">
            <span>Orden</span>
            <strong>#{{ order._id.slice(-6) }}</strong>
          </div>
          <div class="summary-row">
            <span>Estado</span>
            <strong>{{ order.status }}</strong>
          </div>
          <div class="summary-row">
            <span>Pago</span>
            <strong>{{ order.paymentStatus }}</strong>
          </div>
          <div class="summary-row">
            <span>Total</span>
            <strong>{{ formatPrice(order.total) }}</strong>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
