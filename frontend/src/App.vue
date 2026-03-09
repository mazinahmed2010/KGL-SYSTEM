<template>
  <div class="app-wrapper">
    <template v-if="!isLoginPage">
      <MainLayout />
    </template>
    <template v-else>
      <div class="login-wrapper">
        <router-view />
        <!-- Footer only shows on login page if you want it -->
        <!-- <Footer v-if="showFooterOnLogin" /> -->
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import MainLayout from '@/components/MainLayout.vue'
// import Footer from '@/components/Footer.vue' // Uncomment if you want footer on login

const route = useRoute()
const userStore = useUserStore()

const isLoginPage = computed(() => route.path === '/login')
const showFooterOnLogin = computed(() => false) // Set to true if you want footer on login
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

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

/* Utility Classes */
.text-center {
  text-align: center;
}

.mt-2 {
  margin-top: 10px;
}

.mt-3 {
  margin-top: 15px;
}

.mt-4 {
  margin-top: 20px;
}

.mb-2 {
  margin-bottom: 10px;
}

.mb-3 {
  margin-bottom: 15px;
}

.mb-4 {
  margin-bottom: 20px;
}

.p-2 {
  padding: 10px;
}

.p-3 {
  padding: 15px;
}

.p-4 {
  padding: 20px;
}
</style>