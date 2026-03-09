<template>
  <div class="produce-card" :class="{ 'low-stock': isLowStock, 'out-of-stock': isOutOfStock }">
    <div class="card-header">
      <h3>{{ product.name }}</h3>
      <span class="badge" :class="stockStatusClass">{{ stockStatusText }}</span>
    </div>
    
    <div class="card-body">
      <p><i class="fas fa-tag"></i> Type: {{ product.type }}</p>
      <p :class="{ 'text-danger': product.tonnage < 1000 }">
        <i class="fas fa-weight"></i> Stock: {{ product.tonnage }} kg
      </p>
      <p><i class="fas fa-dollar-sign"></i> Price: UGX {{ formatNumber(product.price) }}/kg</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const isLowStock = computed(() => {
  return props.product.tonnage > 0 && props.product.tonnage < 1000
})

const isOutOfStock = computed(() => {
  return props.product.tonnage === 0
})

const stockStatusText = computed(() => {
  if (isOutOfStock.value) return 'Out of Stock'
  if (isLowStock.value) return 'Low Stock'
  return 'In Stock'
})

const stockStatusClass = computed(() => {
  if (isOutOfStock.value) return 'badge-danger'
  if (isLowStock.value) return 'badge-warning'
  return 'badge-success'
})

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}
</script>

<style scoped>
.produce-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid var(--gold);
  transition: all 0.3s;
}

.produce-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(27, 77, 62, 0.2);
}

.produce-card.low-stock {
  border-left-color: var(--warning);
}

.produce-card.out-of-stock {
  border-left-color: var(--danger);
  opacity: 0.7;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0;
  color: var(--deep-green);
}

.card-body p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body i {
  color: var(--gold);
  width: 20px;
}

.text-danger {
  color: var(--danger);
  font-weight: bold;
}
</style>