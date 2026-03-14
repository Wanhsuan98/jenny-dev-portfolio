<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { Menu, Moon, Sun, LogIn, LayoutDashboard, Cpu } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])
const authStore = useAuthStore()
const route = useRoute()

// --- 滾動功能 ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

// --- 使用者資訊 ---
// const displayRole = computed(() => {
//   if (!authStore.role) return 'Guest'
//   return authStore.role.charAt(0).toUpperCase() + authStore.role.slice(1)
// })

const avatarLetter = computed(() => {
  if (authStore.user && authStore.user.email) {
    return authStore.user.email.charAt(0).toUpperCase()
  }
  return '?'
})

const { isDark, toggleDark } = useTheme()

const liveStatus = {
  stack: 'Vue 3 • Nuxt 3, 4 • TypeScript • Tailwind CSS',
}
</script>

<template>
  <header class="layout-header overflow-visible">
    <!-- 頂部光暈線 -->
    <div class="header-glow-line"></div>

    <div class="header-side-wrapper">
      <button
        v-if="route.name !== 'landing'"
        @click="emit('toggle-sidebar')"
        class="btn-mode-toggle"
      >
        <Menu class="h-6 w-6" />
      </button>

      <h2 class="header-logo-container group" :class="{ 'md:hidden': route.name !== 'landing' }">
        <template v-if="authStore.user && route.name !== 'landing'"> 控制台 </template>

        <template v-else>
          <span class="header-logo-span">Jenny </span>
          <span class="relative">
            <span class="header-logo-accent">Lin</span>
            <span class="header-logo-underline"></span>
          </span>
          <span class="header-logo-suffix"> .Dev</span>
        </template>
      </h2>
    </div>

    <!-- 核心內容 -->
    <div v-if="route.name === 'landing'" class="header-center-area">
      <!-- 即時動態 -->
      <div class="hidden xl:flex items-center gap-3 mr-4">
        <div class="header-live-status">
          <Cpu class="w-3.5 h-3.5 text-indigo-400" />
          <span class="header-live-status-text">{{ liveStatus.stack }}</span>
        </div>
      </div>

      <!-- 主導覽列 -->
      <nav class="header-nav-dock">
        <button
          v-for="(item, key) in {
            'dashboard-hero': '技術脈動',
            showcase: '專案與技術',
            'research-reports': '深度研究',
            'engineering-standards': '開發標準',
            experience: '經歷',
          }"
          :key="key"
          @click="scrollToSection(key)"
          class="header-nav-dock-btn group/nav"
        >
          {{ item }}
        </button>
      </nav>
    </div>

    <div class="header-side-wrapper">
      <button
        @click="toggleDark"
        class="header-theme-toggle"
        :title="isDark ? '切換為亮色' : '切換為暗色'"
      >
        <Moon v-if="isDark" class="h-5 w-5" />
        <Sun v-else class="h-5 w-5" />
      </button>

      <div class="header-v-divider"></div>

      <template v-if="authStore.user">
        <RouterLink
          v-if="route.name === 'landing'"
          to="/dashboard"
          class="group header-btn-secondary"
        >
          <LayoutDashboard class="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span class="pt-[1px]">控制台</span>
        </RouterLink>

        <div v-else class="flex items-center gap-3">
          <span class="text-xs text-slate-500 font-mono hidden sm:inline-block">
            {{ authStore.user?.email?.split('@')[0] || '' }}
          </span>
          <div class="header-avatar-mini">
            {{ avatarLetter }}
          </div>
        </div>
      </template>

      <template v-else>
        <RouterLink to="/login" class="header-btn-primary">
          <LogIn class="w-3.5 h-3.5" />
          <span class="pt-[1px]">登入</span>
        </RouterLink>
      </template>
    </div>
  </header>
</template>
