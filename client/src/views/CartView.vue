<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'
import { getProductImage, handleProductImageError } from '../utils/productVisuals'

const router = useRouter()
const cartStore = useCartStore()
const { items, subtotal, totalItems } = storeToRefs(cartStore)
</script>

<template>
  <main class="page-shell">
    <section class="cart-layout">
      <div class="cart-list">
        <div class="section-heading">
          <p class="eyebrow">Carrito activo</p>
          <h1>Tu stack de compra, listo para cerrar la orden.</h1>
          <p class="hero-copy">
            Ajusta cantidades, revisa el mix de productos y pasa al checkout con un resumen mas
            claro y mas comercial.
          </p>
        </div>

        <p v-if="!items.length" class="state-message">
          Tu carrito esta vacio por ahora. Explora la tienda y suma productos para seguir.
        </p>

        <article v-for="item in items" :key="item.slug" class="cart-item">
          <img
            :src="getProductImage(item)"
            :alt="item.name"
            @error="handleProductImageError($event, item)"
          />

          <div class="cart-item__content">
            <div>
              <h3>{{ item.name }}</h3>
              <p class="product-card__meta">{{ formatPrice(item.price) }}</p>
              <p class="cart-item__line-total">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>

            <div class="cart-item__actions">
              <div class="quantity-selector">
                <button
                  class="ghost-button"
                  type="button"
                  @click="cartStore.updateQuantity(item.slug, item.quantity - 1)"
                >
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button
                  class="ghost-button"
                  type="button"
                  @click="cartStore.updateQuantity(item.slug, item.quantity + 1)"
                >
                  +
                </button>
              </div>

              <button class="ghost-button" type="button" @click="cartStore.removeItem(item.slug)">
                Quitar
              </button>
            </div>
          </div>
        </article>
      </div>

      <aside class="summary-card">
        <p class="eyebrow">Resumen</p>
        <h2 class="summary-card__title">Orden actual</h2>
        <div class="summary-row">
          <span>Productos</span>
          <strong>{{ totalItems }}</strong>
        </div>
        <div class="summary-row">
          <span>Subtotal</span>
          <strong>{{ formatPrice(subtotal) }}</strong>
        </div>
        <div class="summary-row">
          <span>Envio</span>
          <strong>A definir</strong>
        </div>

        <button
          class="primary-button summary-button"
          type="button"
          :disabled="!items.length"
          @click="router.push('/checkout')"
        >
          Continuar al checkout
        </button>
      </aside>
    </section>
  </main>
</template>
