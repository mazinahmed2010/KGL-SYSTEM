<template>
  <div class="procurement-container">
    <Navbar />
    
    <div class="card">
      <h1><i class="fas fa-truck-loading"></i> Produce Procurement</h1>
      <span class="role-badge manager">
        <i class="fas fa-lock"></i> Manager Only Access
      </span>
      
      <form @submit.prevent="submitForm" class="procurement-form">
        <div class="form-grid">
          <div class="form-group">
            <label><i class="fas fa-tag"></i> Produce Name *</label>
            <input 
              v-model="form.produceName" 
              type="text"
              placeholder="e.g., BEANS001"
              :class="{ error: errors.produceName }"
              @input="validateField('produceName')"
            >
            <div v-if="errors.produceName" class="error-message">
              {{ errors.produceName }}
            </div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-list"></i> Produce Type *</label>
            <select 
              v-model="form.produceType"
              :class="{ error: errors.produceType }"
              @change="validateField('produceType')"
            >
              <option value="">Select Type</option>
              <option v-for="type in produceTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <div v-if="errors.produceType" class="error-message">
              {{ errors.produceType }}
            </div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-weight"></i> Tonnage (kg) *</label>
            <input 
              v-model.number="form.tonnage" 
              type="number"
              placeholder="Min 1000kg"
              :class="{ error: errors.tonnage }"
              @input="validateField('tonnage')"
            >
            <div v-if="errors.tonnage" class="error-message">
              {{ errors.tonnage }}
            </div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-money-bill"></i> Cost (UGX) *</label>
            <input 
              v-model.number="form.cost" 
              type="number"
              placeholder="Min 10000"
              :class="{ error: errors.cost }"
              @input="validateField('cost')"
            >
            <div v-if="errors.cost" class="error-message">
              {{ errors.cost }}
            </div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-user"></i> Dealer Name *</label>
            <input 
              v-model="form.dealerName" 
              type="text"
              placeholder="Dealer name"
              :class="{ error: errors.dealerName }"
              @input="validateField('dealerName')"
            >
            <div v-if="errors.dealerName" class="error-message">
              {{ errors.dealerName }}
            </div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-phone"></i> Contact *</label>
            <input 
              v-model="form.contact" 
              type="tel"
              placeholder="0772123456"
              :class="{ error: errors.contact }"
              @input="validateField('contact')"
            >
            <div v-if="errors.contact" class="error-message">
              {{ errors.contact }}
            </div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-dollar-sign"></i> Selling Price (UGX/kg) *</label>
            <input 
              v-model.number="form.sellingPrice" 
              type="number"
              placeholder="Price per kg"
              :class="{ error: errors.sellingPrice }"
              @input="validateField('sellingPrice')"
            >
            <div v-if="errors.sellingPrice" class="error-message">
              {{ errors.sellingPrice }}
            </div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-calendar"></i> Date</label>
            <input v-model="form.date" type="date" readonly>
          </div>

          <div class="form-group">
            <label><i class="fas fa-clock"></i> Time</label>
            <input v-model="form.time" type="time" readonly>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn" :disabled="isSubmitting || !isFormValid">
            <span v-if="isSubmitting" class="spinner"></span>
            <i v-else class="fas fa-save"></i>
            {{ isSubmitting ? 'Saving...' : 'Record Procurement' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="resetForm">
            <i class="fas fa-undo"></i> Reset
          </button>
        </div>
      </form>
      
      <!-- Recent Procurements -->
      <div class="recent-section" v-if="recentProcurements.length > 0">
        <h2><i class="fas fa-history"></i> Recent Procurements</h2>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Produce</th>
                <th>Tonnage</th>
                <th>Cost</th>
                <th>Dealer</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recentProcurements" :key="item.id">
                <td>{{ item.date }}</td>
                <td>{{ item.produceName }}</td>
                <td>{{ item.tonnage }} kg</td>
                <td>UGX {{ formatNumber(item.cost) }}</td>
                <td>{{ item.dealerName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'
import Navbar from '@/components/Navbar.vue'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const productStore = useProductStore()
const toast = useToast()

const produceTypes = ['Beans', 'Grain Maize', 'Cow peas', 'G-nuts', 'Soybeans']

const form = reactive({
  produceName: '',
  produceType: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().split(' ')[0].substring(0,5),
  tonnage: '',
  cost: '',
  dealerName: '',
  contact: '',
  sellingPrice: ''
})

const errors = reactive({
  produceName: '',
  produceType: '',
  tonnage: '',
  cost: '',
  dealerName: '',
  contact: '',
  sellingPrice: ''
})

const isSubmitting = ref(false)
const recentProcurements = ref([])

const validateField = (field) => {
  switch(field) {
    case 'produceName':
      errors.produceName = !form.produceName ? 'Produce name is required' : ''
      break
    case 'produceType':
      errors.produceType = !form.produceType ? 'Produce type is required' : ''
      break
    case 'tonnage':
      if (!form.tonnage) {
        errors.tonnage = 'Tonnage is required'
      } else if (form.tonnage < 1000) {
        errors.tonnage = 'Minimum tonnage is 1000kg'
      } else {
        errors.tonnage = ''
      }
      break
    case 'cost':
      if (!form.cost) {
        errors.cost = 'Cost is required'
      } else if (form.cost < 10000) {
        errors.cost = 'Minimum cost is 10000 UGX'
      } else {
        errors.cost = ''
      }
      break
    case 'dealerName':
      if (!form.dealerName) {
        errors.dealerName = 'Dealer name is required'
      } else if (form.dealerName.length < 2) {
        errors.dealerName = 'Dealer name must be at least 2 characters'
      } else {
        errors.dealerName = ''
      }
      break
    case 'contact':
      const phoneRegex = /^[0-9]{10}$/
      if (!form.contact) {
        errors.contact = 'Contact is required'
      } else if (!phoneRegex.test(form.contact)) {
        errors.contact = 'Enter a valid 10-digit phone number'
      } else {
        errors.contact = ''
      }
      break
    case 'sellingPrice':
      if (!form.sellingPrice) {
        errors.sellingPrice = 'Selling price is required'
      } else if (form.sellingPrice < 1000) {
        errors.sellingPrice = 'Minimum selling price is 1000 UGX/kg'
      } else {
        errors.sellingPrice = ''
      }
      break
  }
}

const isFormValid = computed(() => {
  return Object.values(errors).every(error => !error) &&
         Object.values(form).every(value => value !== '')
})

const validateAll = () => {
  Object.keys(form).forEach(key => {
    if (key !== 'date' && key !== 'time') {
      validateField(key)
    }
  })
}

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}

const submitForm = async () => {
  validateAll()
  
  if (!isFormValid.value) {
    toast.warning('Please fix all validation errors')
    return
  }

  isSubmitting.value = true
  
  try {
    const procurementData = {
      id: Date.now(),
      ...form,
      tonnage: Number(form.tonnage),
      cost: Number(form.cost),
      sellingPrice: Number(form.sellingPrice),
      branch: userStore.branch,
      recordedBy: userStore.userName,
      timestamp: new Date().toISOString()
    }
    
    // Add to recent
    recentProcurements.value.unshift(procurementData)
    if (recentProcurements.value.length > 5) recentProcurements.value.pop()
    
    // Update inventory
    productStore.addLocalProduct({
      id: Date.now() + 1,
      name: form.produceName,
      type: form.produceType,
      tonnage: form.tonnage,
      price: form.sellingPrice
    })
    
    toast.success('Procurement recorded successfully!')
    resetForm()
  } catch (error) {
    toast.error(error.message || 'Failed to record procurement')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.produceName = ''
  form.produceType = ''
  form.tonnage = ''
  form.cost = ''
  form.dealerName = ''
  form.contact = ''
  form.sellingPrice = ''
  form.date = new Date().toISOString().split('T')[0]
  form.time = new Date().toTimeString().split(' ')[0].substring(0,5)
  
  Object.keys(errors).forEach(key => errors[key] = '')
}

onMounted(() => {
  // Load sample recent procurements
  recentProcurements.value = [
    { id: 1, date: '2024-03-01', produceName: 'Beans', tonnage: 2000, cost: 5000000, dealerName: 'Farmers Coop' },
    { id: 2, date: '2024-03-02', produceName: 'Maize', tonnage: 3000, cost: 7500000, dealerName: 'AgriCorp' }
  ]
})
</script>

<style scoped>
.procurement-container {
  min-height: 100vh;
}

.role-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  background: var(--deep-green);
  color: var(--gold);
}

.procurement-form {
  margin-top: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  margin-top: 20px;
}

.recent-section {
  margin-top: 40px;
}

.recent-section h2 {
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.recent-section h2 i {
  color: var(--gold);
}
</style>