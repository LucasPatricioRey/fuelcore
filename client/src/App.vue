<template>
  <AppHeader />
  <router-view />
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import { useAuthStore } from './stores/auth'

useAuthStore().bootstrapSession()
</script>
