<template>
  <div class="director-page">
    <Navbar />
    
    <div class="director-header">
      <div class="header-content">
        <div>
          <h1><i class="fas fa-chart-pie"></i> Executive Dashboard</h1>
          <p class="welcome-text">Welcome back, Mr. Orban. Here's your enterprise overview.</p>
        </div>
        <div class="date-range">
          <i class="fas fa-calendar-alt"></i>
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- Key Performance Indicators -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon revenue">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Total Revenue</span>
          <span class="kpi-value">UGX {{ formatNumber(totalRevenue) }}</span>
          <span class="kpi-trend positive">
            <i class="fas fa-arrow-up"></i> +15.3% vs last month
          </span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon profit">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Gross Profit</span>
          <span class="kpi-value">UGX {{ formatNumber(grossProfit) }}</span>
          <span class="kpi-trend positive">
            <i class="fas fa-arrow-up"></i> +12.8% margin
          </span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon stock">
          <i class="fas fa-boxes"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Inventory Value</span>
          <span class="kpi-value">UGX {{ formatNumber(totalInventoryValue) }}</span>
          <span class="kpi-trend neutral">
            <i class="fas fa-minus"></i> Stable
          </span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon credit">
          <i class="fas fa-credit-card"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Credit Outstanding</span>
          <span class="kpi-value">UGX {{ formatNumber(totalCredit) }}</span>
          <span class="kpi-trend negative">
            <i class="fas fa-arrow-down"></i> -5.2% risk
          </span>
        </div>
      </div>
    </div>

    <!-- Branch Performance -->
    <div class="branch-performance">
      <h2><i class="fas fa-store-alt"></i> Branch Performance</h2>
      <div class="branch-cards">
        <div class="branch-card maganjo">
          <div class="branch-header">
            <h3><i class="fas fa-store"></i> Maganjo Branch</h3>
            <span class="branch-badge">Manager: John</span>
          </div>
          <div class="branch-stats">
            <div class="branch-stat">
              <span class="stat-label">Revenue</span>
              <span class="stat-value">UGX 4,250,000</span>
              <span class="stat-change positive">+12%</span>
            </div>
            <div class="branch-stat">
              <span class="stat-label">Stock Value</span>
              <span class="stat-value">UGX 15,750,000</span>
              <span class="stat-change neutral">0%</span>
            </div>
            <div class="branch-stat">
              <span class="stat-label">Credit Sales</span>
              <span class="stat-value">UGX 850,000</span>
              <span class="stat-change negative">-3%</span>
            </div>
          </div>
          <div class="branch-footer">
            <span class="stock-indicator healthy">
              <i class="fas fa-check-circle"></i> Stock Healthy
            </span>
          </div>
        </div>

        <div class="branch-card matugga">
          <div class="branch-header">
            <h3><i class="fas fa-store"></i> Matugga Branch</h3>
            <span class="branch-badge">Manager: Sarah</span>
          </div>
          <div class="branch-stats">
            <div class="branch-stat">
              <span class="stat-label">Revenue</span>
              <span class="stat-value">UGX 3,850,000</span>
              <span class="stat-change positive">+8%</span>
            </div>
            <div class="branch-stat">
              <span class="stat-label">Stock Value</span>
              <span class="stat-value">UGX 12,500,000</span>
              <span class="stat-change positive">+5%</span>
            </div>
            <div class="branch-stat">
              <span class="stat-label">Credit Sales</span>
              <span class="stat-value">UGX 620,000</span>
              <span class="stat-change positive">+2%</span>
            </div>
          </div>
          <div class="branch-footer">
            <span class="stock-indicator warning">
              <i class="fas fa-exclamation-triangle"></i> Low Stock Alert
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <h2><i class="fas fa-chart-bar"></i> Performance Analytics</h2>
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h4>Monthly Revenue</h4>
            <select v-model="revenuePeriod" class="chart-select">
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
              <option value="24">Last 24 months</option>
            </select>
          </div>
          <div class="chart-placeholder">
            <div class="bar-chart">
              <div v-for="(value, index) in monthlyData" :key="index" class="bar-container">
                <div class="bar" :style="{ height: value + '%' }"></div>
                <span class="bar-label">{{ monthLabels[index] }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h4>Product Performance</h4>
            <span class="chart-note">Top 5 products</span>
          </div>
          <div class="chart-placeholder">
            <div class="pie-chart-placeholder">
              <div class="pie-segment beans"></div>
              <div class="pie-segment maize"></div>
              <div class="pie-segment peas"></div>
              <div class="pie-segment gnuts"></div>
              <div class="pie-segment soy"></div>
            </div>
            <div class="legend">
              <div class="legend-item"><span class="color-dot beans"></span> Beans (35%)</div>
              <div class="legend-item"><span class="color-dot maize"></span> Maize (28%)</div>
              <div class="legend-item"><span class="color-dot peas"></span> Cow peas (18%)</div>
              <div class="legend-item"><span class="color-dot gnuts"></span> G-nuts (12%)</div>
              <div class="legend-item"><span class="color-dot soy"></span> Soybeans (7%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <i class="fas fa-users"></i>
        <div class="summary-content">
          <span class="summary-label">Total Customers</span>
          <span class="summary-value">1,247</span>
          <span class="summary-change positive">+124 this month</span>
        </div>
      </div>

      <div class="summary-card">
        <i class="fas fa-truck"></i>
        <div class="summary-content">
          <span class="summary-label">Active Suppliers</span>
          <span class="summary-value">23</span>
          <span class="summary-change neutral">+2 new</span>
        </div>
      </div>

      <div class="summary-card">
        <i class="fas fa-clock"></i>
        <div class="summary-content">
          <span class="summary-label">Avg. Payment Time</span>
          <span class="summary-value">18 days</span>
          <span class="summary-change positive">-3 days</span>
        </div>
      </div>

      <div class="summary-card">
        <i class="fas fa-percent"></i>
        <div class="summary-content">
          <span class="summary-label">Profit Margin</span>
          <span class="summary-value">24.5%</span>
          <span class="summary-change positive">+2.1%</span>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <h2><i class="fas fa-history"></i> Recent Activity</h2>
      <div class="activity-timeline">
        <div class="activity-item">
          <div class="activity-icon procurement">
            <i class="fas fa-truck-loading"></i>
          </div>
          <div class="activity-details">
            <span class="activity-title">New Procurement</span>
            <span class="activity-description">2,000kg Beans added to Maganjo branch</span>
            <span class="activity-time">2 hours ago</span>
          </div>
        </div>

        <div class="activity-item">
          <div class="activity-icon sale">
            <i class="fas fa-cash-register"></i>
          </div>
          <div class="activity-details">
            <span class="activity-title">Bulk Sale</span>
            <span class="activity-description">1,500kg Maize sold to Farm Fresh Ltd</span>
            <span class="activity-time">5 hours ago</span>
          </div>
        </div>

        <div class="activity-item">
          <div class="activity-icon credit">
            <i class="fas fa-credit-card"></i>
          </div>
          <div class="activity-details">
            <span class="activity-title">Credit Payment</span>
            <span class="activity-description">UGX 500,000 received from John Doe</span>
            <span class="activity-time">Yesterday</span>
          </div>
        </div>

        <div class="activity-item">
          <div class="activity-icon alert">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="activity-details">
            <span class="activity-title">Low Stock Alert</span>
            <span class="activity-description">G-nuts below 1000kg in Matugga</span>
            <span class="activity-time">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import Navbar from '@/components/Navbar.vue'

const productStore = useProductStore()
const revenuePeriod = ref('6')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-UG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const totalRevenue = computed(() => {
  return 8250000 // Sample data
})

const grossProfit = computed(() => {
  return 3240000 // Sample data
})

const totalInventoryValue = computed(() => {
  return productStore.totalInventoryValue
})

const totalCredit = computed(() => {
  return 1470000 // Sample data
})

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const monthlyData = [65, 72, 78, 82, 88, 95]

const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}

// Initialize sample data
productStore.initializeSampleData()
</script>

<style scoped>
.director-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 30px;
}

.director-header {
  background: white;
  padding: 25px 30px;
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border-left: 5px solid var(--gold);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  color: var(--deep-green);
  margin-bottom: 10px;
}

.header-content h1 i {
  color: var(--gold);
}

.welcome-text {
  color: var(--text-light);
  font-size: 14px;
}

.date-range {
  background: var(--warm-white);
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--deep-green);
}

.date-range i {
  color: var(--gold);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px;
}

.kpi-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.kpi-icon.revenue {
  background: rgba(27, 77, 62, 0.1);
  color: var(--deep-green);
}

.kpi-icon.profit {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success);
}

.kpi-icon.stock {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning);
}

.kpi-icon.credit {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger);
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  display: block;
  color: var(--text-light);
  font-size: 13px;
  margin-bottom: 5px;
}

.kpi-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.kpi-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.kpi-trend.positive {
  color: var(--success);
}

.kpi-trend.negative {
  color: var(--danger);
}

.kpi-trend.neutral {
  color: var(--text-light);
}

.branch-performance {
  margin: 30px 20px;
}

.branch-performance h2 {
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.branch-performance h2 i {
  color: var(--gold);
}

.branch-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.branch-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid;
}

.branch-card.maganjo {
  border-left-color: var(--deep-green);
}

.branch-card.matugga {
  border-left-color: var(--gold);
}

.branch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.branch-header h3 {
  color: var(--deep-green);
  display: flex;
  align-items: center;
  gap: 10px;
}

.branch-header h3 i {
  color: var(--gold);
}

.branch-badge {
  background: var(--warm-white);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  color: var(--text-light);
}

.branch-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.branch-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.branch-stat .stat-label {
  color: var(--text-light);
  font-size: 13px;
}

.branch-stat .stat-value {
  font-weight: bold;
  color: var(--text-dark);
}

.branch-stat .stat-change {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.branch-stat .stat-change.positive {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success);
}

.branch-stat .stat-change.negative {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger);
}

.branch-stat .stat-change.neutral {
  background: rgba(108, 117, 125, 0.1);
  color: var(--text-light);
}

.branch-footer {
  display: flex;
  justify-content: flex-end;
}

.stock-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 5px;
}

.stock-indicator.healthy {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success);
}

.stock-indicator.warning {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning);
}

.charts-section {
  margin: 30px 20px;
}

.charts-section h2 {
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.charts-section h2 i {
  color: var(--gold);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  color: var(--deep-green);
}

.chart-select {
  padding: 5px 10px;
  border: 2px solid var(--border-light);
  border-radius: 5px;
  font-size: 12px;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: flex-end;
}

.bar-chart {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.bar {
  width: 30px;
  background: linear-gradient(to top, var(--deep-green), var(--gold));
  border-radius: 5px 5px 0 0;
  transition: height 0.3s;
  min-height: 20px;
}

.bar-label {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-light);
}

.pie-chart-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    var(--deep-green) 0deg 126deg,
    var(--gold) 126deg 226deg,
    #f39c12 226deg 291deg,
    #e74c3c 291deg 334deg,
    #3498db 334deg 360deg
  );
  margin-right: 30px;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.color-dot.beans {
  background: var(--deep-green);
}

.color-dot.maize {
  background: var(--gold);
}

.color-dot.peas {
  background: #f39c12;
}

.color-dot.gnuts {
  background: #e74c3c;
}

.color-dot.soy {
  background: #3498db;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 20px;
}

.summary-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.summary-card i {
  font-size: 32px;
  color: var(--gold);
}

.summary-content {
  flex: 1;
}

.summary-label {
  display: block;
  color: var(--text-light);
  font-size: 12px;
  margin-bottom: 3px;
}

.summary-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 3px;
}

.summary-change {
  font-size: 11px;
}

.summary-change.positive {
  color: var(--success);
}

.summary-change.neutral {
  color: var(--text-light);
}

.recent-activity {
  margin: 30px 20px;
}

.recent-activity h2 {
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.recent-activity h2 i {
  color: var(--gold);
}

.activity-timeline {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.activity-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-light);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.activity-icon.procurement {
  background: rgba(27, 77, 62, 0.1);
  color: var(--deep-green);
}

.activity-icon.sale {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success);
}

.activity-icon.credit {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning);
}

.activity-icon.alert {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger);
}

.activity-details {
  flex: 1;
}

.activity-title {
  display: block;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 3px;
}

.activity-description {
  display: block;
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 3px;
}

.activity-time {
  font-size: 11px;
  color: #999;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .kpi-grid,
  .branch-cards,
  .charts-grid,
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .chart-placeholder {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .bar-chart {
    height: 150px;
  }
  
  .bar {
    width: 20px;
  }
  
  .pie-chart-placeholder {
    margin-right: 0;
  }
}
</style>