<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import BaseToast from '@/components/BaseToast.vue'
import BaseConfirm from '@/components/BaseConfirm.vue'

const authStore = useAuthStore()
const toast = useToastStore()

// --- 閒置自動登出設定 ---
// 1 小時
const TIMEOUT_DURATION = 60 * 60 * 1000

let inactivityTimer: ReturnType<typeof setTimeout>

// 重置計時器
const resetTimer = () => {
  if (!authStore.user) return

  if (inactivityTimer) clearTimeout(inactivityTimer)

  inactivityTimer = setTimeout(() => {
    toast.warning('由於您閒置時間過長，系統已自動登出以確保安全。')
    authStore.logout()
  }, TIMEOUT_DURATION)
}

// 設定監聽器
const setupActivityListeners = () => {
  window.addEventListener('mousemove', resetTimer)
  window.addEventListener('mousedown', resetTimer)
  window.addEventListener('keypress', resetTimer)
  window.addEventListener('scroll', resetTimer)
  window.addEventListener('touchstart', resetTimer)

  resetTimer()
}

// 移除監聽器
const removeActivityListeners = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer)
  window.removeEventListener('mousemove', resetTimer)
  window.removeEventListener('mousedown', resetTimer)
  window.removeEventListener('keypress', resetTimer)
  window.removeEventListener('scroll', resetTimer)
  window.removeEventListener('touchstart', resetTimer)
}

// 監聽使用者狀態變化
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      setupActivityListeners()
    } else {
      removeActivityListeners()
    }
  },
)

onMounted(() => {
  authStore.initAuth()

  // 登入頁主題判斷
  const userTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (userTheme === 'dark' || (!userTheme && systemDark)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

onUnmounted(() => {
  removeActivityListeners()
})
</script>

<template>
  <RouterView />
  <BaseToast />
  <BaseConfirm />
</template>
