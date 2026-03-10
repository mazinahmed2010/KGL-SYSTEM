<template>
  <div class="app-wrapper">
    <template v-if="!isLoginPage">
      <MainLayout />
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --deep-green: #1B4D3E;
  --gold: #FFD700;
  --medium-green: #2E7D32;
  --light-green: #4CAF50;
  --warm-white: #FFF9E6;
  --dark-green: #12352A;
  --text-dark: #333333;
  --text-light: #666666;
  --border-light: #e2e8f0;
  --danger: #dc3545;
  --success: #28a745;
  --warning: #ffc107;
  --info: #17a2b8;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f7fa;
  color: var(--text-dark);
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--warm-white);
}

::-webkit-scrollbar-thumb {
  background: var(--deep-green);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--dark-green);
}
</style>