import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('product', () => {
  // State
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

  // Update stock
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

  // Add product
  function addLocalProduct(product) {
    products.value.push({
      id: Date.now(),
      ...product
    })
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

  // API methods (mock for now)
  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      initializeSampleData()
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    sales,
    procurements,
    credits,
    loading,
    error,
    
    // Methods
    initializeSampleData,
    updateLocalStock,
    addLocalProduct,
    fetchProducts,
    
    // Getters
    totalTonnage,
    totalInventoryValue,
    lowStockItems,
    outOfStock,
    inStock
  }
})