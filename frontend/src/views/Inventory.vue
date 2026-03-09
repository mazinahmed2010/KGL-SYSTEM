<template>
  <div class="inventory-container">
    <Navbar />
    
    <div class="card">
      <h1><i class="fas fa-warehouse"></i> Inventory Management - {{ userStore.branch }} Branch</h1>
      
      <div v-if="productStore.loading" class="loading-state">
        <LoadingSpinner text="Loading inventory..." />
      </div>
      
      <div v-else>
        <div class="stats-grid">
          <div class="stat-card">
            <i class="fas fa-dollar-sign"></i>
            <h3>Total Stock Value</h3>
            <div class="value">UGX {{ formatNumber(productStore.totalInventoryValue) }}</div>
          </div>
          <div class="stat-card">
            <i class="fas fa-weight"></i>
            <h3>Total Stock</h3>
            <div class="value">{{ formatNumber(productStore.totalTonnage) }} kg</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="filters">
          <button 
            class="filter-btn" 
            :class="{ active: filter === 'all' }"
            @click="filter = 'all'"
          >
            All ({{ productStore.products.length }})
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: filter === 'in-stock' }"
            @click="filter = 'in-stock'"
          >
            In Stock ({{ productStore.inStock.length }})
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: filter === 'low-stock' }"
            @click="filter = 'low-stock'"
          >
            Low Stock ({{ productStore.lowStockItems.length }})
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: filter === 'out-of-stock' }"
            @click="filter = 'out-of-stock'"
          >
            Out of Stock ({{ productStore.outOfStock.length }})
          </button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Produce</th>
                <th>Type</th>
                <th>Stock (kg)</th>
                <th>Price/kg</th>
                <th>Total Value</th>
                <th>Status</th>
                <th v-if="userStore.isManager">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredProducts" :key="item.id">
                <td>#{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.type }}</td>
                <td :class="{ 'text-danger': item.tonnage < 1000 }">
                  {{ formatNumber(item.tonnage) }}
                </td>
                <td>UGX {{ formatNumber(item.price) }}</td>
                <td>UGX {{ formatNumber(item.tonnage * item.price) }}</td>
                <td>
                  <span v-if="item.tonnage <= 0" class="badge badge-danger">Out of Stock</span>
                  <span v-else-if="item.tonnage < 1000" class="badge badge-warning">Low Stock</span>
                  <span v-else class="badge badge-success">In Stock</span>
                </td>
                <td v-if="userStore.isManager">
                  <button class="btn-icon" @click="openRestockModal(item)" title="Restock">
                    <i class="fas fa-plus-circle"></i>
                  </button>
                  <button class="btn-icon" @click="openAdjustModal(item)" title="Adjust Price">
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td :colspan="userStore.isManager ? 8 : 7" class="text-center">
                  No products found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Restock Modal -->
    <div v-if="showRestockModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content">
        <h3><i class="fas fa-plus-circle"></i> Restock {{ selectedProduct?.name }}</h3>
        <form @submit.prevent="handleRestock">
          <div class="form-group">
            <label>Current Stock</label>
            <input :value="selectedProduct?.tonnage + ' kg'" readonly class="readonly-field">
          </div>
          <div class="form-group">
            <label>Quantity to Add (kg) *</label>
            <input 
              v-model.number="restockQuantity" 
              type="number" 
              min="1000"
              required
            >
            <small>Minimum: 1000kg</small>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn">Add Stock</button>
            <button type="button" class="btn btn-secondary" @click="closeModals">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Adjust Price Modal -->
    <div v-if="showPriceModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content">
        <h3><i class="fas fa-edit"></i> Adjust Price - {{ selectedProduct?.name }}</h3>
        <form @submit.prevent="handlePriceAdjust">
          <div class="form-group">
            <label>Current Price</label>
            <input :value="'UGX ' + formatNumber(selectedProduct?.price) + '/kg'" readonly class="readonly-field">
          </div>
          <div class="form-group">
            <label>New Price (UGX/kg) *</label>
            <input 
              v-model.number="newPrice" 
              type="number" 
              min="1000"
              required
            >
          </div>
          <div class="form-actions">
            <button type="submit" class="btn">Update Price</button>
            <button type="button" class="btn btn-secondary" @click="closeModals">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'
import Navbar from '@/components/Navbar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const productStore = useProductStore()
const toast = useToast()

const filter = ref('all')
const showRestockModal = ref(false)
const showPriceModal = ref(false)
const selectedProduct = ref(null)
const restockQuantity = ref(1000)
const newPrice = ref(0)

const filteredProducts = computed(() => {
  switch(filter.value) {
    case 'in-stock':
      return productStore.inStock
    case 'low-stock':
      return productStore.lowStockItems
    case 'out-of-stock':
      return productStore.outOfStock
    default:
      return productStore.products
  }
})

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}

const openRestockModal = (product) => {
  selectedProduct.value = product
  showRestockModal.value = true
}

const openAdjustModal = (product) => {
  selectedProduct.value = product
  newPrice.value = product.price
  showPriceModal.value = true
}

const closeModals = () => {
  showRestockModal.value = false
  showPriceModal.value = false
  selectedProduct.value = null
  restockQuantity.value = 1000
  newPrice.value = 0
}

const handleRestock = () => {
  if (restockQuantity.value < 1000) {
    toast.warning('Minimum restock quantity is 1000kg')
    return
  }
  
  productStore.updateLocalStock(
    selectedProduct.value.id,
    restockQuantity.value,
    'procurement'
  )
  
  toast.success(`Added ${restockQuantity.value}kg of ${selectedProduct.value.name}`)
  closeModals()
}

const handlePriceAdjust = () => {
  if (newPrice.value < 1000) {
    toast.warning('Minimum price is 1000 UGX/kg')
    return
  }
  
  const product = productStore.products.find(p => p.id === selectedProduct.value.id)
  if (product) {
    product.price = newPrice.value
    toast.success(`Price updated to UGX ${formatNumber(newPrice.value)}/kg`)
  }
  
  closeModals()
}

onMounted(() => {
  productStore.initializeSampleData()
})
</script>

<style scoped>
.inventory-container {
  min-height: 100vh;
}

.loading-state {
  text-align: center;
  padding: 60px;
}

.filters {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid var(--border-light);
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: var(--gold);
}

.filter-btn.active {
  background: var(--deep-green);
  color: var(--gold);
  border-color: var(--deep-green);
}

.text-danger {
  color: var(--danger);
  font-weight: 600;
}

.btn-icon {
  background: none;
  border: none;
  color: var(--deep-green);
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  margin: 0 5px;
  transition: color 0.3s;
}

.btn-icon:hover {
  color: var(--gold);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  border-top: 4px solid var(--gold);
}

.modal-content h3 {
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-content h3 i {
  color: var(--gold);
}

.readonly-field {
  background: var(--warm-white);
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.text-center {
  text-align: center;
  color: var(--text-light);
  padding: 20px;
}
</style>