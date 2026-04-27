<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const { user, userFullName } = storeToRefs(authStore)
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
  </main>
</template>
