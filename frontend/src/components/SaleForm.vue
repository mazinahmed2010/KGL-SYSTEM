<template>
  <form @submit.prevent="submitForm" class="sale-form">
    <h3><i class="fas fa-cash-register"></i> {{ title }}</h3>
    
    <div class="form-group">
      <label><i class="fas fa-box"></i> Select Produce *</label>
      <select v-model="formData.produceId" required :disabled="isSubmitting">
        <option value="">-- Choose product --</option>
        <option 
          v-for="product in availableProducts" 
          :key="product.id" 
          :value="product.id"
          :disabled="product.tonnage === 0"
        >
          {{ product.name }} - {{ product.tonnage }}kg available @ UGX {{ formatNumber(product.price) }}/kg
        </option>
      </select>
    </div>
    
    <div class="form-group" v-if="selectedProduct">
      <p class="info-text">
        <i class="fas fa-info-circle"></i> 
        Selling Price: UGX {{ formatNumber(selectedProduct.price) }}/kg
        <span v-if="selectedProduct.tonnage < 1000" class="warning-text">
          (Low stock: {{ selectedProduct.tonnage }}kg remaining)
        </span>
      </p>
    </div>
    
    <div class="form-group">
      <label><i class="fas fa-weight"></i> Quantity (kg) *</label>
      <input 
        v-model.number="formData.quantity" 
        type="number" 
        min="1"
        :max="selectedProduct?.tonnage || 0"
        required
        :disabled="isSubmitting"
        @input="validateQuantity"
      >
      <div v-if="quantityError" class="error-message">{{ quantityError }}</div>
    </div>
    
    <div class="form-group">
      <label><i class="fas fa-dollar-sign"></i> Amount Paid (UGX) *</label>
      <input 
        v-model.number="formData.amountPaid" 
        type="number" 
        min="10000"
        required
        :disabled="isSubmitting"
        @input="validateAmount"
      >
      <div v-if="amountError" class="error-message">{{ amountError }}</div>
      <p class="suggestion-text" v-if="selectedProduct && formData.quantity">
        Suggested: UGX {{ formatNumber(selectedProduct.price * formData.quantity) }}
      </p>
    </div>
    
    <div class="form-group">
      <label><i class="fas fa-user"></i> Buyer Name *</label>
      <input 
        v-model="formData.buyerName" 
        type="text"
        minlength="2"
        required
        :disabled="isSubmitting"
      >
    </div>
    
    <div class="form-group">
      <label><i class="fas fa-user-tie"></i> Agent Name *</label>
      <input 
        v-model="formData.agentName" 
        type="text"
        minlength="2"
        required
        :disabled="isSubmitting"
        :value="userStore.userName"
      >
    </div>
    
    <slot name="extra-fields"></slot>
    
    <div class="form-actions">
      <button type="submit" class="btn" :disabled="!isFormValid || isSubmitting">
        <span v-if="isSubmitting" class="spinner"></span>
        <i v-else class="fas fa-save"></i>
        {{ isSubmitting ? 'Processing...' : submitText }}
      </button>
      <button type="button" class="btn btn-secondary" @click="resetForm" :disabled="isSubmitting">
        <i class="fas fa-undo"></i> Reset
      </button>
    </div>
    
    <div v-if="formError" class="alert alert-danger">
      <i class="fas fa-exclamation-circle"></i> {{ formError }}
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Record Sale'
  },
  submitText: {
    type: String,
    default: 'Record Sale'
  },
  isCredit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit-sale'])

const userStore = useUserStore()

const formData = ref({
  produceId: '',
  quantity: '',
  amountPaid: '',
  buyerName: '',
  agentName: userStore.userName || ''
})

const isSubmitting = ref(false)
const formError = ref('')
const quantityError = ref('')
const amountError = ref('')

const selectedProduct = computed(() => {
  return props.products.find(p => p.id === formData.value.produceId)
})

const availableProducts = computed(() => {
  return props.products.filter(p => p.tonnage > 0)
})

const validateQuantity = () => {
  quantityError.value = ''
  
  if (!formData.value.quantity) return
  
  if (formData.value.quantity <= 0) {
    quantityError.value = 'Quantity must be greater than 0'
  } else if (selectedProduct.value && formData.value.quantity > selectedProduct.value.tonnage) {
    quantityError.value = `Only ${selectedProduct.value.tonnage}kg available`
  }
}

const validateAmount = () => {
  amountError.value = ''
  
  if (!formData.value.amountPaid) return
  
  if (formData.value.amountPaid < 10000) {
    amountError.value = 'Minimum amount is 10,000 UGX'
  }
}

const isFormValid = computed(() => {
  return formData.value.produceId &&
         formData.value.quantity > 0 &&
         formData.value.amountPaid >= 10000 &&
         formData.value.buyerName?.length >= 2 &&
         formData.value.agentName?.length >= 2 &&
         !quantityError.value &&
         !amountError.value
})

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}

watch(() => formData.value.produceId, () => {
  if (selectedProduct.value && !formData.value.amountPaid) {
    // Suggest amount based on quantity if set
    if (formData.value.quantity) {
      formData.value.amountPaid = selectedProduct.value.price * formData.value.quantity
    }
  }
  validateQuantity()
})

watch(() => formData.value.quantity, () => {
  if (selectedProduct.value && formData.value.quantity) {
    formData.value.amountPaid = selectedProduct.value.price * formData.value.quantity
  }
  validateQuantity()
})

const submitForm = async () => {
  if (!isFormValid.value) {
    formError.value = 'Please fill all required fields correctly'
    return
  }
  
  isSubmitting.value = true
  formError.value = ''
  
  try {
    const saleData = {
      ...formData.value,
      produceName: selectedProduct.value?.name,
      produceType: selectedProduct.value?.type,
      branch: userStore.branch,
      timestamp: new Date().toISOString()
    }
    
    await emit('submit-sale', saleData)
    resetForm()
  } catch (error) {
    formError.value = error.message || 'Failed to record sale'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    produceId: '',
    quantity: '',
    amountPaid: '',
    buyerName: '',
    agentName: userStore.userName || ''
  }
  quantityError.value = ''
  amountError.value = ''
  formError.value = ''
}
</script>

<style scoped>
.sale-form {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.sale-form h3 {
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sale-form h3 i {
  color: var(--gold);
}

.info-text {
  background: var(--warm-white);
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  border-left: 3px solid var(--gold);
}

.warning-text {
  color: var(--warning);
  font-weight: 600;
}

.suggestion-text {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.alert {
  margin-top: 20px;
}
</style>