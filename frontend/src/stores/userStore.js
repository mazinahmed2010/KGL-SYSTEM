import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const token = ref(localStorage.getItem('kgl-token') || '')

  function login(userData) {
    currentUser.value = {
      id: userData.id || Date.now(),
      email: userData.email,
      role: userData.role,
      branch: userData.branch || 'Maganjo',
      name: userData.name || userData.email?.split('@')[0] || 'User',
      token: userData.token
    }
    
    token.value = userData.token
    localStorage.setItem('kgl-token', userData.token)
    localStorage.setItem('kgl-user', JSON.stringify(currentUser.value))
  }

  function logout() {
    currentUser.value = null
    token.value = ''
    localStorage.removeItem('kgl-token')
    localStorage.removeItem('kgl-user')
  }

  function setBranch(newBranch) {
    if (currentUser.value) {
      currentUser.value.branch = newBranch
      localStorage.setItem('kgl-user', JSON.stringify(currentUser.value))
    }
  }

  function restoreSession() {
    const savedUser = localStorage.getItem('kgl-user')
    if (savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser)
        token.value = currentUser.value.token || ''
      } catch (e) {
        console.error('Failed to restore session:', e)
        logout()
      }
    }
  }

  const isLoggedIn = computed(() => currentUser.value !== null)
  const userRole = computed(() => currentUser.value?.role || null)
  const userEmail = computed(() => currentUser.value?.email || null)
  const userName = computed(() => currentUser.value?.name || 'Guest')
  const userBranch = computed(() => currentUser.value?.branch || 'Maganjo')
  
  const isManager = computed(() => currentUser.value?.role === 'Manager')
  const isAgent = computed(() => currentUser.value?.role === 'Agent')
  const isDirector = computed(() => currentUser.value?.role === 'Director')

  return {
    currentUser,
    token,
    login,
    logout,
    setBranch,
    restoreSession,
    isLoggedIn,
    userRole,
    userEmail,
    userName,
    userBranch,
    isManager,
    isAgent,
    isDirector
  }
})