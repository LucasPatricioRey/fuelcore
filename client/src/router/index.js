import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import AccountView from '../views/AccountView.vue'
import LoginView from '../views/LoginView.vue'
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

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/mi-cuenta'
  }

  return true
})
