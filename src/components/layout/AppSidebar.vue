<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRoute } from 'vue-router'

// props
defineProps<{
  isOpen: boolean
}>()

// emit
const emit = defineEmits(['close'])

const authStore = useAuthStore()
const route = useRoute()

const navItems = [
  { name: '專案總覽', path: '/' },
  { name: '活動監控 (Live)', path: '/activity' },
  { name: '個人履歷', path: '/about' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="layout-sidebar"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <div class="layout-sidebar-header">
      <span class="text-xl font-bold tracking-wider">Frontend Hub</span>
      <button
        @click="emit('close')"
        class="absolute right-4 text-slate-400 hover:text-white md:hidden"
      >
        ✕
      </button>
    </div>

    <nav class="flex-1 px-2 py-4 space-y-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="emit('close')"
        class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
        :class="[
          isActive(item.path)
            ? 'bg-primary-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        ]"
      >
        <span class="font-medium">{{ item.name }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-slate-700">
      <div class="flex items-center justify-between">
        <span class="text-xs text-slate-500">© 2025 Jenny</span>
        <button
          @click="authStore.logout"
          class="text-xs text-slate-400 hover:text-white transition-colors"
        >
          登出
        </button>
      </div>
    </div>
  </aside>
</template>
