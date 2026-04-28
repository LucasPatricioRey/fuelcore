<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { isAdmin, isAuthenticated, userFullName } = storeToRefs(authStore)
const { totalItems } = storeToRefs(cartStore)

const utilityNotes = [
  'Envios a todo el pais',
  'Hasta 6 cuotas segun promocion',
  'Mercado Pago protegido',
]

const featuredLinks = [
  { label: 'Proteinas', to: '/tienda' },
  { label: 'Creatina', to: '/tienda' },
  { label: 'Pre entreno', to: '/tienda' },
  { label: 'Ofertas', to: '/tienda' },
]

const accountLabel = computed(() => (isAuthenticated.value ? 'Mi cuenta' : 'Ingresar'))
const accountRoute = computed(() => (isAuthenticated.value ? '/mi-cuenta' : '/login'))
const isCompact = ref(false)

const handleScroll = () => {
  isCompact.value = window.scrollY > 48
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="site-header site-header--commerce" :class="{ 'site-header--compact': isCompact }">
    <div class="promo-bar" v-show="!isCompact">
      <div class="promo-bar__inner">
        <strong>Envio gratis en AMBA desde $65.000</strong>
        <span>Precios online y promociones por tiempo limitado</span>
      </div>
    </div>

    <div class="utility-strip" v-show="!isCompact">
      <div class="utility-strip__inner">
        <div class="utility-strip__notes">
          <span v-for="note in utilityNotes" :key="note">{{ note }}</span>
        </div>

        <div class="utility-strip__account">
          <router-link :to="accountRoute">{{ accountLabel }}</router-link>
          <router-link v-if="!isAuthenticated" to="/registro">O podés registrarte</router-link>
          <span v-else class="session-pill">{{ userFullName }}</span>
          <router-link v-if="isAdmin" to="/admin">Admin</router-link>
        </div>
      </div>
    </div>

    <div class="header-main">
      <div class="header-main__inner">
        <router-link class="brand-mark brand-mark--commerce" to="/">
          <span class="brand-mark__word">FuelCore</span>
        </router-link>

        <div class="header-search">
          <router-link class="header-search__field" to="/tienda">
            ¿Qué estás buscando?
          </router-link>
          <router-link class="header-search__action" to="/tienda">⌕</router-link>
        </div>

        <div class="header-main__actions">
          <router-link class="header-account" :to="accountRoute">
            <span class="header-account__icon">◯</span>
            <span class="header-account__copy">
              <strong>{{ isAuthenticated ? 'Mi cuenta' : '¡Hola! Iniciá sesión' }}</strong>
              <small>{{ isAuthenticated ? userFullName : 'O podés registrarte' }}</small>
            </span>
          </router-link>

          <router-link class="header-icon-link" to="/carrito">
            <span class="header-icon-link__label">🛒</span>
            <strong>{{ totalItems }}</strong>
          </router-link>

          <router-link v-if="isAdmin" class="header-icon-link" to="/admin">Admin</router-link>

          <button v-if="isAuthenticated && !isCompact" class="ghost-button header-logout" type="button" @click="handleLogout">
            Salir
          </button>
        </div>
      </div>
    </div>

    <nav class="catalog-nav">
      <div class="catalog-nav__inner">
        <router-link class="catalog-nav__categories" to="/tienda">☰ Categorías</router-link>
        <router-link to="/">Inicio</router-link>
        <router-link to="/tienda">Marcas</router-link>
        <router-link v-for="link in featuredLinks" :key="link.label" :to="link.to">
          {{ link.label }}
        </router-link>
        <router-link to="/tienda">Accesorios</router-link>
      </div>
    </nav>
  </header>
</template>
