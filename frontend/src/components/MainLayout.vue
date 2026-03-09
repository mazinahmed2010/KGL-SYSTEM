<template>
  <div class="app-layout">
    <!-- Left Sidebar Navigation -->
    <aside class="sidebar-nav" :class="{ collapsed: isSidebarCollapsed }">
      <!-- Logo Area -->
      <div class="sidebar-header">
        <router-link to="/dashboard" class="logo-link">
          <img src="/KGL-LOGO.png" alt="KGL Logo" class="logo-img">
          <span class="logo-text" v-if="!isSidebarCollapsed"></span>
        </router-link>
        <button class="collapse-btn" @click="toggleSidebar">
          <i class="fas" :class="isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>

      <!-- User Info -->
      <div class="user-info-sidebar" v-if="userStore.isLoggedIn">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-details" v-if="!isSidebarCollapsed">
          <span class="user-name">{{ userStore.userName }}</span>
          <span class="user-role" :class="userStore.userRole?.toLowerCase()">{{ userStore.userRole }}</span>
        </div>
      </div>

      <!-- Branch Selector -->
      <div class="branch-selector-sidebar" v-if="userStore.isLoggedIn && !userStore.isDirector && !isSidebarCollapsed">
        <i class="fas fa-map-marker-alt"></i>
        <select v-model="branch" @change="changeBranch">
          <option value="Maganjo">Maganjo Branch</option>
          <option value="Matugga">Matugga Branch</option>
        </select>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-menu">
        <router-link to="/dashboard" class="menu-item" active-class="active" v-if="userStore.isManager || userStore.isDirector">
          <i class="fas fa-chart-line"></i>
          <span v-if="!isSidebarCollapsed">Dashboard</span>
        </router-link>
        
        <router-link to="/procurement" class="menu-item" active-class="active" v-if="userStore.isManager">
          <i class="fas fa-truck-loading"></i>
          <span v-if="!isSidebarCollapsed">Procurement</span>
        </router-link>
        
        <router-link to="/sales" class="menu-item" active-class="active" v-if="userStore.isManager || userStore.isAgent">
          <i class="fas fa-cash-register"></i>
          <span v-if="!isSidebarCollapsed">Sales</span>
        </router-link>
        
        <router-link to="/credit" class="menu-item" active-class="active" v-if="userStore.isManager || userStore.isAgent">
          <i class="fas fa-credit-card"></i>
          <span v-if="!isSidebarCollapsed">Credit</span>
        </router-link>
        
        <router-link to="/inventory" class="menu-item" active-class="active" v-if="userStore.isManager || userStore.isDirector">
          <i class="fas fa-warehouse"></i>
          <span v-if="!isSidebarCollapsed">Inventory</span>
        </router-link>
        
        <router-link to="/director" class="menu-item" active-class="active" v-if="userStore.isDirector">
          <i class="fas fa-chart-pie"></i>
          <span v-if="!isSidebarCollapsed">Executive</span>
        </router-link>

        <div class="menu-divider"></div>

        <router-link to="/profile" class="menu-item" active-class="active">
          <i class="fas fa-user"></i>
          <span v-if="!isSidebarCollapsed">Profile</span>
        </router-link>
        
        <router-link to="/settings" class="menu-item" active-class="active">
          <i class="fas fa-cog"></i>
          <span v-if="!isSidebarCollapsed">Settings</span>
        </router-link>
      </nav>

      <!-- Quick Stats -->
      <div class="quick-stats" v-if="!isSidebarCollapsed && userStore.isLoggedIn">
        <div class="stat-item">
          <span class="stat-label">Low Stock</span>
          <span class="stat-value warning">{{ productStore.lowStockItems.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Out of Stock</span>
          <span class="stat-value danger">{{ productStore.outOfStock.length }}</span>
        </div>
      </div>

      <!-- Logout Button -->
      <button class="logout-btn-sidebar" @click="handleLogout" v-if="userStore.isLoggedIn">
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!isSidebarCollapsed">Logout</span>
      </button>
    </aside>

    <!-- Main Content Area -->
    <div class="main-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="top-bar-left">
          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <i class="fas fa-bars"></i>
          </button>
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        
        <div class="top-bar-right">
          <div class="date-time">
            <i class="far fa-calendar-alt"></i>
            <span>{{ currentDate }}</span>
            <i class="far fa-clock"></i>
            <span>{{ currentTime }}</span>
          </div>
          
          <div class="notifications-icon" @click="showNotifications = !showNotifications">
            <i class="fas fa-bell"></i>
            <span class="notification-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer - Always visible when logged in -->
      <Footer v-if="userStore.isLoggedIn" />
    </div>

    <!-- Mobile Navigation Overlay -->
    <div class="mobile-nav-overlay" :class="{ show: showMobileMenu }" @click="closeMobileMenu">
      <div class="mobile-nav-content" @click.stop>
        <div class="mobile-nav-header">
          <img src="/KGL-LOGO.png" alt="KGL Logo" class="mobile-logo">
          <button class="close-mobile" @click="closeMobileMenu">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="mobile-user-info">
          <i class="fas fa-user-circle"></i>
          <div>
            <div class="mobile-user-name">{{ userStore.userName }}</div>
            <div class="mobile-user-role">{{ userStore.userRole }}</div>
          </div>
        </div>

        <div class="mobile-branch" v-if="!userStore.isDirector">
          <i class="fas fa-map-marker-alt"></i>
          <select v-model="branch" @change="changeBranch">
            <option value="Maganjo">Maganjo Branch</option>
            <option value="Matugga">Matugga Branch</option>
          </select>
        </div>

        <nav class="mobile-menu">
          <router-link to="/dashboard" class="mobile-menu-item" @click="closeMobileMenu" v-if="userStore.isManager || userStore.isDirector">
            <i class="fas fa-chart-line"></i> Dashboard
          </router-link>
          <router-link to="/procurement" class="mobile-menu-item" @click="closeMobileMenu" v-if="userStore.isManager">
            <i class="fas fa-truck-loading"></i> Procurement
          </router-link>
          <router-link to="/sales" class="mobile-menu-item" @click="closeMobileMenu" v-if="userStore.isManager || userStore.isAgent">
            <i class="fas fa-cash-register"></i> Sales
          </router-link>
          <router-link to="/credit" class="mobile-menu-item" @click="closeMobileMenu" v-if="userStore.isManager || userStore.isAgent">
            <i class="fas fa-credit-card"></i> Credit
          </router-link>
          <router-link to="/inventory" class="mobile-menu-item" @click="closeMobileMenu" v-if="userStore.isManager || userStore.isDirector">
            <i class="fas fa-warehouse"></i> Inventory
          </router-link>
          <router-link to="/director" class="mobile-menu-item" @click="closeMobileMenu" v-if="userStore.isDirector">
            <i class="fas fa-chart-pie"></i> Executive
          </router-link>
          <div class="mobile-divider"></div>
          <router-link to="/profile" class="mobile-menu-item" @click="closeMobileMenu">
            <i class="fas fa-user"></i> Profile
          </router-link>
          <router-link to="/settings" class="mobile-menu-item" @click="closeMobileMenu">
            <i class="fas fa-cog"></i> Settings
          </router-link>
          <button class="mobile-menu-item logout" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </div>
    </div>

    <!-- Notifications Panel -->
    <div class="notifications-panel" :class="{ show: showNotifications }" v-if="userStore.isLoggedIn">
      <div class="notifications-header">
        <h3>Notifications</h3>
        <button class="close-notifications" @click="showNotifications = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="notifications-list">
        <div v-for="item in productStore.lowStockItems" :key="item.id" class="notification-item warning">
          <i class="fas fa-exclamation-triangle"></i>
          <div class="notification-content">
            <strong>Low Stock Alert</strong>
            <p>{{ item.name }} has only {{ item.tonnage }}kg remaining</p>
          </div>
        </div>
        <div v-for="item in productStore.outOfStock" :key="item.id" class="notification-item danger">
          <i class="fas fa-times-circle"></i>
          <div class="notification-content">
            <strong>Out of Stock</strong>
            <p>{{ item.name }} needs immediate restock</p>
          </div>
        </div>
        <div v-if="productStore.lowStockItems.length === 0 && productStore.outOfStock.length === 0" class="no-notifications">
          <i class="fas fa-check-circle"></i>
          <p>All notifications clear</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'
import Footer from './Footer.vue'  // ✅ Import Footer component
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const productStore = useProductStore()
const toast = useToast()

const isSidebarCollapsed = ref(false)
const showMobileMenu = ref(false)
const showNotifications = ref(false)

const branch = computed({
  get: () => userStore.userBranch,
  set: (value) => {
    userStore.setBranch(value)
    productStore.fetchProducts()
  }
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const currentTime = computed(() => {
  return new Date().toLocaleTimeString('en-UG', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const currentPageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/procurement': 'Procurement',
    '/sales': 'Sales Terminal',
    '/credit': 'Credit Sales',
    '/inventory': 'Inventory Management',
    '/director': 'Executive Dashboard',
    '/profile': 'My Profile',
    '/settings': 'Settings'
  }
  return titles[route.path] || 'KGL Enterprise'
})

const notificationCount = computed(() => {
  return productStore.lowStockItems.length + productStore.outOfStock.length
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('sidebar-collapsed', isSidebarCollapsed.value)
}

const toggleMobileMenu = () => {
  showMobileMenu.value = true
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  toast.success('Logged out successfully')
}

const changeBranch = () => {
  productStore.fetchProducts()
  toast.info(`Switched to ${branch.value} branch`)
}

// Load sidebar state
onMounted(() => {
  const saved = localStorage.getItem('sidebar-collapsed')
  if (saved !== null) {
    isSidebarCollapsed.value = saved === 'true'
  }
  productStore.initializeSampleData()
})

// Auto-refresh time every minute
const timer = setInterval(() => {}, 60000)
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

/* Sidebar Navigation */
.sidebar-nav {
  width: 260px;
  background: linear-gradient(180deg, var(--deep-green) 0%, var(--dark-green) 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  box-shadow: 4px 0 20px rgba(0,0,0,0.1);
}

.sidebar-nav.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  overflow: hidden;
}

.logo-img {
  height: 100px;
  width: auto;
  filter:  brightness(0) saturate(100%) invert(82%) sepia(45%) saturate(1000%) hue-rotate(0deg) brightness(105%) contrast(105%);
  animation: glowPulse 3s infinite ease-in-out;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--gold);
  white-space: nowrap;
}

.collapse-btn {
  background: rgba(255, 215, 0, 0.1);
  border: none;
  color: var(--gold);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background: var(--gold);
  color: var(--deep-green);
}

.user-info-sidebar {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.user-avatar i {
  font-size: 40px;
  color: var(--gold);
}

.user-details {
  overflow: hidden;
}

.user-name {
  display: block;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}

.user-role {
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
}

.user-role.manager {
  background: var(--gold);
  color: var(--deep-green);
}

.user-role.agent {
  background: var(--gold);
  color: var(--deep-green);
}

.user-role.director {
  background: #9b59b6;
  color: white;
}

.branch-selector-sidebar {
  padding: 0 20px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.branch-selector-sidebar i {
  color: var(--gold);
  font-size: 14px;
}

.branch-selector-sidebar select {
  flex: 1;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: white;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
}

.branch-selector-sidebar select option {
  background: var(--deep-green);
  color: white;
}

.sidebar-menu {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  white-space: nowrap;
}

.menu-item i {
  width: 20px;
  color: var(--gold);
  font-size: 16px;
}

.menu-item:hover {
  background: rgba(255, 215, 0, 0.1);
  color: white;
}

.menu-item.active {
  background: var(--gold);
  color: var(--deep-green);
}

.menu-item.active i {
  color: var(--deep-green);
}

.menu-divider {
  height: 1px;
  background: rgba(255, 215, 0, 0.2);
  margin: 15px 0;
}

.quick-stats {
  padding: 20px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 3px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
}

.stat-value.warning {
  color: var(--warning);
}

.stat-value.danger {
  color: var(--danger);
}

.logout-btn-sidebar {
  margin: 20px;
  padding: 12px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #ff6b6b;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
}

.logout-btn-sidebar:hover {
  background: rgba(220, 53, 69, 0.2);
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-wrapper.sidebar-collapsed {
  margin-left: 80px;
}

/* Top Bar */
.top-bar {
  background: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--deep-green);
  cursor: pointer;
}

.page-title {
  font-size: 24px;
  color: var(--deep-green);
  margin: 0;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.date-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-light);
  font-size: 14px;
}

.date-time i {
  color: var(--gold);
}

.notifications-icon {
  position: relative;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-light);
  transition: color 0.3s;
}

.notifications-icon:hover {
  color: var(--gold);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--danger);
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 30px;
}

/* Mobile Navigation Overlay */
.mobile-nav-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 2000;
}

.mobile-nav-overlay.show {
  display: block;
}

.mobile-nav-content {
  width: 300px;
  height: 100%;
  background: white;
  overflow-y: auto;
  animation: slideIn 0.3s;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.mobile-nav-header {
  padding: 20px;
  background: var(--deep-green);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-logo {
  height: 40px;
  filter: brightness(0) invert(1);
}

.close-mobile {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.mobile-user-info {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-light);
}

.mobile-user-info i {
  font-size: 40px;
  color: var(--gold);
}

.mobile-user-name {
  font-weight: 600;
  color: var(--deep-green);
}

.mobile-user-role {
  font-size: 12px;
  color: var(--text-light);
}

.mobile-branch {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border-light);
}

.mobile-branch i {
  color: var(--gold);
}

.mobile-branch select {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-light);
  border-radius: 5px;
}

.mobile-menu {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  color: var(--text-dark);
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
}

.mobile-menu-item:hover {
  background: var(--warm-white);
}

.mobile-menu-item i {
  color: var(--gold);
  width: 20px;
}

.mobile-menu-item.logout {
  color: var(--danger);
}

.mobile-divider {
  height: 1px;
  background: var(--border-light);
  margin: 15px 0;
}

/* Notifications Panel */
.notifications-panel {
  position: fixed;
  top: 80px;
  right: -400px;
  width: 350px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 30px rgba(0,0,0,0.15);
  transition: right 0.3s ease;
  z-index: 150;
  max-height: 80vh;
  overflow-y: auto;
}

.notifications-panel.show {
  right: 20px;
}

.notifications-header {
  padding: 15px 20px;
  border-bottom: 2px solid var(--gold);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--deep-green);
  color: var(--gold);
  border-radius: 10px 10px 0 0;
}

.notifications-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-notifications {
  background: none;
  border: none;
  color: var(--gold);
  cursor: pointer;
  font-size: 16px;
}

.notifications-list {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-item {
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 4px solid;
}

.notification-item.warning {
  background: #fff3cd;
  border-left-color: var(--warning);
}

.notification-item.danger {
  background: #f8d7da;
  border-left-color: var(--danger);
}

.notification-item i {
  font-size: 18px;
}

.notification-item.warning i {
  color: var(--warning);
}

.notification-item.danger i {
  color: var(--danger);
}

.notification-content {
  flex: 1;
}

.notification-content strong {
  display: block;
  font-size: 13px;
  margin-bottom: 3px;
}

.notification-content p {
  font-size: 12px;
  color: var(--text-light);
  margin: 0;
}

.no-notifications {
  text-align: center;
  padding: 30px;
  color: var(--text-light);
}

.no-notifications i {
  font-size: 40px;
  color: var(--success);
  margin-bottom: 10px;
}

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar-nav {
    transform: translateX(-100%);
  }
  
  .sidebar-nav.collapsed {
    transform: translateX(0);
    width: 260px;
  }
  
  .main-wrapper {
    margin-left: 0 !important;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .date-time {
    display: none;
  }
  
  .notifications-panel {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .top-bar {
    padding: 15px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .content-area {
    padding: 15px;
  }
  
  .notifications-panel.show {
    right: 10px;
    left: 10px;
    width: auto;
  }
}
</style>