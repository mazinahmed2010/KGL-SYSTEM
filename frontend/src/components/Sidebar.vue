<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h3>Quick Actions</h3>
    </div>
    
    <div class="sidebar-menu">
      <button class="sidebar-item" @click="quickAction('newProcurement')" v-if="userStore.isManager">
        <i class="fas fa-plus-circle"></i>
        <span>New Procurement</span>
      </button>
      
      <button class="sidebar-item" @click="quickAction('newSale')" v-if="userStore.isManager || userStore.isAgent">
        <i class="fas fa-cash-register"></i>
        <span>Quick Sale</span>
      </button>
      
      <button class="sidebar-item" @click="quickAction('newCredit')" v-if="userStore.isManager || userStore.isAgent">
        <i class="fas fa-credit-card"></i>
        <span>Credit Sale</span>
      </button>
      
      <button class="sidebar-item" @click="quickAction('checkStock')">
        <i class="fas fa-search"></i>
        <span>Check Stock</span>
      </button>
      
      <button class="sidebar-item" @click="quickAction('generateReport')" v-if="userStore.isManager || userStore.isDirector">
        <i class="fas fa-file-pdf"></i>
        <span>Generate Report</span>
      </button>
    </div>

    <div class="sidebar-footer">
      <div class="stock-alert" v-if="productStore.lowStockItems.length > 0" @click="router.push('/inventory')">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ productStore.lowStockItems.length }} items low stock</span>
      </div>
      
      <div class="branch-info-sidebar">
        <i class="fas fa-store"></i>
        <span>{{ userStore.userBranch }} Branch</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()
const toast = useToast()

const quickAction = (action) => {
  switch(action) {
    case 'newProcurement':
      router.push('/procurement')
      break
    case 'newSale':
      router.push('/sales')
      break
    case 'newCredit':
      router.push('/credit')
      break
    case 'checkStock':
      router.push('/inventory')
      break
    case 'generateReport':
      toast.info('Generating report...')
      // Implement report generation
      break
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 100px;
  border-left: 4px solid var(--gold);
}

.sidebar-header h3 {
  color: var(--deep-green);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--gold);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 20px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  text-align: left;
  color: var(--text-dark);
  font-size: 14px;
}

.sidebar-item:hover {
  background: var(--warm-white);
  color: var(--deep-green);
  transform: translateX(5px);
}

.sidebar-item i {
  color: var(--gold);
  width: 20px;
}

.sidebar-footer {
  border-top: 2px solid var(--border-light);
  padding-top: 15px;
}

.stock-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #fff3cd;
  color: #856404;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.stock-alert:hover {
  background: #ffe69c;
  transform: translateX(3px);
}

.stock-alert i {
  color: var(--warning);
}

.branch-info-sidebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--warm-white);
  border-radius: 8px;
  font-size: 13px;
  color: var(--deep-green);
}

@media (max-width: 1024px) {
  .sidebar {
    width: 100%;
    position: static;
  }
}
</style>