<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
})

const handleSubmit = async () => {
  try {
    await authStore.register(form)
    router.push('/mi-cuenta')
  } catch {
    // El mensaje ya queda guardado en el store.
  }
}
</script>

<template>
  <main class="page-shell auth-page">
    <section class="auth-card">
      <p class="eyebrow">Registro</p>
      <h1>Crear una cuenta nueva.</h1>
      <p class="auth-copy">
        El registro ya pega contra la API real y devuelve un token listo para mantener la sesion.
      </p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-grid">
          <label class="form-field">
            <span>Nombre</span>
            <input v-model="form.firstName" type="text" placeholder="Lucas" required />
          </label>

          <label class="form-field">
            <span>Apellido</span>
            <input v-model="form.lastName" type="text" placeholder="Rey" required />
          </label>
        </div>

        <label class="form-field">
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="tu@email.com" required />
        </label>

        <label class="form-field">
          <span>Telefono</span>
          <input v-model="form.phone" type="text" placeholder="Opcional" />
        </label>

        <label class="form-field">
          <span>Password</span>
          <input
            v-model="form.password"
            type="password"
            placeholder="Minimo 8 caracteres"
            minlength="8"
            required
          />
        </label>

        <p v-if="authStore.error" class="form-message form-message--error">
          {{ authStore.error }}
        </p>

        <button class="primary-button" type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="auth-switch">
        ¿Ya tenes cuenta?
        <router-link to="/login">Ingresar</router-link>
      </p>
    </section>
  </main>
</template>
