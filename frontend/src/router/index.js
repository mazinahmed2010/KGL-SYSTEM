import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, title: 'Login' }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['Manager', 'Director'],
      title: 'Dashboard'
    }
  },
  {
    path: '/procurement',
    name: 'Procurement',
    component: () => import('@/views/Procurement.vue'),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['Manager'],
      title: 'Procurement'
    }
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('@/views/Sales.vue'),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['Manager', 'Agent'],
      title: 'Sales Terminal'
    }
  },
  {
    path: '/credit',
    name: 'CreditSales',
    component: () => import('@/views/CreditSales.vue'),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['Manager', 'Agent'],
      title: 'Credit Sales'
    }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/views/Inventory.vue'),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['Manager', 'Director'],
      title: 'Inventory Management'
    }
  },
  {
    path: '/director',
    name: 'Director',
    component: () => import('@/views/DirectorView.vue'),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['Director'],
      title: 'Executive Dashboard'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { 
      requiresAuth: true,
      title: 'My Profile'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Settings'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - KGL Enterprise` : 'KGL Enterprise'
  next()
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn
  const userRole = userStore.userRole

  // Allow access to login page always
  if (to.path === '/login') {
    // If already logged in, redirect to appropriate dashboard
    if (isLoggedIn) {
      switch(userRole) {
        case 'Director': next('/director'); break
        case 'Agent': next('/sales'); break
        default: next('/dashboard')
      }
      return
    }
    next()
    return
  }

  // Check authentication for protected routes
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
    return
  }

  // Check role-based authorization
  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
    // Redirect to appropriate default page based on role
    switch(userRole) {
      case 'Manager': next('/dashboard'); break
      case 'Agent': next('/sales'); break
      case 'Director': next('/director'); break
      default: next('/login')
    }
    return
  }

  next()
})

export default router