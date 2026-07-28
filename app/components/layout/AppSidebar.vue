<script setup lang="ts">
import { User, Briefcase, BookOpen, ShieldCheck } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])
const route = useRoute()

const isActive = (path: string) => {
  if (path === '/') return route.path === '/' || route.path === '/about'
  return route.path.startsWith(path)
}

const getLinkClass = (path: string) => {
  return ['nav-item', 'group', isActive(path) ? 'nav-item-active' : 'nav-item-inactive']
}
</script>

<template>
  <aside class="layout-sidebar" :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
    <div class="layout-sidebar-header flex items-center justify-between px-6">
      <div class="flex items-center gap-2">
        <div class="sidebar-logo-container">
          <span class="text-white font-bold text-lg">J</span>
        </div>
        <span class="text-lg font-bold tracking-wide text-slate-100"
          >Jenny Lin . <span class="text-cyan-600 dark:text-cyan-400"> Dev</span></span
        >
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-6">
      <div class="space-y-1">
        <div class="nav-label">個人品牌</div>

        <NuxtLink to="/" @click="emit('close')" :class="getLinkClass('/')">
          <User class="w-5 h-5" />
          <span class="font-medium">個人履歷</span>
        </NuxtLink>

        <NuxtLink to="/projects" @click="emit('close')" :class="getLinkClass('/projects')">
          <Briefcase class="w-5 h-5" />
          <span class="font-medium">專案與技術</span>
        </NuxtLink>

        <NuxtLink to="/reports" @click="emit('close')" :class="getLinkClass('/reports')">
          <BookOpen class="w-5 h-5" />
          <span class="font-medium">深度研究</span>
        </NuxtLink>

        <NuxtLink to="/standards" @click="emit('close')" :class="getLinkClass('/standards')">
          <ShieldCheck class="w-5 h-5" />
          <span class="font-medium">開發標準</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-xs text-slate-500">© 2025 Jenny</span>
          <span class="text-[10px] text-slate-600">v1.0.0 Dev</span>
        </div>
      </div>
    </div>
  </aside>
</template>
