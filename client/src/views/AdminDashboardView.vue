<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '../stores/admin'
import { useAuthStore } from '../stores/auth'
import { formatPrice } from '../utils/formatters'

const authStore = useAuthStore()
const adminStore = useAdminStore()

const { summary, orders, isLoadingSummary, isLoadingOrders, error } = storeToRefs(adminStore)

const statusOptions = ['pendiente', 'pagado', 'en preparacion', 'enviado', 'entregado', 'cancelado']

onMounted(async () => {
  if (authStore.token) {
    await Promise.all([
      adminStore.fetchSummary(authStore.token),
      adminStore.fetchOrders(authStore.token),
    ])
  }
})

const handleStatusChange = async (orderId, event) => {
  await adminStore.changeOrderStatus({
    token: authStore.token,
    orderId,
    status: event.target.value,
  })
}
</script>

<template>
  <main class="page-shell">
    <section class="account-hero">
      <p class="eyebrow">Admin</p>
      <h1>Centro operativo con metricas, ordenes y stock en un solo lugar.</h1>
      <p class="hero-copy">
        Dashboard inicial enfocado en lectura rapida, control de estados y señales utiles para una
        marca que quiere verse comercial de verdad.
      </p>
    </section>

    <p v-if="error" class="state-message">{{ error }}</p>

    <section class="admin-metrics">
      <article class="info-card">
        <h2>{{ isLoadingSummary ? '...' : formatPrice(summary?.totalRevenue ?? 0) }}</h2>
        <p>Facturacion acumulada</p>
      </article>
      <article class="info-card">
        <h2>{{ isLoadingSummary ? '...' : summary?.totalOrders ?? 0 }}</h2>
        <p>Ordenes totales</p>
      </article>
      <article class="info-card">
        <h2>{{ isLoadingSummary ? '...' : summary?.activeProducts ?? 0 }}</h2>
        <p>Productos activos</p>
      </article>
      <article class="info-card">
        <h2>{{ isLoadingSummary ? '...' : summary?.totalClients ?? 0 }}</h2>
        <p>Clientes registrados</p>
      </article>
    </section>

    <section class="cart-layout">
      <div class="summary-card admin-panel">
        <p class="eyebrow">Top productos</p>
        <p v-if="isLoadingSummary" class="state-message">Cargando metricas...</p>
        <div v-else-if="summary?.topProducts?.length" class="admin-list">
          <div v-for="product in summary.topProducts" :key="product.name" class="summary-row">
            <span>{{ product.name }}</span>
            <strong>{{ product.unitsSold }} vendidos</strong>
          </div>
        </div>
      </div>

      <div class="summary-card admin-panel">
        <p class="eyebrow">Stock bajo</p>
        <p v-if="isLoadingSummary" class="state-message">Cargando stock...</p>
        <div v-else-if="summary?.lowStockProducts?.length" class="admin-list">
          <div
            v-for="product in summary.lowStockProducts"
            :key="product._id"
            class="summary-row"
          >
            <span>{{ product.name }}</span>
            <strong>{{ product.stock }} u.</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="summary-card admin-orders">
      <p class="eyebrow">Ordenes recientes</p>
      <p v-if="isLoadingOrders" class="state-message">Cargando ordenes...</p>

      <div v-else class="admin-orders__table">
        <article v-for="order in orders" :key="order._id" class="order-card order-card--admin">
          <div class="summary-row">
            <span>Orden</span>
            <strong>#{{ order._id.slice(-6) }}</strong>
          </div>
          <div class="summary-row">
            <span>Cliente</span>
            <strong>{{ order.user?.firstName }} {{ order.user?.lastName }}</strong>
          </div>
          <div class="summary-row">
            <span>Total</span>
            <strong>{{ formatPrice(order.total) }}</strong>
          </div>
          <div class="summary-row">
            <span>Pago</span>
            <strong>{{ order.paymentStatus }}</strong>
          </div>

          <label class="form-field">
            <span>Estado</span>
            <select :value="order.status" @change="handleStatusChange(order._id, $event)">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </label>
        </article>
      </div>
    </section>
  </main>
</template>
