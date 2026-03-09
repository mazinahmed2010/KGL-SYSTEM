<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Branding with Gold Logo -->
      <div class="login-left">
        <div class="brand-content">
          <!-- Gold Logo on Left -->
          <div class="logo-gold">
            <img src="/KGL-LOGO.png" alt="KGL Logo" class="logo-img-gold">
          </div>
          <h1>Karibu Groceries Ltd</h1>
          <h2>Enterprise Inventory System</h2>
          
          <div class="features">
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>Real-time Inventory Tracking</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>Multi-branch Management</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>Role-based Access Control</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>Credit Sales Management</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>Executive Dashboard</span>
            </div>
          </div>

          <div class="testimonial">
            <i class="fas fa-quote-left"></i>
            <p>This system has transformed how we manage our inventory. From paper books to real-time tracking!</p>
            <div class="testimonial-author">
              <strong>- Mr. Orban, Director</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form with Normal Logo -->
      <div class="login-right">
        <div class="login-card">
          <!-- Normal Logo (Original Colors) -->
          <div class="form-logo">
            <img src="/KGL-LOGO.png" alt="KGL Logo" class="form-logo-normal">
          </div>
          
          <h3>Welcome Back</h3>
          <p class="form-subtitle">Sign in to continue to dashboard</p>

          <!-- API Status -->
          <div class="api-status" :class="{ online: apiStatus, offline: !apiStatus }">
            <i :class="apiStatus ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
            <span>{{ apiStatus ? 'Connected to server' : 'Checking connection...' }}</span>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="login-form">
            <!-- Email Field -->
            <div class="form-group">
              <label><i class="fas fa-envelope"></i> Email Address</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope input-icon"></i>
                <input 
                  v-model="form.email" 
                  type="email" 
                  placeholder="Enter your email"
                  required
                  :class="{ error: errors.email }"
                  @input="validateEmail"
                >
              </div>
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label><i class="fas fa-lock"></i> Password</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  required
                  :class="{ error: errors.password }"
                  @input="validatePassword"
                >
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
            </div>

            <!-- Form Options -->
            <div class="form-options">
              <label class="checkbox">
                <input type="checkbox" v-model="form.rememberMe">
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-password">Forgot Password?</a>
            </div>

            <!-- Error Alert -->
            <div v-if="loginError" class="alert alert-danger">
              <i class="fas fa-exclamation-circle"></i>
              {{ loginError }}
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn-login" 
              :disabled="isSubmitting || !isFormValid"
            >
              <span v-if="isSubmitting" class="spinner"></span>
              <i v-else class="fas fa-sign-in-alt"></i>
              {{ isSubmitting ? 'Logging in...' : 'Sign In' }}
            </button>
          </form>

          <!-- Demo Credentials Section -->
          <div class="demo-section">
            <h4>Demo Credentials</h4>
            <p>Click any card to auto-fill</p>
            <div class="demo-cards">
              <div class="demo-card manager" @click="fillDemoCredentials('manager')">
                <i class="fas fa-user-tie"></i>
                <strong>Manager</strong>
                <span>manager@kgl.com</span>
                <small>••••••••</small>
              </div>
              <div class="demo-card agent" @click="fillDemoCredentials('agent')">
                <i class="fas fa-user"></i>
                <strong>Agent</strong>
                <span>agent@kgl.com</span>
                <small>••••••••</small>
              </div>
              <div class="demo-card director" @click="fillDemoCredentials('director')">
                <i class="fas fa-crown"></i>
                <strong>Director</strong>
                <span>director@kgl.com</span>
                <small>••••••••</small>
              </div>
            </div>
          </div>

          <!-- Footer Links -->
          <div class="login-footer">
            <a href="#">Privacy Policy</a>
            <span class="separator">•</span>
            <a href="#">Terms of Service</a>
            <span class="separator">•</span>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// UI state
const showPassword = ref(false)
const isSubmitting = ref(false)
const apiStatus = ref(false)
const loginError = ref('')
const errors = reactive({
  email: '',
  password: ''
})

// Email validation
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  } else {
    errors.email = ''
  }
}

// Password validation
const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  } else {
    errors.password = ''
  }
}

// Form validity
const isFormValid = computed(() => {
  return !errors.email && !errors.password && form.email && form.password
})

// Check API status
const checkApiStatus = async () => {
  try {
    await api.get('/health')
    apiStatus.value = true
  } catch (error) {
    apiStatus.value = false
  }
}

// Demo credentials
const demoCredentials = {
  manager: {
    email: 'manager@kgl.com',
    password: 'manager123',
    role: 'Manager',
    branch: 'Maganjo'
  },
  agent: {
    email: 'agent@kgl.com',
    password: 'agent123',
    role: 'Agent',
    branch: 'Matugga'
  },
  director: {
    email: 'director@kgl.com',
    password: 'director123',
    role: 'Director',
    branch: 'All'
  }
}

// Fill demo credentials
const fillDemoCredentials = (role) => {
  const creds = demoCredentials[role]
  form.email = creds.email
  form.password = creds.password
  validateEmail()
  validatePassword()
  toast.info(`Demo credentials loaded for ${role}`)
}

// Handle login
const handleLogin = async () => {
  loginError.value = ''
  
  validateEmail()
  validatePassword()
  
  if (!isFormValid.value) {
    loginError.value = 'Please fix the errors above'
    return
  }

  isSubmitting.value = true

  try {
    const response = await api.post('/auth/login', {
      email: form.email,
      password: form.password
    })
    
    const userData = response.data
    userStore.login(userData)
    
    if (form.rememberMe) {
      localStorage.setItem('remembered-email', form.email)
    } else {
      localStorage.removeItem('remembered-email')
    }

    toast.success(`Welcome back, ${userData.name || userData.role}!`)

    // Redirect based on role
    const role = userData.role
    if (role === 'Director') {
      router.push('/director')
    } else if (role === 'Agent') {
      router.push('/sales')
    } else {
      router.push('/dashboard')
    }

  } catch (error) {
    loginError.value = error.response?.data?.message || 'Invalid email or password'
    toast.error(loginError.value)
  } finally {
    isSubmitting.value = false
  }
}

// Check remembered email on mount
onMounted(() => {
  checkApiStatus()
  const rememberedEmail = localStorage.getItem('remembered-email')
  if (rememberedEmail) {
    form.email = rememberedEmail
    form.rememberMe = true
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--deep-green) 0%, var(--dark-green) 100%);
}

.login-container {
  display: flex;
  min-height: 100vh;
}

/* Left Side - Branding */
.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.brand-content {
  max-width: 500px;
  color: white;
}

/* Gold Logo on Left */
.logo-gold {
  margin-bottom: 30px;
  text-align: center;
}

.logo-img-gold {
  max-width: 250px;
  height: auto;
  filter: brightness(0) saturate(100%) invert(82%) sepia(45%) saturate(1000%) hue-rotate(0deg) brightness(105%) contrast(105%);
  animation: glowPulse 3s infinite ease-in-out;
}

@keyframes glowPulse {
  0% { filter: brightness(0) saturate(100%) invert(82%) sepia(45%) saturate(1000%) hue-rotate(0deg) brightness(105%) contrast(105%); }
  50% { filter: brightness(0) saturate(100%) invert(90%) sepia(80%) saturate(2000%) hue-rotate(0deg) brightness(120%) contrast(110%) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5)); }
  100% { filter: brightness(0) saturate(100%) invert(82%) sepia(45%) saturate(1000%) hue-rotate(0deg) brightness(105%) contrast(105%); }
}

.brand-content h1 {
  font-size: 36px;
  margin-bottom: 10px;
  color: var(--gold);
  text-align: center;
}

.brand-content h2 {
  font-size: 20px;
  margin-bottom: 40px;
  font-weight: 400;
  opacity: 0.9;
  text-align: center;
}

.features {
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 16px;
}

.feature-item i {
  color: var(--gold);
  font-size: 20px;
}

.testimonial {
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 10px;
  border-left: 4px solid var(--gold);
}

.testimonial i {
  color: var(--gold);
  font-size: 24px;
  margin-bottom: 10px;
  display: block;
}

.testimonial p {
  font-style: italic;
  margin-bottom: 15px;
  line-height: 1.6;
}

.testimonial-author {
  color: var(--gold);
}

/* Right Side - Login Form */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

/* Normal Logo on Right (Original Colors) */
.form-logo {
  text-align: center;
  margin-bottom: 20px;
}

.form-logo-normal {
  max-width: 120px;
  height: auto;
  /* No filter - original logo colors */
  transition: transform 0.3s ease;
}

.form-logo-normal:hover {
  transform: scale(1.05);
}

.login-card h3 {
  text-align: center;
  color: var(--deep-green);
  font-size: 28px;
  margin-bottom: 5px;
}

.form-subtitle {
  text-align: center;
  color: var(--text-light);
  margin-bottom: 25px;
}

/* API Status */
.api-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: var(--warm-white);
  border-radius: 8px;
  margin-bottom: 25px;
  font-size: 14px;
  border-left: 4px solid;
}

.api-status.online {
  border-left-color: var(--success);
  color: var(--success);
}

.api-status.offline {
  border-left-color: var(--danger);
  color: var(--danger);
}

/* Form Styles */
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

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gold);
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.input-wrapper input.error {
  border-color: var(--danger);
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
  padding: 5px;
}

.password-toggle:hover {
  color: var(--gold);
}

.error-message {
  color: var(--danger);
  font-size: 12px;
  margin-top: 5px;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-light);
  font-size: 14px;
}

.checkbox input[type="checkbox"] {
  width: auto;
}

.forgot-password {
  color: var(--deep-green);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: var(--gold);
}

/* Alert */
.alert {
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-danger {
  background: #f8d7da;
  color: #721c24;
  border-left: 4px solid var(--danger);
}

/* Login Button */
.btn-login {
  width: 100%;
  background: var(--deep-green);
  color: var(--gold);
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-login:hover:not(:disabled) {
  background: var(--dark-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 77, 62, 0.3);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
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

/* Demo Section */
.demo-section {
  margin-top: 30px;
  text-align: center;
}

.demo-section h4 {
  color: var(--deep-green);
  margin-bottom: 5px;
}

.demo-section p {
  color: var(--text-light);
  font-size: 13px;
  margin-bottom: 15px;
}

.demo-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.demo-card {
  background: var(--warm-white);
  padding: 15px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.demo-card:hover {
  transform: translateY(-3px);
  border-color: var(--gold);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.demo-card i {
  font-size: 24px;
  margin-bottom: 5px;
}

.demo-card.manager i {
  color: var(--deep-green);
}

.demo-card.agent i {
  color: var(--gold);
}

.demo-card.director i {
  color: #9b59b6;
}

.demo-card strong {
  color: var(--deep-green);
  font-size: 14px;
}

.demo-card span {
  color: var(--text-light);
  font-size: 11px;
}

.demo-card small {
  color: #999;
  font-size: 10px;
}

/* Login Footer */
.login-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 13px;
}

.login-footer a {
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.3s;
}

.login-footer a:hover {
  color: var(--gold);
}

.separator {
  color: var(--border-light);
  margin: 0 8px;
}

/* Responsive */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-left {
    display: none;
  }
  
  .login-right {
    padding: 20px;
  }
  
  .demo-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 20px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>