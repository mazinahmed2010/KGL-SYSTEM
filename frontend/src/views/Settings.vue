<template>
  <div class="settings-view">
    <div class="page-header">
      <h1><i class="fas fa-cog"></i> Settings</h1>
      <p>Manage your account preferences and system settings</p>
    </div>

    <div class="settings-grid">
      <!-- Profile Settings -->
      <div class="settings-card">
        <div class="card-header">
          <i class="fas fa-user-circle"></i>
          <h2>Profile Settings</h2>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>Display Name</label>
            <input type="text" v-model="profile.displayName" placeholder="Your name">
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" v-model="profile.email" placeholder="your@email.com">
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="profile.phone" placeholder="+256 XXX XXX XXX">
          </div>
          <button class="btn-save" @click="saveProfile">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="settings-card">
        <div class="card-header">
          <i class="fas fa-bell"></i>
          <h2>Notifications</h2>
        </div>
        <div class="card-body">
          <div class="toggle-item">
            <label>Email Notifications</label>
            <div class="toggle-switch">
              <input type="checkbox" v-model="notifications.email">
              <span class="toggle-slider"></span>
            </div>
          </div>
          <div class="toggle-item">
            <label>Low Stock Alerts</label>
            <div class="toggle-switch">
              <input type="checkbox" v-model="notifications.lowStock">
              <span class="toggle-slider"></span>
            </div>
          </div>
          <div class="toggle-item">
            <label>Daily Reports</label>
            <div class="toggle-switch">
              <input type="checkbox" v-model="notifications.dailyReports">
              <span class="toggle-slider"></span>
            </div>
          </div>
          <div class="form-group">
            <label>Alert Threshold (kg)</label>
            <input type="number" v-model="notifications.threshold" min="100" max="5000" step="100">
          </div>
        </div>
      </div>

      <!-- Branch Settings -->
      <div class="settings-card">
        <div class="card-header">
          <i class="fas fa-store"></i>
          <h2>Branch Settings</h2>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>Default Branch</label>
            <select v-model="branch.default">
              <option value="Maganjo">Maganjo Branch</option>
              <option value="Matugga">Matugga Branch</option>
            </select>
          </div>
          <div class="form-group">
            <label>Branch Code</label>
            <input type="text" v-model="branch.code" placeholder="KGL-MGJ" readonly>
          </div>
          <div class="form-group">
            <label>Currency</label>
            <input type="text" v-model="branch.currency" value="UGX" readonly>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="settings-card">
        <div class="card-header">
          <i class="fas fa-shield-alt"></i>
          <h2>Security</h2>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" v-model="security.currentPassword">
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" v-model="security.newPassword">
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" v-model="security.confirmPassword">
          </div>
          <button class="btn-save" @click="changePassword">
            <i class="fas fa-key"></i> Update Password
          </button>
        </div>
      </div>

      <!-- System Info -->
      <div class="settings-card system-info">
        <div class="card-header">
          <i class="fas fa-info-circle"></i>
          <h2>System Information</h2>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span>Version:</span>
            <span class="info-value">v2.1.0</span>
          </div>
          <div class="info-row">
            <span>Environment:</span>
            <span class="info-value">{{ environment }}</span>
          </div>
          <div class="info-row">
            <span>Last Updated:</span>
            <span class="info-value">{{ lastUpdated }}</span>
          </div>
          <div class="info-row">
            <span>API Status:</span>
            <span class="info-value" :class="apiStatus ? 'online' : 'offline'">
              {{ apiStatus ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const userStore = useUserStore()
const toast = useToast()

const profile = ref({
  displayName: userStore.userName,
  email: userStore.userEmail,
  phone: '+256 700 123 456'
})

const notifications = ref({
  email: true,
  lowStock: true,
  dailyReports: false,
  threshold: 1000
})

const branch = ref({
  default: userStore.userBranch,
  code: userStore.userBranch === 'Maganjo' ? 'KGL-MGJ' : 'KGL-MTG',
  currency: 'UGX'
})

const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const environment = ref(import.meta.env.MODE || 'development')
const lastUpdated = ref(new Date().toLocaleDateString())
const apiStatus = ref(false)

const saveProfile = () => {
  toast.success('Profile updated successfully!')
}

const changePassword = () => {
  if (security.value.newPassword !== security.value.confirmPassword) {
    toast.error('Passwords do not match!')
    return
  }
  if (security.value.newPassword.length < 6) {
    toast.error('Password must be at least 6 characters!')
    return
  }
  toast.success('Password changed successfully!')
  security.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}

const checkApiStatus = async () => {
  try {
    await api.get('/health')
    apiStatus.value = true
  } catch {
    apiStatus.value = false
  }
}

onMounted(() => {
  checkApiStatus()
})
</script>

<style scoped>
.settings-view {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--deep-green);
  font-size: 28px;
  margin-bottom: 5px;
}

.page-header h1 i {
  color: var(--gold);
  margin-right: 10px;
}

.page-header p {
  color: var(--text-light);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.settings-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
  transition: transform 0.3s;
}

.settings-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-light);
}

.card-header i {
  font-size: 24px;
  color: var(--gold);
}

.card-header h2 {
  font-size: 18px;
  color: var(--deep-green);
  margin: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 13px;
  color: var(--text-light);
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--gold);
  outline: none;
}

.form-group input[readonly] {
  background: var(--warm-white);
  cursor: not-allowed;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--gold);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.btn-save {
  background: var(--deep-green);
  color: var(--gold);
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.btn-save:hover {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.system-info {
  background: var(--warm-white);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
}

.info-row:last-child {
  border-bottom: none;
}

.info-value {
  font-weight: 600;
  color: var(--deep-green);
}

.info-value.online {
  color: var(--success);
}

.info-value.offline {
  color: var(--danger);
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>