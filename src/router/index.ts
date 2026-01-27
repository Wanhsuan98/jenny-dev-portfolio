import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/AboutView.vue'),
      meta: { requiresAuth: false, title: 'Jenny.Dev | Portfolio' },
    },
    {
      // 主版面 (包含側邊欄的頁面)
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/HomeView.vue'),
          meta: { requiresAuth: true, title: 'Jenny.Dev | Dashboard' },
        },
        {
          path: 'activity',
          name: 'activity',
          component: () => import('@/views/ActivityView.vue'),
          meta: { requiresAuth: true, title: 'Jenny.Dev | Activities' },
        },
        {
          path: 'projects/:id',
          name: 'project-details',
          component: () => import('@/views/ProjectDetailsView.vue'),
          meta: { requiresAuth: true, title: 'Jenny.Dev | Project Details' },
        },
      ],
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/project/:id',
      name: 'project-public',
      component: () => import('../views/ProjectDetailsView.vue'),
      meta: {
        layout: 'default',
        requiresAuth: false,
      },
    },
    {
      path: '/liff',
      name: 'liff',
      component: () => import('@/views/LiffView.vue'),
      meta: { requiresAuth: false, title: 'Jenny.Dev | Login' },
    },

    // 404 處理
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

const waitForAuthInit = () => {
  return new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      unsubscribe()
      resolve()
    })
  })
}

// 全域路由守衛
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // --- 1. 更新瀏覽器分頁標題 ---
  const pageTitle = (to.meta.title as string) || 'Jenny.Dev'
  document.title = pageTitle

  // --- 2. Auth 初始化檢查 ---
  if (!authStore.isAuthReady) {
    await waitForAuthInit()
    authStore.isAuthReady = true
    if (auth.currentUser) {
      authStore.user = auth.currentUser
    }
  }

  // --- 3. 檢查登入權限 ---
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.user) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
