import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const sales = ref([])
  const procurements = ref([])
  const credits = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Initialize with sample data
  function initializeSampleData() {
    if (products.value.length === 0) {
      products.value = [
        { id: 1, name: 'Beans', type: 'Beans', tonnage: 5000, price: 3000 },
        { id: 2, name: 'Maize', type: 'Grain Maize', tonnage: 8000, price: 2500 },
        { id: 3, name: 'Cow peas', type: 'Cow peas', tonnage: 3000, price: 3500 },
        { id: 4, name: 'G-nuts', type: 'G-nuts', tonnage: 2000, price: 5000 },
        { id: 5, name: 'Soybeans', type: 'Soybeans', tonnage: 4000, price: 2800 }
      ]
    }
  }

  // API calls
  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/inventory')
      products.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error(err)
      // Fallback to sample data
      initializeSampleData()
    } finally {
      loading.value = false
    }
  }

  async function fetchSales() {
    try {
      const response = await api.get('/sales')
      sales.value = response.data
    } catch (err) {
      console.error('Failed to fetch sales:', err)
    }
  }

  async function fetchProcurements() {
    try {
      const response = await api.get('/procurement')
      procurements.value = response.data
    } catch (err) {
      console.error('Failed to fetch procurements:', err)
    }
  }

  async function fetchCredits() {
    try {
      const response = await api.get('/credit')
      credits.value = response.data
    } catch (err) {
      console.error('Failed to fetch credits:', err)
    }
  }

  // Local stock updates
  function updateLocalStock(productId, quantity, operation = 'sale') {
    const product = products.value.find(p => p.id === productId)
    if (!product) return false

    if (operation === 'sale') {
      if (product.tonnage < quantity) return false
      product.tonnage -= quantity
    } else {
      product.tonnage += quantity
    }
    return true
  }

  // Getters
  const totalTonnage = computed(() => {
    return products.value.reduce((sum, p) => sum + (p.tonnage || 0), 0)
  })

  const totalInventoryValue = computed(() => {
    return products.value.reduce((sum, p) => sum + ((p.tonnage || 0) * (p.price || 0)), 0)
  })

  const lowStockItems = computed(() => {
    return products.value.filter(p => p.tonnage > 0 && p.tonnage < 1000)
  })

  const outOfStock = computed(() => {
    return products.value.filter(p => p.tonnage === 0)
  })

  const inStock = computed(() => {
    return products.value.filter(p => p.tonnage > 0)
  })

  return {
    products,
    sales,
    procurements,
    credits,
    loading,
    error,
    initializeSampleData,
    fetchProducts,
    fetchSales,
    fetchProcurements,
    fetchCredits,
    updateLocalStock,
    totalTonnage,
    totalInventoryValue,
    lowStockItems,
    outOfStock,
    inStock
  }
})