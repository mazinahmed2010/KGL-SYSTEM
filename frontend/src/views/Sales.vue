<template>
  <div class="sales-page">
    <!-- Page Header with Navigation Context -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <i class="fas fa-cash-register"></i> 
          Sales Terminal
        </h1>
        <div class="breadcrumb">
          <router-link to="/dashboard">Dashboard</router-link>
          <i class="fas fa-chevron-right"></i>
          <span>Sales</span>
        </div>
      </div>
      
      <div class="header-right">
        <div class="branch-indicator">
          <i class="fas fa-store"></i>
          <span>{{ userStore.userBranch }} Branch</span>
        </div>
        <div class="date-time">
          <i class="far fa-calendar-alt"></i>
          <span>{{ currentDate }}</span>
          <i class="far fa-clock"></i>
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="stats-bar">
      <div class="stat-item" @click="router.push('/inventory')">
        <span class="stat-label">Available Stock</span>
        <span class="stat-value">{{ totalAvailableStock }} kg</span>
        <i class="fas fa-boxes"></i>
      </div>
      <div class="stat-item" @click="router.push('/credit')">
        <span class="stat-label">Credit Sales Today</span>
        <span class="stat-value">UGX 450,000</span>
        <i class="fas fa-credit-card"></i>
      </div>
      <div class="stat-item" @click="router.push('/dashboard')">
        <span class="stat-label">Today's Revenue</span>
        <span class="stat-value">UGX 1,250,000</span>
        <i class="fas fa-chart-line"></i>
      </div>
      <div class="stat-item" @click="router.push('/procurement')" v-if="userStore.isManager">
        <span class="stat-label">Low Stock Items</span>
        <span class="stat-value">{{ productStore.lowStockItems.length }}</span>
        <i class="fas fa-exclamation-triangle"></i>
      </div>
    </div>

    <!-- Main Sales Layout -->
    <div class="sales-layout">
      <!-- Left Column - Product Selection -->
      <div class="products-section">
        <div class="section-header">
          <h2><i class="fas fa-box"></i> Select Product</h2>
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="productSearch" 
              placeholder="Search products..."
            >
          </div>
        </div>

        <!-- Product Categories -->
        <div class="category-tabs">
          <button 
            v-for="category in categories" 
            :key="category"
            class="category-tab"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" v-if="filteredProducts.length > 0">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="product-card"
            :class="{ 
              selected: selectedProduct?.id === product.id,
              'low-stock': product.tonnage < 1000 && product.tonnage > 0,
              'out-of-stock': product.tonnage === 0
            }"
            @click="selectProduct(product)"
          >
            <div class="product-badge" v-if="product.tonnage < 1000 && product.tonnage > 0">
              Low Stock
            </div>
            <div class="product-badge danger" v-if="product.tonnage === 0">
              Out of Stock
            </div>
            
            <div class="product-icon">
              <i :class="getProductIcon(product.type)"></i>
            </div>
            
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-type">{{ product.type }}</p>
              <p class="product-price">UGX {{ formatNumber(product.price) }}/kg</p>
              <div class="stock-indicator">
                <div class="stock-bar">
                  <div 
                    class="stock-fill" 
                    :style="{ width: getStockPercentage(product) + '%' }"
                    :class="{
                      'healthy': product.tonnage >= 5000,
                      'warning': product.tonnage < 5000 && product.tonnage >= 1000,
                      'critical': product.tonnage < 1000 && product.tonnage > 0
                    }"
                  ></div>
                </div>
                <span class="stock-text">{{ product.tonnage }} kg available</span>
              </div>
            </div>
            
            <div class="select-indicator" v-if="selectedProduct?.id === product.id">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
        </div>

        <div v-else class="no-products">
          <i class="fas fa-box-open"></i>
          <p>No products found in this category</p>
          <router-link to="/procurement" v-if="userStore.isManager" class="btn-link">
            Add new products in Procurement
          </router-link>
        </div>

        <!-- Navigation to Inventory -->
        <div class="section-footer">
          <router-link to="/inventory" class="nav-link">
            <i class="fas fa-warehouse"></i> View Full Inventory
          </router-link>
          <router-link to="/procurement" class="nav-link" v-if="userStore.isManager">
            <i class="fas fa-plus-circle"></i> Add New Stock
          </router-link>
        </div>
      </div>

      <!-- Right Column - Sales Form -->
      <div class="form-section">
        <div class="section-header">
          <h2><i class="fas fa-shopping-cart"></i> New Sale</h2>
          <span class="sale-counter">Sale #{{ saleCounter }}</span>
        </div>

        <div v-if="!selectedProduct" class="no-selection">
          <i class="fas fa-hand-pointer"></i>
          <p>Select a product from the left to begin</p>
        </div>

        <form v-else @submit.prevent="processSale" class="sales-form">
          <!-- Selected Product Summary -->
          <div class="selected-product-summary">
            <div class="product-detail">
              <span class="detail-label">Product</span>
              <span class="detail-value">{{ selectedProduct.name }}</span>
            </div>
            <div class="product-detail">
              <span class="detail-label">Price</span>
              <span class="detail-value price">UGX {{ formatNumber(selectedProduct.price) }}/kg</span>
            </div>
            <div class="product-detail">
              <span class="detail-label">Available</span>
              <span class="detail-value" :class="{ 'critical-text': selectedProduct.tonnage < 1000 }">
                {{ selectedProduct.tonnage }} kg
              </span>
            </div>
          </div>

          <!-- Quantity Input -->
          <div class="form-group">
            <label>
              <i class="fas fa-weight"></i>
              Quantity (kg) <span class="required">*</span>
            </label>
            <div class="quantity-input">
              <button 
                type="button" 
                class="qty-btn" 
                @click="decrementQuantity"
                :disabled="saleData.quantity <= 1"
              >
                <i class="fas fa-minus"></i>
              </button>
              <input 
                type="number" 
                v-model.number="saleData.quantity" 
                min="1" 
                :max="selectedProduct.tonnage"
                required
                @input="calculateTotal"
              >
              <button 
                type="button" 
                class="qty-btn" 
                @click="incrementQuantity"
                :disabled="saleData.quantity >= selectedProduct.tonnage"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="quick-select">
              <button type="button" @click="setQuantity(50)">50kg</button>
              <button type="button" @click="setQuantity(100)">100kg</button>
              <button type="button" @click="setQuantity(500)">500kg</button>
              <button type="button" @click="setQuantity(1000)">1000kg</button>
              <button type="button" @click="setQuantity(selectedProduct.tonnage)">Max</button>
            </div>
          </div>

          <!-- Amount Display -->
          <div class="amount-display">
            <span class="amount-label">Total Amount</span>
            <span class="amount-value">UGX {{ formatNumber(saleData.totalAmount) }}</span>
          </div>

          <!-- Buyer Information -->
          <div class="form-row">
            <div class="form-group">
              <label>
                <i class="fas fa-user"></i>
                Buyer Name <span class="required">*</span>
              </label>
              <input 
                type="text" 
                v-model="saleData.buyerName" 
                placeholder="Enter buyer name"
                required
                minlength="2"
              >
            </div>

            <div class="form-group">
              <label>
                <i class="fas fa-phone"></i>
                Phone (Optional)
              </label>
              <input 
                type="tel" 
                v-model="saleData.buyerPhone" 
                placeholder="0772 123 456"
              >
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label>
              <i class="fas fa-credit-card"></i>
              Payment Method
            </label>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" v-model="saleData.paymentMethod" value="cash">
                <i class="fas fa-money-bill-wave"></i>
                <span>Cash</span>
              </label>
              <label class="payment-option">
                <input type="radio" v-model="saleData.paymentMethod" value="mobile">
                <i class="fas fa-mobile-alt"></i>
                <span>Mobile Money</span>
              </label>
              <label class="payment-option">
                <input type="radio" v-model="saleData.paymentMethod" value="bank">
                <i class="fas fa-university"></i>
                <span>Bank Transfer</span>
              </label>
            </div>
          </div>

          <!-- Customer Type -->
          <div class="form-group">
            <label>
              <i class="fas fa-tag"></i>
              Customer Type
            </label>
            <div class="customer-type">
              <label class="type-option">
                <input type="radio" v-model="saleData.customerType" value="regular">
                <span>Regular Customer</span>
              </label>
              <label class="type-option">
                <input type="radio" v-model="saleData.customerType" value="new">
                <span>New Customer</span>
              </label>
              <label class="type-option">
                <input type="radio" v-model="saleData.customerType" value="wholesale">
                <span>Wholesale Buyer</span>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="!isFormValid || isProcessing"
            >
              <span v-if="isProcessing" class="spinner"></span>
              <template v-else>
                <i class="fas fa-check-circle"></i>
                Complete Sale
              </template>
            </button>
            
            <button 
              type="button" 
              class="btn-secondary"
              @click="resetForm"
              :disabled="isProcessing"
            >
              <i class="fas fa-redo-alt"></i>
              New Sale
            </button>

            <button 
              type="button" 
              class="btn-link"
              @click="convertToCredit"
              :disabled="isProcessing"
              v-if="userStore.isManager || userStore.isAgent"
            >
              <i class="fas fa-credit-card"></i>
              Sell on Credit
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>
        </form>

        <!-- Recent Sales -->
        <div class="recent-sales">
          <div class="section-header">
            <h3><i class="fas fa-history"></i> Recent Transactions</h3>
            <router-link to="/dashboard" class="view-all">
              View Dashboard <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
          
          <div class="transactions-list">
            <div v-for="sale in recentTransactions" :key="sale.id" class="transaction-item">
              <div class="transaction-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="transaction-details">
                <span class="transaction-product">{{ sale.product }}</span>
                <span class="transaction-buyer">{{ sale.buyer }}</span>
              </div>
              <div class="transaction-amount">{{ sale.amount }}</div>
              <span class="transaction-time">{{ sale.time }}</span>
            </div>
            
            <div v-if="recentTransactions.length === 0" class="no-transactions">
              <p>No recent sales</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Bar -->
    <div class="quick-actions-bar">
      <router-link to="/dashboard" class="action-chip">
        <i class="fas fa-chart-line"></i>
        Dashboard
      </router-link>
      <router-link to="/inventory" class="action-chip">
        <i class="fas fa-warehouse"></i>
        Inventory
      </router-link>
      <router-link to="/credit" class="action-chip" v-if="userStore.isManager || userStore.isAgent">
        <i class="fas fa-credit-card"></i>
        Credit Sales
      </router-link>
      <router-link to="/procurement" class="action-chip" v-if="userStore.isManager">
        <i class="fas fa-truck-loading"></i>
        Procurement
      </router-link>
      <router-link to="/director" class="action-chip" v-if="userStore.isDirector">
        <i class="fas fa-chart-pie"></i>
        Executive View
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()
const toast = useToast()

// State
const selectedProduct = ref(null)
const productSearch = ref('')
const selectedCategory = ref('All')
const isProcessing = ref(false)
const errorMessage = ref('')
const saleCounter = ref(1001)

// Form Data
const saleData = reactive({
  quantity: 1,
  totalAmount: 0,
  buyerName: '',
  buyerPhone: '',
  paymentMethod: 'cash',
  customerType: 'regular'
})

// Categories
const categories = ['All', 'Beans', 'Grain Maize', 'Cow peas', 'G-nuts', 'Soybeans']

// Computed
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

const totalAvailableStock = computed(() => {
  return productStore.products.reduce((sum, p) => sum + p.tonnage, 0)
})

const filteredProducts = computed(() => {
  let filtered = productStore.products

  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(p => p.type === selectedCategory.value)
  }

  // Filter by search
  if (productSearch.value) {
    const search = productSearch.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.type.toLowerCase().includes(search)
    )
  }

  return filtered
})

const isFormValid = computed(() => {
  return selectedProduct.value &&
         saleData.quantity > 0 &&
         saleData.quantity <= selectedProduct.value.tonnage &&
         saleData.buyerName?.length >= 2
})

const recentTransactions = computed(() => {
  return [
    { id: 1, product: 'Beans', buyer: 'John Doe', amount: 'UGX 450,000', time: '10:30 AM' },
    { id: 2, product: 'Maize', buyer: 'Farmers Ltd', amount: 'UGX 1,200,000', time: '09:15 AM' },
    { id: 3, product: 'Cow peas', buyer: 'Jane Smith', amount: 'UGX 280,000', time: 'Yesterday' },
  ]
})

// Methods
const getProductIcon = (type) => {
  const icons = {
    'Beans': 'fas fa-seedling',
    'Grain Maize': 'fas fa-corn',
    'Cow peas': 'fas fa-leaf',
    'G-nuts': 'fas fa-nut',
    'Soybeans': 'fas fa-soy'
  }
  return icons[type] || 'fas fa-box'
}

const getStockPercentage = (product) => {
  return (product.tonnage / 10000) * 100 // Assuming 10000kg is max
}

const selectProduct = (product) => {
  if (product.tonnage === 0) {
    toast.warning(`${product.name} is out of stock`)
    return
  }
  selectedProduct.value = product
  saleData.quantity = 1
  saleData.totalAmount = product.price
}

const calculateTotal = () => {
  if (selectedProduct.value) {
    saleData.totalAmount = selectedProduct.value.price * saleData.quantity
  }
}

const incrementQuantity = () => {
  if (selectedProduct.value && saleData.quantity < selectedProduct.value.tonnage) {
    saleData.quantity++
    calculateTotal()
  }
}

const decrementQuantity = () => {
  if (saleData.quantity > 1) {
    saleData.quantity--
    calculateTotal()
  }
}

const setQuantity = (qty) => {
  if (selectedProduct.value) {
    saleData.quantity = Math.min(qty, selectedProduct.value.tonnage)
    calculateTotal()
  }
}

const processSale = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill all required fields'
    return
  }

  isProcessing.value = true
  errorMessage.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Update local stock
    const success = productStore.updateLocalStock(
      selectedProduct.value.id,
      saleData.quantity,
      'sale'
    )

    if (success) {
      saleCounter.value++
      toast.success(`Sale completed successfully! UGX ${formatNumber(saleData.totalAmount)}`)
      
      // Reset form
      resetForm()
      
      // Refresh products
      productStore.fetchProducts()
    } else {
      throw new Error('Failed to update stock')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to process sale'
    toast.error(errorMessage.value)
  } finally {
    isProcessing.value = false
  }
}

const resetForm = () => {
  selectedProduct.value = null
  saleData.quantity = 1
  saleData.totalAmount = 0
  saleData.buyerName = ''
  saleData.buyerPhone = ''
  saleData.paymentMethod = 'cash'
  saleData.customerType = 'regular'
  errorMessage.value = ''
}

const convertToCredit = () => {
  if (!selectedProduct.value) {
    toast.warning('Please select a product first')
    return
  }
  
  // Navigate to credit page with pre-filled data
  router.push({
    path: '/credit',
    query: {
      product: selectedProduct.value.id,
      quantity: saleData.quantity,
      buyer: saleData.buyerName
    }
  })
}

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}

// Lifecycle
onMounted(() => {
  productStore.initializeSampleData()
  
  // Auto-refresh every 30 seconds
  const interval = setInterval(() => {
    productStore.fetchProducts()
  }, 30000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.sales-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.header-left h1 {
  font-size: 28px;
  color: var(--deep-green);
  margin-bottom: 5px;
}

.header-left h1 i {
  color: var(--gold);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-light);
}

.breadcrumb a {
  color: var(--deep-green);
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: var(--gold);
}

.breadcrumb i {
  font-size: 10px;
  color: var(--gold);
}

.header-right {
  display: flex;
  gap: 20px;
}

.branch-indicator, .date-time {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: var(--warm-white);
  border-radius: 8px;
  font-size: 14px;
}

.branch-indicator i, .date-time i {
  color: var(--gold);
}

/* Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.stat-item {
  background: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.stat-item:hover {
  transform: translateY(-3px);
  border-color: var(--gold);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--deep-green);
}

.stat-item i {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  color: var(--gold);
  opacity: 0.3;
}

/* Main Layout */
.sales-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

/* Products Section */
.products-section, .form-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2, .section-header h3 {
  font-size: 18px;
  color: var(--deep-green);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header h2 i, .section-header h3 i {
  color: var(--gold);
}

.search-box {
  position: relative;
  width: 250px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.search-box input {
  width: 100%;
  padding: 8px 12px 8px 35px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: var(--gold);
  outline: none;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.category-tab {
  padding: 8px 16px;
  border: none;
  background: var(--warm-white);
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  font-size: 13px;
}

.category-tab:hover {
  background: var(--gold);
  color: var(--deep-green);
}

.category-tab.active {
  background: var(--deep-green);
  color: var(--gold);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding: 5px;
}

.product-card {
  background: var(--warm-white);
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  border: 2px solid transparent;
}

.product-card:hover {
  transform: translateY(-3px);
  border-color: var(--gold);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.product-card.selected {
  border-color: var(--gold);
  background: white;
}

.product-card.low-stock {
  border-left: 4px solid var(--warning);
}

.product-card.out-of-stock {
  opacity: 0.6;
  border-left: 4px solid var(--danger);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--warning);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.product-badge.danger {
  background: var(--danger);
}

.product-icon {
  text-align: center;
  margin-bottom: 10px;
}

.product-icon i {
  font-size: 32px;
  color: var(--gold);
}

.product-info h3 {
  font-size: 16px;
  margin-bottom: 3px;
  color: var(--deep-green);
}

.product-type {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 5px;
}

.product-price {
  font-weight: 600;
  color: var(--deep-green);
  margin-bottom: 10px;
}

.stock-indicator {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stock-bar {
  height: 4px;
  background: var(--border-light);
  border-radius: 2px;
  overflow: hidden;
}

.stock-fill {
  height: 100%;
  transition: width 0.3s;
}

.stock-fill.healthy {
  background: var(--success);
}

.stock-fill.warning {
  background: var(--warning);
}

.stock-fill.critical {
  background: var(--danger);
}

.stock-text {
  font-size: 11px;
  color: var(--text-light);
}

.select-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: var(--success);
  font-size: 18px;
}

/* No Products */
.no-products {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}

.no-products i {
  font-size: 48px;
  color: var(--gold);
  margin-bottom: 15px;
  opacity: 0.5;
}

.btn-link {
  display: inline-block;
  margin-top: 15px;
  color: var(--deep-green);
  text-decoration: none;
  font-weight: 600;
}

.btn-link:hover {
  color: var(--gold);
}

/* Section Footer */
.section-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid var(--border-light);
}

.nav-link {
  color: var(--deep-green);
  text-decoration: none;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-link:hover {
  color: var(--gold);
}

/* Form Section */
.no-selection {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
}

.no-selection i {
  font-size: 48px;
  color: var(--gold);
  margin-bottom: 15px;
  opacity: 0.3;
}

.sale-counter {
  background: var(--warm-white);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--deep-green);
}

/* Selected Product Summary */
.selected-product-summary {
  background: var(--warm-white);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.product-detail {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 11px;
  color: var(--text-light);
  margin-bottom: 3px;
}

.detail-value {
  font-weight: 600;
  color: var(--deep-green);
}

.detail-value.price {
  color: var(--gold);
  font-size: 18px;
}

.critical-text {
  color: var(--danger);
}

/* Quantity Input */
.quantity-input {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-light);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
}

.qty-btn:hover:not(:disabled) {
  background: var(--gold);
  color: var(--deep-green);
  border-color: var(--gold);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input input {
  flex: 1;
  height: 40px;
  text-align: center;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

.quick-select {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.quick-select button {
  padding: 5px 10px;
  border: 1px solid var(--border-light);
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.3s;
}

.quick-select button:hover {
  background: var(--gold);
  color: var(--deep-green);
  border-color: var(--gold);
}

/* Amount Display */
.amount-display {
  background: linear-gradient(135deg, var(--deep-green), var(--dark-green));
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-label {
  color: var(--gold);
  font-size: 14px;
}

.amount-value {
  color: var(--gold);
  font-size: 24px;
  font-weight: bold;
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* Payment Options */
.payment-options {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.payment-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: var(--gold);
}

.payment-option input[type="radio"] {
  width: auto;
  margin-right: 5px;
}

.payment-option i {
  color: var(--gold);
  font-size: 16px;
}

/* Customer Type */
.customer-type {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn-primary {
  flex: 2;
  background: var(--deep-green);
  color: var(--gold);
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  flex: 1;
  background: white;
  color: var(--deep-green);
  padding: 14px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--gold);
}

.btn-link {
  background: none;
  border: none;
  color: var(--deep-green);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  padding: 0 10px;
}

.btn-link:hover {
  color: var(--gold);
}

/* Error Message */
.error-message {
  margin-top: 15px;
  padding: 10px;
  background: #f8d7da;
  color: var(--danger);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

/* Recent Sales */
.recent-sales {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 2px solid var(--border-light);
}

.transactions-list {
  margin-top: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-bottom: 1px solid var(--border-light);
  transition: background 0.3s;
}

.transaction-item:hover {
  background: var(--warm-white);
}

.transaction-icon i {
  color: var(--success);
  font-size: 16px;
}

.transaction-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.transaction-product {
  font-weight: 600;
  font-size: 13px;
}

.transaction-buyer {
  font-size: 11px;
  color: var(--text-light);
}

.transaction-amount {
  font-weight: 600;
  color: var(--deep-green);
  margin-right: 10px;
}

.transaction-time {
  font-size: 11px;
  color: var(--text-light);
}

.no-transactions {
  text-align: center;
  padding: 20px;
  color: var(--text-light);
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

/* Quick Actions Bar */
.quick-actions-bar {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex-wrap: wrap;
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

.action-chip i {
  font-size: 14px;
}

/* Responsive */
@media (max-width: 1024px) {
  .sales-layout {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .header-right {
    flex-direction: column;
    width: 100%;
  }
  
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sales-page {
    padding: 10px;
  }
  
  .stats-bar {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .payment-options {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .quick-actions-bar {
    justify-content: center;
  }
  
  .selected-product-summary {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>