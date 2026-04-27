import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
