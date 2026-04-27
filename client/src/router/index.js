import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import AccountView from '../views/AccountView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import CartView from '../views/CartView.vue'
import CheckoutCanceledView from '../views/CheckoutCanceledView.vue'
import CheckoutPendingView from '../views/CheckoutPendingView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import CheckoutSuccessView from '../views/CheckoutSuccessView.vue'
import LoginView from '../views/LoginView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import RegisterView from '../views/RegisterView.vue'
import ShopView from '../views/ShopView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/tienda',
    name: 'shop',
    component: ShopView,
  },
  {
    path: '/productos/:slug',
    name: 'product-detail',
    component: ProductDetailView,
  },
  {
    path: '/carrito',
    name: 'cart',
    component: CartView,
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/checkout/exito',
    name: 'checkout-success',
    component: CheckoutSuccessView,
  },
  {
    path: '/checkout/cancelado',
    name: 'checkout-canceled',
    component: CheckoutCanceledView,
  },
  {
    path: '/checkout/pendiente',
    name: 'checkout-pending',
    component: CheckoutPendingView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/registro',
    name: 'register',
    component: RegisterView,
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/mi-cuenta',
    name: 'account',
    component: AccountView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (authStore.token && !authStore.user) {
    await authStore.bootstrapSession()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return '/mi-cuenta'
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/mi-cuenta'
  }

  return true
})
