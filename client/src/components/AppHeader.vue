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

const isCompact = ref(false)
const compactEnterOffset = 220
const compactExitOffset = 140

const handleScroll = () => {
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
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const goToShop = () => {
  router.push('/tienda')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
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
          <span class="brand-mark__top">FuelCore</span>
          <span class="brand-mark__bottom">PERFORMANCE STORE</span>
        </router-link>

        <button class="header-search" type="button" @click="goToShop">
          <span class="header-search__field">Que estas buscando?</span>
          <span class="header-search__action">Buscar</span>
        </button>

        <div class="header-main__actions">
          <router-link class="header-account" :to="accountRoute">
            <span class="header-account__icon">MI</span>
            <span class="header-account__copy">
              <strong>{{ accountLabel }}</strong>
              <small>{{ accountSubtitle }}</small>
            </span>
          </router-link>

          <router-link class="header-cart" to="/carrito">
            <span class="header-cart__icon">Cart</span>
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
      </div>
    </div>

    <nav class="catalog-nav">
      <div class="catalog-nav__inner">
        <router-link class="catalog-nav__categories" to="/tienda">Categorias</router-link>
        <router-link v-for="link in navigationLinks" :key="link.label" :to="link.to">
          {{ link.label }}
        </router-link>
      </div>
    </nav>
  </header>
</template>
