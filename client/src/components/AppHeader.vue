<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, userFullName } = storeToRefs(authStore)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <router-link class="brand-mark" to="/">FuelCore</router-link>

      <nav class="site-nav">
        <router-link to="/">Inicio</router-link>
        <router-link to="/tienda">Tienda</router-link>
        <router-link v-if="isAuthenticated" to="/mi-cuenta">Mi cuenta</router-link>
        <router-link v-else to="/login">Ingresar</router-link>
      </nav>

      <div class="site-header__actions">
        <span v-if="isAuthenticated" class="session-pill">{{ userFullName }}</span>
        <button v-if="isAuthenticated" class="ghost-button" type="button" @click="handleLogout">
          Salir
        </button>
      </div>
    </div>
  </header>
</template>
