<template>
  <div class="credit-container">
    <Navbar />
    
    <div class="card">
      <h1><i class="fas fa-credit-card"></i> Credit Sales - {{ userStore.branch }} Branch</h1>
      <p class="info-text">For trusted buyers only - Requires National ID verification</p>
      
      <form @submit.prevent="submitForm" class="credit-form">
        <div class="form-grid">
          <div class="form-group">
            <label><i class="fas fa-user"></i> Buyer Name *</label>
            <input 
              v-model="form.buyerName" 
              type="text"
              minlength="2"
              required
              :class="{ error: errors.buyerName }"
              @input="validateField('buyerName')"
            >
            <div v-if="errors.buyerName" class="error-message">{{ errors.buyerName }}</div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-id-card"></i> National ID *</label>
            <input 
              v-model="form.nationalId" 
              type="text"
              placeholder="CM12345678"
              required
              :class="{ error: errors.nationalId }"
              @input="validateField('nationalId')"
            >
            <div v-if="errors.nationalId" class="error-message">{{ errors.nationalId }}</div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-map-marker-alt"></i> Location *</label>
            <input 
              v-model="form.location" 
              type="text"
              minlength="2"
              required
              :class="{ error: errors.location }"
              @input="validateField('location')"
            >
            <div v-if="errors.location" class="error-message">{{ errors.location }}</div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-phone"></i> Contact *</label>
            <input 
              v-model="form.contact" 
              type="tel"
              placeholder="0772123456"
              required
              :class="{ error: errors.contact }"
              @input="validateField('contact')"
            >
            <div v-if="errors.contact" class="error-message">{{ errors.contact }}</div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-box"></i> Produce *</label>
            <select v-model="form.produceId" required @change="updateProduceDetails">
              <option value="">Select Produce</option>
              <option 
                v-for="product in productStore.inStock" 
                :key="product.id" 
                :value="product.id"
              >
                {{ product.name }} - {{ product.tonnage }}kg @ UGX {{ formatNumber(product.price) }}/kg
              </option>
            </select>
          </div>

          <div class="form-group">
            <label><i class="fas fa-weight"></i> Quantity (kg) *</label>
            <input 
              v-model.number="form.quantity" 
              type="number"
              min="1"
              :max="selectedProduct?.tonnage"
              required
              @input="updateAmountDue"
            >
          </div>

          <div class="form-group">
            <label><i class="fas fa-money-bill"></i> Amount Due (UGX) *</label>
            <input 
              v-model.number="form.amountDue" 
              type="number"
              min="10000"
              required
              readonly
              class="readonly-field"
            >
            <small>Calculated automatically</small>
          </div>

          <div class="form-group">
            <label><i class="fas fa-calendar"></i> Due Date *</label>
            <input 
              v-model="form.dueDate" 
              type="date"
              :min="minDueDate"
              required
            >
          </div>

          <div class="form-group">
            <label><i class="fas fa-user-tie"></i> Agent Name *</label>
            
           
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn" :disabled="isSubmitting || !isFormValid">
            <span v-if="isSubmitting" class="spinner"></span>
            <i v-else class="fas fa-save"></i>
            {{ isSubmitting ? 'Processing...' : 'Record Credit Sale' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="resetForm">
            <i class="fas fa-undo"></i> Reset
          </button>
        </div>
      </form>
      
      <!-- Credit Summary -->
      <div class="summary-section">
        <h2><i class="fas fa-chart-pie"></i> Credit Summary</h2>
        <div class="stats-grid">
          <div class="stat-card small">
            <h3>Total Outstanding</h3>
            <div class="value">UGX {{ formatNumber(totalOutstanding) }}</div>
          </div>
          <div class="stat-card small">
            <h3>Active Credits</h3>
            <div class="value">{{ activeCredits.length }}</div>
          </div>
          <div class="stat-card small">
            <h3>Overdue</h3>
            <div class="value">{{ overdueCount }}</div>
          </div>
        </div>
      </div>
      
      <!-- Active Credits Table -->
      <div class="credits-table">
        <h2><i class="fas fa-list"></i> Active Credit Accounts</h2>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>NIN</th>
                <th>Produce</th>
                <th>Quantity</th>
                <th>Amount Due</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="credit in activeCredits" :key="credit.id">
                <td>{{ credit.buyerName }}</td>
                <td>{{ credit.nationalId }}</td>
                <td>{{ credit.produceName }}</td>
                <td>{{ credit.quantity }} kg</td>
                <td>UGX {{ formatNumber(credit.amountDue) }}</td>
                <td>{{ credit.dueDate }}</td>
                <td>
                  <span :class="['badge', getStatusClass(credit)]">
                    {{ getStatus(credit) }}
                  </span>
                </td>
              </tr>
              <tr v-if="activeCredits.length === 0">
                <td colspan="7" class="text-center">No active credit accounts</td>
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

const form = reactive({
  buyerName: '',
  nationalId: '',
  location: '',
  contact: '',
  produceId: '',
  quantity: '',
  amountDue: '',
  dueDate: '',
  agentName: userStore.userName || ''
})

const errors = reactive({
  buyerName: '',
  nationalId: '',
  location: '',
  contact: ''
})

const isSubmitting = ref(false)
const activeCredits = ref([])

const selectedProduct = computed(() => {
  return productStore.products.find(p => p.id === form.produceId)
})

const minDueDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

const validateField = (field) => {
  switch(field) {
    case 'buyerName':
      errors.buyerName = !form.buyerName ? 'Buyer name required' :
                         form.buyerName.length < 2 ? 'Minimum 2 characters' : ''
      break
    case 'nationalId':
      const ninRegex = /^[A-Z0-9]{10,15}$/
      errors.nationalId = !form.nationalId ? 'National ID required' :
                          !ninRegex.test(form.nationalId) ? 'Invalid NIN format' : ''
      break
    case 'location':
      errors.location = !form.location ? 'Location required' :
                       form.location.length < 2 ? 'Minimum 2 characters' : ''
      break
    case 'contact':
      const phoneRegex = /^[0-9]{10}$/
      errors.contact = !form.contact ? 'Contact required' :
                      !phoneRegex.test(form.contact) ? 'Invalid phone number' : ''
      break
  }
}

const isFormValid = computed(() => {
  return form.buyerName?.length >= 2 &&
         /^[A-Z0-9]{10,15}$/.test(form.nationalId) &&
         form.location?.length >= 2 &&
         /^[0-9]{10}$/.test(form.contact) &&
         form.produceId &&
         form.quantity > 0 &&
         form.amountDue >= 10000 &&
         form.dueDate &&
         form.agentName?.length >= 2
})

const totalOutstanding = computed(() => {
  return activeCredits.value.reduce((sum, c) => sum + c.amountDue, 0)
})

const overdueCount = computed(() => {
  const today = new Date()
  return activeCredits.value.filter(c => new Date(c.dueDate) < today).length
})

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}

const updateProduceDetails = () => {
  form.quantity = ''
  form.amountDue = ''
}

const updateAmountDue = () => {
  if (selectedProduct.value && form.quantity) {
    form.amountDue = selectedProduct.value.price * form.quantity
  }
}

const getStatus = (credit) => {
  const today = new Date()
  const dueDate = new Date(credit.dueDate)
  
  if (dueDate < today) return 'Overdue'
  if (dueDate.toDateString() === today.toDateString()) return 'Due Today'
  return 'Active'
}

const getStatusClass = (credit) => {
  const status = getStatus(credit)
  switch(status) {
    case 'Overdue': return 'badge-danger'
    case 'Due Today': return 'badge-warning'
    default: return 'badge-success'
  }
}

const submitForm = async () => {
  // Validate all fields
  validateField('buyerName')
  validateField('nationalId')
  validateField('location')
  validateField('contact')
  
  if (!isFormValid.value) {
    toast.warning('Please check all fields')
    return
  }
  
  if (form.quantity > selectedProduct.value.tonnage) {
    toast.error(`Only ${selectedProduct.value.tonnage}kg available`)
    return
  }
  
  isSubmitting.value = true
  
  try {
    const creditData = {
      id: Date.now(),
      ...form,
      produceName: selectedProduct.value.name,
      produceType: selectedProduct.value.type,
      branch: userStore.branch,
      timestamp: new Date().toISOString()
    }
    
    // Add to active credits
    activeCredits.value.unshift(creditData)
    
    // Update inventory
    productStore.updateLocalStock(form.produceId, form.quantity, 'sale')
    
    toast.success('Credit sale recorded successfully')
    resetForm()
  } catch (error) {
    toast.error(error.message || 'Failed to record credit sale')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.buyerName = ''
  form.nationalId = ''
  form.location = ''
  form.contact = ''
  form.produceId = ''
  form.quantity = ''
  form.amountDue = ''
  form.dueDate = ''
  form.agentName = userStore.userName || ''
  
  Object.keys(errors).forEach(key => errors[key] = '')
}

onMounted(() => {
  productStore.initializeSampleData()
  
  // Sample credit accounts
  activeCredits.value = [
    { 
      id: 1, 
      buyerName: 'John Doe', 
      nationalId: 'CM12345678', 
      produceName: 'Beans', 
      quantity: 500, 
      amountDue: 1500000, 
      dueDate: '2024-04-01' 
    },
    { 
      id: 2, 
      buyerName: 'Jane Smith', 
      nationalId: 'CM87654321', 
      produceName: 'Maize', 
      quantity: 1000, 
      amountDue: 2500000, 
      dueDate: '2024-03-01' 
    }
  ]
})
</script>

<style scoped>
.credit-container {
  min-height: 100vh;
}

.info-text {
  color: var(--text-light);
  margin-bottom: 20px;
  font-style: italic;
}

.credit-form {
  margin-top: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.readonly-field {
  background: var(--warm-white);
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  margin-top: 20px;
}

.summary-section {
  margin: 40px 0 20px;
}

.summary-section h2 {
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-section h2 i {
  color: var(--gold);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card.small {
  padding: 15px;
}

.stat-card.small .value {
  font-size: 24px;
}

.credits-table {
  margin-top: 30px;
}

.credits-table h2 {
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.credits-table h2 i {
  color: var(--gold);
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.text-center {
  text-align: center;
  color: var(--text-light);
  padding: 20px;
}
</style>