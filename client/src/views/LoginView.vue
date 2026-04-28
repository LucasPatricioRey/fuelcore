<script setup>
import { reactive, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

watchEffect(() => {
  if (authStore.isAuthenticated) {
    router.replace('/mi-cuenta')
  }
})

const handleSubmit = async () => {
  try {
    await authStore.login(form)
    router.push('/mi-cuenta')
  } catch {
    // El mensaje ya queda guardado en el store.
  }
}
</script>

<template>
  <main class="page-shell auth-page">
    <section class="auth-card auth-card--feature">
      <div class="auth-card__copy">
        <p class="eyebrow">Acceso</p>
        <h1>Entra a tu cuenta para seguir tus compras.</h1>
        <p class="auth-copy">
          Accede a tu historial de pedidos, revisa estados de pago y continua el checkout cuando lo
          necesites.
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label class="form-field">
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="tu@email.com" required />
        </label>

        <label class="form-field">
          <span>Password</span>
          <input v-model="form.password" type="password" placeholder="********" required />
        </label>

        <p v-if="authStore.error" class="form-message form-message--error">
          {{ authStore.error }}
        </p>

        <button class="primary-button auth-submit" type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Ingresando...' : 'Entrar a mi cuenta' }}
        </button>
      </form>

      <p class="auth-switch">
        Todavia no tenes cuenta?
        <router-link to="/registro">Crear cuenta</router-link>
      </p>
    </section>
  </main>
</template>
