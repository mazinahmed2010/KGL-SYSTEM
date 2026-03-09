<template>
  <div class="profile-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1><i class="fas fa-user-circle"></i> My Profile</h1>
      <div class="breadcrumb">
        <router-link to="/dashboard">Dashboard</router-link>
        <i class="fas fa-chevron-right"></i>
        <span>Profile</span>
      </div>
    </div>

    <div class="profile-container">
      <!-- Profile Sidebar -->
      <div class="profile-sidebar">
        <div class="profile-card">
          <div class="profile-avatar">
            <i class="fas fa-user-circle"></i>
            <div class="avatar-badge" v-if="userStore.isManager">
              <i class="fas fa-crown"></i>
            </div>
          </div>
          <h2>{{ userStore.userName }}</h2>
          <p class="profile-email">{{ userStore.userEmail }}</p>
          
          <div class="profile-role" :class="userStore.userRole?.toLowerCase()">
            <i :class="roleIcon"></i>
            <span>{{ userStore.userRole }}</span>
          </div>

          <div class="profile-branch" v-if="!userStore.isDirector">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ userStore.userBranch }} Branch</span>
          </div>

          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-label">Member Since</span>
              <span class="stat-value">{{ memberSince }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Last Login</span>
              <span class="stat-value">{{ lastLogin }}</span>
            </div>
          </div>

          <div class="profile-actions">
            <button class="btn-edit" @click="editMode = true" v-if="!editMode">
              <i class="fas fa-edit"></i> Edit Profile
            </button>
            <button class="btn-change-password" @click="showPasswordModal = true">
              <i class="fas fa-key"></i> Change Password
            </button>
          </div>
        </div>

        <!-- Activity Summary -->
        <div class="activity-card">
          <h3><i class="fas fa-chart-line"></i> Activity Summary</h3>
          <div class="activity-stats">
            <div class="activity-item">
              <span class="activity-label">Sales Today</span>
              <span class="activity-value">12</span>
            </div>
            <div class="activity-item">
              <span class="activity-label">This Week</span>
              <span class="activity-value">64</span>
            </div>
            <div class="activity-item">
              <span class="activity-label">This Month</span>
              <span class="activity-value">248</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Main Content -->
      <div class="profile-main">
        <!-- Edit Profile Form -->
        <div class="profile-section" v-if="editMode">
          <div class="section-header">
            <h2><i class="fas fa-edit"></i> Edit Profile</h2>
            <button class="btn-cancel" @click="cancelEdit">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>

          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="form-group">
              <label><i class="fas fa-user"></i> Full Name</label>
              <input 
                v-model="profileForm.name" 
                type="text" 
                placeholder="Enter your full name"
                required
                minlength="2"
              >
            </div>

            <div class="form-group">
              <label><i class="fas fa-envelope"></i> Email Address</label>
              <input 
                v-model="profileForm.email" 
                type="email" 
                placeholder="Enter your email"
                required
                :disabled="true"
                class="readonly-field"
              >
              <small class="field-hint">Email cannot be changed</small>
            </div>

            <div class="form-group">
              <label><i class="fas fa-phone"></i> Phone Number</label>
              <input 
                v-model="profileForm.phone" 
                type="tel" 
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
              >
            </div>

            <div class="form-group" v-if="!userStore.isDirector">
              <label><i class="fas fa-map-marker-alt"></i> Default Branch</label>
              <select v-model="profileForm.branch">
                <option value="Maganjo">Maganjo Branch</option>
                <option value="Matugga">Matugga Branch</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fas fa-bell"></i> Notification Preferences</label>
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" v-model="profileForm.notifications.email">
                  <span>Email notifications</span>
                </label>
                <label class="checkbox">
                  <input type="checkbox" v-model="profileForm.notifications.sms">
                  <span>SMS alerts</span>
                </label>
                <label class="checkbox">
                  <input type="checkbox" v-model="profileForm.notifications.desktop">
                  <span>Desktop notifications</span>
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save" :disabled="isSaving">
                <span v-if="isSaving" class="spinner"></span>
                <i v-else class="fas fa-save"></i>
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button type="button" class="btn-cancel" @click="cancelEdit">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Profile Information Display -->
        <div class="profile-section" v-else>
          <div class="section-header">
            <h2><i class="fas fa-info-circle"></i> Personal Information</h2>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Full Name</span>
              <span class="info-value">{{ userStore.userName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email Address</span>
              <span class="info-value">{{ userStore.userEmail }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone Number</span>
              <span class="info-value">{{ profileForm.phone || 'Not provided' }}</span>
            </div>
            <div class="info-item" v-if="!userStore.isDirector">
              <span class="info-label">Default Branch</span>
              <span class="info-value">{{ profileForm.branch || userStore.userBranch }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Role</span>
              <span class="info-value role-badge" :class="userStore.userRole?.toLowerCase()">
                {{ userStore.userRole }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Account Status</span>
              <span class="info-value status-active">
                <i class="fas fa-check-circle"></i> Active
              </span>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="profile-section">
          <div class="section-header">
            <h2><i class="fas fa-bell"></i> Notification Settings</h2>
          </div>

          <div class="notification-settings">
            <div class="setting-item">
              <div class="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive updates and alerts via email</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="profileForm.notifications.email">
                <span class="slider round"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h4>SMS Alerts</h4>
                <p>Get text messages for low stock alerts</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="profileForm.notifications.sms">
                <span class="slider round"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Desktop Notifications</h4>
                <p>Browser notifications when you're online</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="profileForm.notifications.desktop">
                <span class="slider round"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Low Stock Alerts</h4>
                <p>Notify when products fall below 1000kg</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="profileForm.notifications.lowStock" checked>
                <span class="slider round"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Daily Summary</h4>
                <p>Receive end-of-day sales report</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="profileForm.notifications.dailySummary">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="profile-section">
          <div class="section-header">
            <h2><i class="fas fa-history"></i> Recent Activity</h2>
            <router-link to="/dashboard" class="view-all">
              View Dashboard <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>

          <div class="activity-timeline">
            <div v-for="activity in recentActivities" :key="activity.id" class="timeline-item">
              <div class="timeline-icon" :class="activity.type">
                <i :class="activity.icon"></i>
              </div>
              <div class="timeline-content">
                <p class="activity-title">{{ activity.title }}</p>
                <p class="activity-description">{{ activity.description }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-key"></i> Change Password</h3>
          <button class="modal-close" @click="closePasswordModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="changePassword" class="modal-form">
          <div class="form-group">
            <label>Current Password</label>
            <div class="password-input">
              <input 
                v-model="passwordForm.currentPassword" 
                :type="showCurrent ? 'text' : 'password'"
                placeholder="Enter current password"
                required
              >
              <button type="button" class="password-toggle" @click="showCurrent = !showCurrent">
                <i :class="showCurrent ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>New Password</label>
            <div class="password-input">
              <input 
                v-model="passwordForm.newPassword" 
                :type="showNew ? 'text' : 'password'"
                placeholder="Enter new password"
                required
                minlength="6"
                @input="checkPasswordStrength"
              >
              <button type="button" class="password-toggle" @click="showNew = !showNew">
                <i :class="showNew ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="password-strength" v-if="passwordForm.newPassword">
              <div class="strength-bar" :class="passwordStrengthClass"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Confirm New Password</label>
            <div class="password-input">
              <input 
                v-model="passwordForm.confirmPassword" 
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Confirm new password"
                required
              >
              <button type="button" class="password-toggle" @click="showConfirm = !showConfirm">
                <i :class="showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="passwordMismatch" class="error-message">
              Passwords do not match
            </div>
          </div>

          <div class="password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li :class="{ met: hasMinLength }">
                <i :class="hasMinLength ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                At least 6 characters
              </li>
              <li :class="{ met: hasUpperCase }">
                <i :class="hasUpperCase ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                One uppercase letter
              </li>
              <li :class="{ met: hasLowerCase }">
                <i :class="hasLowerCase ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                One lowercase letter
              </li>
              <li :class="{ met: hasNumber }">
                <i :class="hasNumber ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                One number
              </li>
            </ul>
          </div>

          <div class="modal-actions">
            <button 
              type="submit" 
              class="btn-primary" 
              :disabled="!isPasswordValid || isChanging"
            >
              <span v-if="isChanging" class="spinner"></span>
              <i v-else class="fas fa-save"></i>
              {{ isChanging ? 'Changing...' : 'Change Password' }}
            </button>
            <button type="button" class="btn-secondary" @click="closePasswordModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()

// State
const editMode = ref(false)
const isSaving = ref(false)
const showPasswordModal = ref(false)
const isChanging = ref(false)
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

// Profile form
const profileForm = reactive({
  name: userStore.userName,
  email: userStore.userEmail,
  phone: '',
  branch: userStore.userBranch,
  notifications: {
    email: true,
    sms: false,
    desktop: true,
    lowStock: true,
    dailySummary: false
  }
})

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Computed properties
const memberSince = computed(() => {
  return 'January 2024'
})

const lastLogin = computed(() => {
  return 'Today, 09:30 AM'
})

const roleIcon = computed(() => {
  const icons = {
    Manager: 'fas fa-user-tie',
    Agent: 'fas fa-user',
    Director: 'fas fa-crown'
  }
  return icons[userStore.userRole] || 'fas fa-user'
})

// Password validation
const hasMinLength = computed(() => passwordForm.newPassword.length >= 6)
const hasUpperCase = computed(() => /[A-Z]/.test(passwordForm.newPassword))
const hasLowerCase = computed(() => /[a-z]/.test(passwordForm.newPassword))
const hasNumber = computed(() => /\d/.test(passwordForm.newPassword))

const passwordStrength = computed(() => {
  let score = 0
  if (hasMinLength.value) score++
  if (hasUpperCase.value) score++
  if (hasLowerCase.value) score++
  if (hasNumber.value) score++
  return score
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'weak'
  if (strength <= 2) return 'fair'
  if (strength <= 3) return 'good'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'Weak'
  if (strength <= 2) return 'Fair'
  if (strength <= 3) return 'Good'
  return 'Strong'
})

const passwordMismatch = computed(() => {
  return passwordForm.newPassword && passwordForm.confirmPassword && 
         passwordForm.newPassword !== passwordForm.confirmPassword
})

const isPasswordValid = computed(() => {
  return hasMinLength.value && hasUpperCase.value && 
         hasLowerCase.value && hasNumber.value &&
         !passwordMismatch.value &&
         passwordForm.currentPassword
})

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'sale',
    icon: 'fas fa-cash-register',
    title: 'Sale Recorded',
    description: 'Sold 500kg Beans to John Doe',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'login',
    icon: 'fas fa-sign-in-alt',
    title: 'Login',
    description: 'Logged in from Maganjo Branch',
    time: '5 hours ago'
  },
  {
    id: 3,
    type: 'procurement',
    icon: 'fas fa-truck-loading',
    title: 'Procurement',
    description: 'Added 2000kg Maize',
    time: 'Yesterday'
  },
  {
    id: 4,
    type: 'settings',
    icon: 'fas fa-cog',
    title: 'Settings Updated',
    description: 'Changed notification preferences',
    time: '2 days ago'
  }
])

// Methods
const cancelEdit = () => {
  editMode.value = false
  profileForm.name = userStore.userName
  profileForm.phone = ''
  profileForm.branch = userStore.userBranch
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Profile updated successfully')
    editMode.value = false
  } catch (error) {
    toast.error('Failed to update profile')
  } finally {
    isSaving.value = false
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  showCurrent.value = false
  showNew.value = false
  showConfirm.value = false
}

const changePassword = async () => {
  if (!isPasswordValid.value) return
  
  isChanging.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Password changed successfully')
    closePasswordModal()
  } catch (error) {
    toast.error('Failed to change password')
  } finally {
    isChanging.value = false
  }
}

const checkPasswordStrength = () => {
  // Validation happens via computed properties
}
</script>

<style scoped>
.profile-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: 25px;
}

.page-header h1 {
  font-size: 28px;
  color: var(--deep-green);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.page-header h1 i {
  color: var(--gold);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-light);
}

.breadcrumb a {
  color: var(--deep-green);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--gold);
}

.breadcrumb i {
  font-size: 10px;
  color: var(--gold);
}

/* Profile Container */
.profile-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 25px;
}

/* Profile Sidebar */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  background: white;
  border-radius: 15px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.profile-avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
}

.profile-avatar i {
  font-size: 100px;
  color: var(--deep-green);
}

.avatar-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: var(--gold);
  color: var(--deep-green);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border: 3px solid white;
}

.profile-card h2 {
  color: var(--deep-green);
  margin-bottom: 5px;
  font-size: 22px;
}

.profile-email {
  color: var(--text-light);
  margin-bottom: 15px;
  font-size: 14px;
}

.profile-role {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 15px;
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

.profile-branch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background: var(--warm-white);
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.profile-branch i {
  color: var(--gold);
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-light);
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--deep-green);
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-edit, .btn-change-password {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-edit {
  background: var(--deep-green);
  color: var(--gold);
}

.btn-edit:hover {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.btn-change-password {
  background: var(--warm-white);
  color: var(--deep-green);
  border: 2px solid var(--border-light);
}

.btn-change-password:hover {
  border-color: var(--gold);
  transform: translateY(-2px);
}

/* Activity Card */
.activity-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.activity-card h3 {
  color: var(--deep-green);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.activity-card h3 i {
  color: var(--gold);
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.activity-item {
  text-align: center;
  padding: 10px;
  background: var(--warm-white);
  border-radius: 8px;
}

.activity-label {
  display: block;
  font-size: 11px;
  color: var(--text-light);
  margin-bottom: 5px;
}

.activity-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--deep-green);
}

/* Profile Main */
.profile-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--gold);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  color: var(--deep-green);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header h2 i {
  color: var(--gold);
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-size: 12px;
  color: var(--text-light);
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-dark);
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  width: fit-content;
}

.status-active {
  color: var(--success);
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Profile Form */
.profile-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--deep-green);
  font-weight: 600;
  font-size: 14px;
}

.form-group label i {
  color: var(--gold);
  margin-right: 8px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--gold);
}

.readonly-field {
  background: var(--warm-white);
  cursor: not-allowed;
}

.field-hint {
  display: block;
  font-size: 11px;
  color: var(--text-light);
  margin-top: 5px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox input[type="checkbox"] {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn-save {
  background: var(--deep-green);
  color: var(--gold);
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: none;
  border: 2px solid var(--border-light);
  color: var(--text-light);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-cancel:hover {
  border-color: var(--danger);
  color: var(--danger);
}

/* Notification Settings */
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--warm-white);
  border-radius: 8px;
}

.setting-info h4 {
  color: var(--deep-green);
  margin-bottom: 5px;
  font-size: 15px;
}

.setting-info p {
  color: var(--text-light);
  font-size: 13px;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--deep-green);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--deep-green);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Activity Timeline */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.timeline-item {
  display: flex;
  gap: 15px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.3s;
}

.timeline-item:hover {
  background: var(--warm-white);
}

.timeline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.timeline-icon.sale {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success);
}

.timeline-icon.login {
  background: rgba(23, 162, 184, 0.1);
  color: var(--info);
}

.timeline-icon.procurement {
  background: rgba(27, 77, 62, 0.1);
  color: var(--deep-green);
}

.timeline-icon.settings {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning);
}

.timeline-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 3px;
}

.activity-description {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 3px;
}

.activity-time {
  font-size: 11px;
  color: #999;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-header h3 {
  color: var(--deep-green);
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h3 i {
  color: var(--gold);
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-light);
  cursor: pointer;
}

.modal-close:hover {
  color: var(--danger);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
}

/* Password Strength */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 5px;
  transition: all 0.3s;
}

.strength-bar.weak {
  width: 25%;
  background: var(--danger);
}

.strength-bar.fair {
  width: 50%;
  background: var(--warning);
}

.strength-bar.good {
  width: 75%;
  background: #3498db;
}

.strength-bar.strong {
  width: 100%;
  background: var(--success);
}

.strength-text {
  font-size: 12px;
  color: var(--text-light);
}

.password-requirements {
  background: var(--warm-white);
  padding: 15px;
  border-radius: 8px;
}

.password-requirements p {
  font-weight: 600;
  color: var(--deep-green);
  margin-bottom: 10px;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  font-size: 13px;
  color: var(--text-light);
}

.password-requirements li.met {
  color: var(--success);
}

.password-requirements li i {
  font-size: 12px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-primary {
  flex: 2;
  background: var(--deep-green);
  color: var(--gold);
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  flex: 1;
  background: none;
  border: 2px solid var(--border-light);
  color: var(--text-light);
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.error-message {
  color: var(--danger);
  font-size: 12px;
  margin-top: 5px;
}

.spinner {
  border: 2px solid var(--warm-white);
  border-top: 2px solid var(--gold);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 10px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .setting-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>