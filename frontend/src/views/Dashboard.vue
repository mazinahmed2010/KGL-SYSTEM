<template>
  <div class="dashboard-view">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1>Welcome back, {{ userStore.userName }}! 👋</h1>
        <p>{{ getGreeting }} at {{ userStore.userBranch }} Branch</p>
      </div>
      <div class="banner-stats">
        <div class="banner-stat">
          <span class="stat-label">Today's Sales</span>
          <span class="stat-value">UGX {{ formatNumber(1250000) }}</span>
        </div>
        <div class="banner-stat">
          <span class="stat-label">Pending Orders</span>
          <span class="stat-value">8</span>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card primary" @click="router.push('/inventory')">
        <div class="stat-icon">
          <i class="fas fa-boxes"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Stock Value</span>
          <span class="stat-value">UGX {{ formatNumber(productStore.totalInventoryValue) }}</span>
          <span class="stat-trend positive">
            <i class="fas fa-arrow-up"></i> +12.5%
          </span>
        </div>
      </div>

      <div class="stat-card success" @click="router.push('/inventory')">
        <div class="stat-icon">
          <i class="fas fa-weight"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Inventory</span>
          <span class="stat-value">{{ formatNumber(productStore.totalTonnage) }} kg</span>
          <span class="stat-desc">{{ productStore.products.length }} products</span>
        </div>
      </div>

      <div class="stat-card warning" @click="router.push('/sales')">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Today's Revenue</span>
          <span class="stat-value">UGX 2,450,000</span>
          <span class="stat-trend positive">+8.3% vs yesterday</span>
        </div>
      </div>

      <div class="stat-card info" @click="router.push('/credit')">
        <div class="stat-icon">
          <i class="fas fa-credit-card"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Credit Outstanding</span>
          <span class="stat-value">UGX 1,850,000</span>
          <span class="stat-desc">12 active accounts</span>
        </div>
      </div>
    </div>

    <!-- Alerts Section -->
    <div class="alerts-section" v-if="hasAlerts">
      <h2><i class="fas fa-bell"></i> Notifications</h2>
      <div class="alerts-grid">
        <div v-for="item in productStore.lowStockItems" :key="item.id" class="alert-card warning">
          <i class="fas fa-exclamation-triangle"></i>
          <div class="alert-content">
            <strong>{{ item.name }}</strong>
            <span>Low stock: {{ item.tonnage }}kg remaining</span>
          </div>
          <button class="alert-action" @click="quickRestock(item)">
            <i class="fas fa-plus-circle"></i> Restock
          </button>
        </div>

        <div v-for="item in productStore.outOfStock" :key="item.id" class="alert-card danger">
          <i class="fas fa-times-circle"></i>
          <div class="alert-content">
            <strong>{{ item.name }}</strong>
            <span>Out of stock - Action needed</span>
          </div>
          <button class="alert-action" @click="quickRestock(item)">
            <i class="fas fa-shopping-cart"></i> Order
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Recent Sales -->
        <div class="section-card">
          <div class="section-header">
            <h2><i class="fas fa-history"></i> Recent Sales</h2>
            <router-link to="/sales" class="view-all">View All <i class="fas fa-arrow-right"></i></router-link>
          </div>
          <div class="recent-sales-list">
            <div v-for="sale in recentSales" :key="sale.id" class="sale-item">
              <div class="sale-icon">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="sale-details">
                <span class="sale-product">{{ sale.product }}</span>
                <span class="sale-buyer">{{ sale.buyer }}</span>
              </div>
              <div class="sale-amount">{{ sale.amount }}</div>
              <span class="sale-time">{{ sale.time }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="section-card">
          <div class="section-header">
            <h2><i class="fas fa-bolt"></i> Quick Actions</h2>
          </div>
          <div class="quick-actions-grid">
            <button class="quick-action-item" @click="router.push('/procurement')" v-if="userStore.isManager">
              <i class="fas fa-truck-loading"></i>
              <span>New Procurement</span>
            </button>
            <button class="quick-action-item" @click="router.push('/sales')" v-if="userStore.isManager || userStore.isAgent">
              <i class="fas fa-cash-register"></i>
              <span>Quick Sale</span>
            </button>
            <button class="quick-action-item" @click="router.push('/credit')" v-if="userStore.isManager || userStore.isAgent">
              <i class="fas fa-credit-card"></i>
              <span>Credit Sale</span>
            </button>
            <button class="quick-action-item" @click="router.push('/inventory')">
              <i class="fas fa-warehouse"></i>
              <span>Check Stock</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Stock Overview -->
        <div class="section-card">
          <div class="section-header">
            <h2><i class="fas fa-chart-pie"></i> Stock Overview</h2>
            <router-link to="/inventory" class="view-all">Manage <i class="fas fa-arrow-right"></i></router-link>
          </div>
          
          <div class="stock-chart">
            <div class="chart-legend">
              <div class="legend-item">
                <span class="color-dot healthy"></span>
                <span>Healthy Stock ({{ productStore.inStock.length }})</span>
              </div>
              <div class="legend-item">
                <span class="color-dot warning"></span>
                <span>Low Stock ({{ productStore.lowStockItems.length }})</span>
              </div>
              <div class="legend-item">
                <span class="color-dot danger"></span>
                <span>Out of Stock ({{ productStore.outOfStock.length }})</span>
              </div>
            </div>
            <div class="stock-distribution">
              <div class="distribution-bar">
                <div class="bar-segment healthy" :style="{ width: healthyPercentage + '%' }"></div>
                <div class="bar-segment warning" :style="{ width: lowPercentage + '%' }"></div>
                <div class="bar-segment danger" :style="{ width: outPercentage + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Top Products -->
          <div class="top-products">
            <h3>Top Products</h3>
            <div v-for="product in topProducts" :key="product.id" class="product-row" @click="router.push('/inventory')">
              <span class="product-name">{{ product.name }}</span>
              <span class="product-stock">{{ product.tonnage }} kg</span>
              <span class="product-value">UGX {{ formatNumber(product.tonnage * product.price) }}</span>
            </div>
          </div>
        </div>

        <!-- Upcoming Credit Payments -->
        <div class="section-card" v-if="userStore.isManager || userStore.isAgent">
          <div class="section-header">
            <h2><i class="fas fa-clock"></i> Upcoming Payments</h2>
            <router-link to="/credit" class="view-all">View All <i class="fas fa-arrow-right"></i></router-link>
          </div>
          <div class="payment-list">
            <div v-for="payment in upcomingPayments" :key="payment.id" class="payment-item">
              <div class="payment-info">
                <strong>{{ payment.buyer }}</strong>
                <span>Due {{ payment.dueDate }}</span>
              </div>
              <div class="payment-amount">UGX {{ formatNumber(payment.amount) }}</div>
              <span class="payment-status" :class="payment.status">{{ payment.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Bar -->
    <div class="quick-actions-bar">
      <router-link to="/dashboard" class="action-chip active">
        <i class="fas fa-chart-line"></i>
        Dashboard
      </router-link>
      <router-link to="/inventory" class="action-chip">
        <i class="fas fa-warehouse"></i>
        Inventory
      </router-link>
      <router-link to="/sales" class="action-chip" v-if="userStore.isManager || userStore.isAgent">
        <i class="fas fa-cash-register"></i>
        Sales
      </router-link>
      <router-link to="/credit" class="action-chip" v-if="userStore.isManager || userStore.isAgent">
        <i class="fas fa-credit-card"></i>
        Credit
      </router-link>
      <router-link to="/procurement" class="action-chip" v-if="userStore.isManager">
        <i class="fas fa-truck-loading"></i>
        Procurement
      </router-link>
      <router-link to="/director" class="action-chip" v-if="userStore.isDirector">
        <i class="fas fa-chart-pie"></i>
        Executive
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()
const toast = useToast()

const getGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const hasAlerts = computed(() => {
  return productStore.lowStockItems.length > 0 || productStore.outOfStock.length > 0
})

const healthyPercentage = computed(() => {
  const total = productStore.products.length
  if (total === 0) return 0
  return (productStore.inStock.length / total) * 100
})

const lowPercentage = computed(() => {
  const total = productStore.products.length
  if (total === 0) return 0
  return (productStore.lowStockItems.length / total) * 100
})

const outPercentage = computed(() => {
  const total = productStore.products.length
  if (total === 0) return 0
  return (productStore.outOfStock.length / total) * 100
})

const topProducts = computed(() => {
  return [...productStore.products]
    .sort((a, b) => (b.tonnage * b.price) - (a.tonnage * a.price))
    .slice(0, 5)
})

const recentSales = computed(() => {
  return [
    { id: 1, product: 'Beans', buyer: 'John Doe', amount: 'UGX 450,000', time: '10:30 AM' },
    { id: 2, product: 'Maize', buyer: 'Farmers Ltd', amount: 'UGX 1,200,000', time: '09:15 AM' },
    { id: 3, product: 'Cow peas', buyer: 'Jane Smith', amount: 'UGX 280,000', time: 'Yesterday' },
  ]
})

const upcomingPayments = computed(() => {
  return [
    { id: 1, buyer: 'John Doe', dueDate: 'Mar 15, 2024', amount: 450000, status: 'pending' },
    { id: 2, buyer: 'Farmers Coop', dueDate: 'Mar 18, 2024', amount: 1200000, status: 'pending' },
    { id: 3, buyer: 'Jane Smith', dueDate: 'Mar 20, 2024', amount: 280000, status: 'overdue' },
  ]
})

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}

const quickRestock = (product) => {
  toast.info(`Navigate to procurement to restock ${product.name}`)
  router.push('/procurement')
}

onMounted(() => {
  productStore.initializeSampleData()
})
</script>

<style scoped>
.dashboard-view {
  padding: 20px;
}

.welcome-banner {
  background: linear-gradient(135deg, var(--deep-green), var(--dark-green));
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 25px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 5px solid var(--gold);
}

.banner-content h1 {
  font-size: 28px;
  margin-bottom: 5px;
  color: var(--gold);
}

.banner-content p {
  opacity: 0.9;
}

.banner-stats {
  display: flex;
  gap: 30px;
}

.banner-stat {
  text-align: right;
}

.banner-stat .stat-label {
  font-size: 12px;
  opacity: 0.8;
  display: block;
}

.banner-stat .stat-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--gold);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(27, 77, 62, 0.15);
}

.stat-card.primary {
  border-left-color: var(--deep-green);
}

.stat-card.success {
  border-left-color: var(--success);
}

.stat-card.warning {
  border-left-color: var(--warning);
}

.stat-card.info {
  border-left-color: var(--info);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-card.primary .stat-icon {
  background: rgba(27, 77, 62, 0.1);
  color: var(--deep-green);
}

.stat-card.success .stat-icon {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success);
}

.stat-card.warning .stat-icon {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning);
}

.stat-card.info .stat-icon {
  background: rgba(23, 162, 184, 0.1);
  color: var(--info);
}

.stat-content {
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 3px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 3px;
}

.stat-trend {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.stat-trend.positive {
  color: var(--success);
}

.stat-desc {
  font-size: 11px;
  color: var(--text-light);
}

.alerts-section {
  margin-bottom: 25px;
}

.alerts-section h2 {
  font-size: 18px;
  color: var(--deep-green);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.alerts-section h2 i {
  color: var(--gold);
}

.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.alert-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-left: 4px solid;
}

.alert-card.warning {
  border-left-color: var(--warning);
}

.alert-card.danger {
  border-left-color: var(--danger);
}

.alert-card i {
  font-size: 20px;
}

.alert-card.warning i {
  color: var(--warning);
}

.alert-card.danger i {
  color: var(--danger);
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.alert-content span {
  font-size: 12px;
  color: var(--text-light);
}

.alert-action {
  background: rgba(255,255,255,0.5);
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  transition: all 0.3s;
}

.alert-action:hover {
  background: rgba(255,255,255,0.8);
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.section-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  color: var(--deep-green);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header h2 i {
  color: var(--gold);
}

.view-all {
  color: var(--deep-green);
  text-decoration: none;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.view-all:hover {
  color: var(--gold);
}

.recent-sales-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sale-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s;
}

.sale-item:hover {
  background: var(--warm-white);
}

.sale-icon {
  width: 35px;
  height: 35px;
  background: rgba(27, 77, 62, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--deep-green);
}

.sale-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sale-product {
  font-weight: 600;
  font-size: 14px;
}

.sale-buyer {
  font-size: 11px;
  color: var(--text-light);
}

.sale-amount {
  font-weight: 600;
  color: var(--deep-green);
  margin-right: 10px;
}

.sale-time {
  font-size: 11px;
  color: var(--text-light);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: var(--warm-white);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-action-item:hover {
  background: var(--gold);
  color: var(--deep-green);
  transform: translateY(-3px);
}

.quick-action-item i {
  font-size: 24px;
  color: var(--gold);
}

.quick-action-item:hover i {
  color: var(--deep-green);
}

.quick-action-item span {
  font-size: 12px;
  font-weight: 600;
}

.stock-chart {
  margin-bottom: 20px;
}

.chart-legend {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.color-dot.healthy {
  background: var(--success);
}

.color-dot.warning {
  background: var(--warning);
}

.color-dot.danger {
  background: var(--danger);
}

.distribution-bar {
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  background: var(--border-light);
}

.bar-segment.healthy {
  background: var(--success);
}

.bar-segment.warning {
  background: var(--warning);
}

.bar-segment.danger {
  background: var(--danger);
}

.top-products {
  margin-top: 20px;
}

.top-products h3 {
  font-size: 16px;
  color: var(--deep-green);
  margin-bottom: 15px;
}

.product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.3s;
}

.product-row:hover {
  background: var(--warm-white);
  padding: 8px 10px;
}

.product-name {
  font-weight: 500;
}

.product-stock {
  color: var(--text-light);
  font-size: 13px;
}

.product-value {
  font-weight: 600;
  color: var(--deep-green);
}

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
  background: var(--warm-white);
}

.payment-info {
  display: flex;
  flex-direction: column;
}

.payment-info strong {
  font-size: 14px;
}

.payment-info span {
  font-size: 11px;
  color: var(--text-light);
}

.payment-amount {
  font-weight: 600;
  color: var(--deep-green);
}

.payment-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
}

.payment-status.pending {
  background: var(--warning);
  color: #856404;
}

.payment-status.overdue {
  background: var(--danger);
  color: white;
}

.quick-actions-bar {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex-wrap: wrap;
  margin-top: 20px;
}

.action-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background: var(--warm-white);
  border-radius: 20px;
  color: var(--deep-green);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.3s;
}

.action-chip:hover {
  background: var(--gold);
  color: var(--deep-green);
  transform: translateY(-2px);
}

.action-chip.active {
  background: var(--deep-green);
  color: var(--gold);
}

.action-chip i {
  font-size: 14px;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-banner {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .banner-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 10px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
  
  .banner-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .banner-stat {
    text-align: center;
  }
}
</style>