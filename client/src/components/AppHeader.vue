<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import logoFuelCore from '../assets/logo-fuelcore.png'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { isAdmin, isAuthenticated, userFullName } = storeToRefs(authStore)
const { totalItems } = storeToRefs(cartStore)

const utilityNotes = [
  'Envios a todo el pais',
  'Hasta 6 cuotas segun promocion',
  'Mercado Pago protegido',
]

const navigationLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Suplementos', to: '/tienda' },
  { label: 'Proteinas', to: '/tienda' },
  { label: 'Creatina', to: '/tienda' },
  { label: 'Pre entreno', to: '/tienda' },
  { label: 'Combos', to: '/tienda' },
]

const accountLabel = computed(() => (isAuthenticated.value ? 'Mi cuenta' : 'Ingresar'))
const accountRoute = computed(() => (isAuthenticated.value ? '/mi-cuenta' : '/login'))
const accountSubtitle = computed(() =>
  isAuthenticated.value ? userFullName.value : 'O crea tu cuenta',
)
const searchTerm = ref('')
const isMobileViewport = ref(false)
const isMobileMenuOpen = ref(false)

const isCompact = ref(false)
const compactEnterOffset = 320
const compactExitOffset = 36

const updateViewportState = () => {
  const nextIsMobile = window.innerWidth <= 980
  isMobileViewport.value = nextIsMobile

  if (nextIsMobile) {
    isCompact.value = false
  } else {
    isMobileMenuOpen.value = false
  }
}

const handleScroll = () => {
  if (isMobileViewport.value) {
    isCompact.value = false
    return
  }

  const currentScroll = window.scrollY

  if (!isCompact.value && currentScroll > compactEnterOffset) {
    isCompact.value = true
    return
  }

  if (isCompact.value && currentScroll < compactExitOffset) {
    isCompact.value = false
  }
}

onMounted(() => {
  updateViewportState()
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', updateViewportState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateViewportState)
})

watch(
  () => route.query.q,
  (value) => {
    searchTerm.value = typeof value === 'string' ? value : ''
  },
  { immediate: true },
)

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
  },
)

const submitSearch = () => {
  const trimmed = searchTerm.value.trim()
  router.push({
    path: '/tienda',
    query: trimmed ? { q: trimmed } : {},
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="site-header site-header--commerce" :class="{ 'site-header--compact': isCompact }">
    <div class="site-header__top">
      <div class="promo-bar">
        <div class="promo-bar__inner">
          <strong>ENVIO GRATIS A CABA Y GBA DESDE $65.000 / RESTO $85.000</strong>
          <span>Promociones online y stock actualizado</span>
        </div>
      </div>

      <div class="utility-strip">
        <div class="utility-strip__inner">
          <div class="utility-strip__notes">
            <span v-for="note in utilityNotes" :key="note">{{ note }}</span>
          </div>

          <div class="utility-strip__account">
            <router-link :to="accountRoute">{{ accountLabel }}</router-link>
            <router-link v-if="!isAuthenticated" to="/registro">Registrate</router-link>
            <span v-else class="session-pill">{{ userFullName }}</span>
            <router-link v-if="isAdmin" to="/admin">Admin</router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="header-main">
      <div class="header-main__inner">
        <router-link class="brand-mark brand-mark--commerce" to="/">
          <img :src="logoFuelCore" alt="FuelCore" />
        </router-link>

        <form class="header-search" @submit.prevent="submitSearch">
          <input
            v-model="searchTerm"
            class="header-search__field"
            type="text"
            placeholder="Que estas buscando?"
          />
          <button class="header-search__action" type="submit" aria-label="Buscar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.44 4.44 1.41-1.41-4.44-4.44A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
              />
            </svg>
          </button>
        </form>

        <div class="header-main__actions">
          <router-link class="header-account" :to="accountRoute">
            <span class="header-account__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.3 0-7.5 2.2-8.5 5.5h2.2c.9-2.1 3.2-3.5 6.3-3.5s5.4 1.4 6.3 3.5h2.2c-1-3.3-4.2-5.5-8.5-5.5Z"
                />
              </svg>
            </span>
            <span class="header-account__copy">
              <strong>{{ isAuthenticated ? 'Mi cuenta' : 'Hola! Inicia sesion' }}</strong>
              <small>{{ accountSubtitle }}</small>
            </span>
          </router-link>

          <router-link class="header-cart" to="/carrito">
            <span class="header-cart__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M7 5H4v2h1.2l1.8 8.1A2 2 0 0 0 9 17h8v-2H9l-.2-.9h8.6a2 2 0 0 0 1.94-1.5L21 8H8.3L8 6.7A2 2 0 0 0 6.05 5H7Zm2.5 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                />
              </svg>
            </span>
            <span class="header-cart__copy">
              <strong>Carrito</strong>
              <small>{{ totalItems }} producto{{ totalItems === 1 ? '' : 's' }}</small>
            </span>
            <span class="header-cart__count">{{ totalItems }}</span>
          </router-link>

          <button
            v-if="isAuthenticated"
            class="ghost-button header-logout"
            type="button"
            @click="handleLogout"
          >
            Salir
          </button>
        </div>

        <button
          class="mobile-nav-toggle"
          type="button"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-label="Abrir navegacion"
          @click="toggleMobileMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <nav class="catalog-nav" :class="{ 'catalog-nav--open': isMobileMenuOpen }">
      <div class="catalog-nav__inner">
        <router-link class="catalog-nav__categories" to="/tienda">Categorias</router-link>
        <router-link v-for="link in navigationLinks" :key="link.label" :to="link.to">
          {{ link.label }}
        </router-link>
      </div>
    </nav>
  </header>
</template>
