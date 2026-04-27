<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { createCheckoutSession } from '../services/paymentService'
import { formatPrice } from '../utils/formatters'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { items, subtotal } = storeToRefs(cartStore)
const isSubmitting = ref(false)
const error = ref('')

const form = reactive({
  fullName: authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : '',
  addressLine1: '',
  city: '',
  postalCode: '',
  country: 'Argentina',
})

const canSubmit = computed(
  () =>
    items.value.length &&
    form.fullName &&
    form.addressLine1 &&
    form.city &&
    form.postalCode &&
    form.country,
)

const handleCheckout = async () => {
  if (!authStore.token) {
    router.push('/login')
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    const { checkoutUrl } = await createCheckoutSession({
      token: authStore.token,
      items: items.value.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      shippingAddress: {
        ...form,
      },
    })

    window.location.href = checkoutUrl
  } catch (checkoutError) {
    error.value =
      checkoutError.message ??
      'No se pudo iniciar el checkout. Revisa la configuracion de Mercado Pago en el backend.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="page-shell">
    <section class="cart-layout">
      <div class="auth-card">
        <p class="eyebrow">Checkout</p>
        <h1>Base lista para integrar pagos.</h1>
        <p class="auth-copy">
          Todavia no estamos cobrando. Esta pantalla prepara los datos que despues vamos a mandar
          al backend para crear la orden y delegar el pago a Mercado Pago.
        </p>

        <form class="auth-form" @submit.prevent="handleCheckout">
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

          <p v-if="error" class="form-message form-message--error">{{ error }}</p>

          <button class="primary-button" type="submit" :disabled="!canSubmit || isSubmitting">
            {{
              isSubmitting
                ? 'Redirigiendo a Mercado Pago...'
                : 'Pagar con Mercado Pago'
            }}
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
