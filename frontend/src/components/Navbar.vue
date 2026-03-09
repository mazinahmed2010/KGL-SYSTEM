<template>
  <nav class="navbar">
    <div class="logo">
      <img src="/KGL-LOGO.png" alt="KGL Logo" class="logo-img">
      <div class="logo-text">
        <span class="logo-main">KARIBU</span>
        <span class="logo-sub">GROCERIES LTD</span>
      </div>
    </div>
    
    <div class="nav-links">
      <router-link to="/dashboard" v-if="userStore.isManager || userStore.isDirector">
        <i class="fas fa-chart-line"></i> Dashboard
      </router-link>
      <router-link to="/procurement" v-if="userStore.isManager">
        <i class="fas fa-truck-loading"></i> Procurement
      </router-link>
      <router-link to="/sales" v-if="userStore.isManager || userStore.isAgent">
        <i class="fas fa-cash-register"></i> Sales
      </router-link>
      <router-link to="/credit" v-if="userStore.isManager || userStore.isAgent">
        <i class="fas fa-credit-card"></i> Credit
      </router-link>
      <router-link to="/inventory" v-if="userStore.isManager || userStore.isDirector">
        <i class="fas fa-warehouse"></i> Inventory
      </router-link>
      <router-link to="/director" v-if="userStore.isDirector">
        <i class="fas fa-chart-pie"></i> Director
      </router-link>
    </div>

    <div class="user-info">
      <div class="branch-selector" v-if="!userStore.isDirector">
        <i class="fas fa-map-marker-alt"></i>
        <select v-model="userStore.userBranch">
          <option value="Maganjo">Maganjo</option>
          <option value="Matugga">Matugga</option>
        </select>
      </div>
      
      <span class="user-email">
        <i class="fas fa-user-circle"></i>
        {{ userStore.userEmail || userStore.userName }}
      </span>
      
      <button @click="handleLogout" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const handleLogout = () => {
  userStore.logout()
  toast.success('Logged out successfully')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid var(--gold);
  margin-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  height: 60px;
}

.logo-main {
  font-size: 20px;
  font-weight: bold;
  color: var(--deep-green);
}

.logo-sub {
  font-size: 10px;
  color: var(--gold);
  display: block;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: var(--text-dark);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-links a:hover {
  background: var(--deep-green);
  color: var(--gold);
}

.nav-links a.router-link-exact-active {
  background: var(--deep-green);
  color: var(--gold);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.branch-selector {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--warm-white);
  padding: 5px 10px;
  border-radius: 5px;
}

.branch-selector select {
  border: none;
  background: transparent;
  color: var(--deep-green);
  font-weight: 600;
}

.user-email {
  color: var(--deep-green);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.logout-btn {
  background: var(--danger);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
}
</style>