<script setup lang="ts">
import { computed } from 'vue'
import { Menu, Moon, Sun, LogIn, LayoutDashboard, Home } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])
const authStore = useAuthStore()
const route = useRoute()

const isPublicRoute = computed(() => {
  return ['index', 'projects', 'reports', 'standards'].includes(route.name as string)
})

const navItems = [
  { path: '/', label: '首頁', icon: Home },
  { path: '/projects', label: '專案與技術' },
  { path: '/reports', label: '深度研究' },
  { path: '/standards', label: '開發標準' },
]

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
</script>

<template>
  <header class="layout-header overflow-visible">
    <!-- 頂部光暈線 -->
    <div class="header-glow-line"></div>

    <div class="header-side-wrapper">
      <button v-if="!isPublicRoute" @click="emit('toggle-sidebar')" class="btn-mode-toggle">
        <Menu class="h-6 w-6" />
      </button>

      <h2 class="header-logo-container group" :class="{ 'md:hidden': !isPublicRoute }">
        <template v-if="authStore.user && !isPublicRoute"> 控制台 </template>

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
    <div v-if="isPublicRoute" class="header-center-area">
      <!-- 主導覽列 -->
      <nav class="header-nav-dock">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :title="item.label"
          :aria-label="item.icon ? item.label : undefined"
          class="header-nav-dock-btn group/nav"
          :class="item.icon ? 'flex items-center justify-center w-9 px-0' : ''"
        >
          <component :is="item.icon" v-if="item.icon" class="w-4 h-4" />
          <template v-else>{{ item.label }}</template>
        </NuxtLink>
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
        <NuxtLink v-if="isPublicRoute" to="/dashboard" class="group header-btn-secondary">
          <LayoutDashboard class="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span class="pt-[1px]">控制台</span>
        </NuxtLink>

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
        <NuxtLink to="/login" class="header-btn-primary">
          <LogIn class="w-3.5 h-3.5" />
          <span class="pt-[1px]">登入</span>
        </NuxtLink>
      </template>
    </div>
  </header>
</template>
