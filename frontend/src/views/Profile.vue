<template>
  <div class="profile-view">
    <div class="profile-header">
      <div class="profile-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="profile-title">
        <h1>{{ userStore.userName }}</h1>
        <p class="profile-role" :class="userStore.userRole?.toLowerCase()">{{ userStore.userRole }}</p>
      </div>
    </div>

    <div class="profile-grid">
      <!-- Personal Information -->
      <div class="profile-card">
        <h2><i class="fas fa-user"></i> Personal Information</h2>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">Full Name</span>
            <span class="info-value">{{ userStore.userName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email Address</span>
            <span class="info-value">{{ userStore.userEmail || 'Not provided' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Employee ID</span>
            <span class="info-value">KGL-{{ String(userStore.currentUser?.id || '001').padStart(3, '0') }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Member Since</span>
            <span class="info-value">{{ joinDate }}</span>
          </div>
        </div>
      </div>

      <!-- Branch Information -->
      <div class="profile-card">
        <h2><i class="fas fa-store"></i> Branch Information</h2>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">Assigned Branch</span>
            <span class="info-value">{{ userStore.userBranch }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Branch Location</span>
            <span class="info-value">{{ branchLocation }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Branch Code</span>
            <span class="info-value">{{ branchCode }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Manager</span>
            <span class="info-value">{{ branchManager }}</span>
          </div>
        </div>
      </div>

      <!-- Account Statistics -->
      <div class="profile-card">
        <h2><i class="fas fa-chart-bar"></i> Account Statistics</h2>
        <div class="stats-list">
          <div class="stat-item">
            <span class="stat-label">Sales Recorded</span>
            <span class="stat-value">{{ userStats.sales }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Procurements</span>
            <span class="stat-value">{{ userStats.procurements }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Credit Sales</span>
            <span class="stat-value">{{ userStats.credits }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Login Count</span>
            <span class="stat-value">{{ userStats.logins }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="profile-card recent-activity">
        <h2><i class="fas fa-history"></i> Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
            <i :class="activity.icon"></i>
            <div class="activity-details">
              <span class="activity-title">{{ activity.title }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="profile-actions">
      <button class="btn-primary" @click="editProfile">
        <i class="fas fa-edit"></i> Edit Profile
      </button>
      <button class="btn-secondary" @click="changePassword">
        <i class="fas fa-key"></i> Change Password
      </button>
      <button class="btn-danger" @click="logout">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const joinDate = computed(() => {
  return new Date().toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const branchLocation = computed(() => {
  return userStore.userBranch === 'Maganjo' 
    ? 'Plot 12, Kampala Road, Maganjo'
    : 'Plot 45, Matugga Town Centre'
})

const branchCode = computed(() => {
  return userStore.userBranch === 'Maganjo' ? 'KGL-MGJ' : 'KGL-MTG'
})

const branchManager = computed(() => {
  return userStore.userBranch === 'Maganjo' ? 'John Manager' : 'Sarah Manager'
})

const userStats = computed(() => ({
  sales: 127,
  procurements: 43,
  credits: 18,
  logins: 156
}))

const recentActivities = computed(() => [
  { id: 1, icon: 'fas fa-cash-register', title: 'Recorded a sale of 500kg Beans', time: '2 hours ago' },
  { id: 2, icon: 'fas fa-truck-loading', title: 'Added 2000kg Maize to inventory', time: 'Yesterday' },
  { id: 3, icon: 'fas fa-credit-card', title: 'Created credit sale for John Doe', time: 'Yesterday' },
  { id: 4, icon: 'fas fa-sign-in-alt', title: 'Logged in from Maganjo branch', time: '2 days ago' }
])

const editProfile = () => {
  toast.info('Edit profile feature coming soon!')
}

const changePassword = () => {
  router.push('/settings')
}

const logout = () => {
  userStore.logout()
  router.push('/login')
  toast.success('Logged out successfully')
}
</script>

<style scoped>
.profile-view {
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.profile-avatar i {
  font-size: 80px;
  color: var(--gold);
}

.profile-title h1 {
  font-size: 32px;
  color: var(--deep-green);
  margin-bottom: 5px;
}

.profile-role {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.profile-role.manager {
  background: var(--deep-green);
  color: var(--gold);
}

.profile-role.agent {
  background: var(--gold);
  color: var(--deep-green);
}

.profile-role.director {
  background: #9b59b6;
  color: white;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.profile-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.profile-card h2 {
  font-size: 18px;
  color: var(--deep-green);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-card h2 i {
  color: var(--gold);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
}

.info-label {
  color: var(--text-light);
  font-size: 13px;
}

.info-value {
  font-weight: 600;
  color: var(--deep-green);
}

.stats-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: var(--warm-white);
  border-radius: 10px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: var(--deep-green);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;
}

.activity-item:hover {
  background: var(--warm-white);
}

.activity-item i {
  width: 30px;
  height: 30px;
  background: var(--warm-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
}

.activity-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-title {
  font-size: 13px;
  font-weight: 500;
}

.activity-time {
  font-size: 11px;
  color: var(--text-light);
}

.profile-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary, .btn-danger {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--deep-green);
  color: var(--gold);
}

.btn-primary:hover {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--gold);
  color: var(--deep-green);
}

.btn-secondary:hover {
  background: #e6c200;
  transform: translateY(-2px);
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .stats-list {
    grid-template-columns: 1fr;
  }
}
</style>