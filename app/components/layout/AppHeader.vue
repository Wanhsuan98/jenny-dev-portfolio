<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Menu, X, Moon, Sun, Home } from 'lucide-vue-next'

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

const { isDark, toggleDark } = useTheme()

// 手機版導覽選單:桌機版有固定顯示的導覽列,手機版收合後改用此選單開關
const isMobileNavOpen = ref(false)
watch(
  () => route.fullPath,
  () => {
    isMobileNavOpen.value = false
  },
)
</script>

<template>
  <header class="layout-header overflow-visible">
    <!-- 頂部光暈線 -->
    <div class="header-glow-line"></div>

    <div class="header-side-wrapper">
      <NuxtLink to="/" :class="{ 'md:hidden': !isPublicRoute }">
        <h2 class="header-logo-container group">
          <span class="header-logo-span">Jenny </span>
          <span class="relative">
            <span class="header-logo-accent">Lin</span>
            <span class="header-logo-underline"></span>
          </span>
          <span class="header-logo-suffix"> .Dev</span>
        </h2>
      </NuxtLink>
    </div>

    <!-- 核心內容 -->
    <div v-if="isPublicRoute" class="header-center-area">
      <!-- 主導覽列 -->
      <nav class="header-nav-dock" aria-label="主要導覽">
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

      <button
        @click="isMobileNavOpen = !isMobileNavOpen"
        class="header-mobile-nav-toggle"
        aria-controls="mobile-nav-panel"
        :aria-expanded="isMobileNavOpen"
        :aria-label="isMobileNavOpen ? '關閉導覽選單' : '開啟導覽選單'"
      >
        <X v-if="isMobileNavOpen" class="h-5 w-5" />
        <Menu v-else class="h-5 w-5" />
      </button>

      <div class="header-v-divider"></div>
    </div>

    <!-- 手機版下拉導覽選單 -->
    <nav
      v-if="isMobileNavOpen"
      id="mobile-nav-panel"
      aria-label="手機導覽"
      class="header-mobile-nav-panel"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="header-mobile-nav-link"
      >
        <component :is="item.icon" v-if="item.icon" class="w-4 h-4" />
        {{ item.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
