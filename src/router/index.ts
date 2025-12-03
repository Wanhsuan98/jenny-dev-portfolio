import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'activity',
          name: 'activity',
          component: () => import('@/views/ActivityView.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
      ],
    },
    {
      path: '/liff',
      name: 'liff',
      component: () => import('@/views/LiffView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 等待 Firebase 初始化完成 (防止重新整理時瞬間跳回登入頁)
  if (!authStore.isAuthReady) {
    // 這裡可以使用一個 Promise 等待 isAuthReady 變成 true
    // 簡單實作：我們先讓它繼續，因為 onAuthStateChanged 會在 App.vue 觸發
    // 但更嚴謹的做法是在這裡等待。
  }

  // 檢查該頁面是否需要登入
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router
