<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatters'

const router = useRouter()
const cartStore = useCartStore()
const { items, subtotal, totalItems } = storeToRefs(cartStore)
</script>

<template>
  <main class="page-shell">
    <section class="cart-layout">
      <div class="cart-list">
        <div class="section-heading">
          <p class="eyebrow">Carrito</p>
          <h1>Tu seleccion lista para el checkout.</h1>
        </div>

        <p v-if="!items.length" class="state-message">
          Tu carrito esta vacio por ahora. Explora la tienda y suma productos para seguir.
        </p>

        <article v-for="item in items" :key="item.slug" class="cart-item">
          <img :src="item.image" :alt="item.name" />

          <div class="cart-item__content">
            <div>
              <h3>{{ item.name }}</h3>
              <p class="product-card__meta">{{ formatPrice(item.price) }}</p>
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
