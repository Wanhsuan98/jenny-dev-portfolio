<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isSidebarOpen = ref(false)

onMounted(() => {
  isSidebarOpen.value = window.innerWidth >= 768
})
</script>

<template>
  <div class="layout-root">
    <div v-if="isSidebarOpen" class="layout-backdrop" @click="isSidebarOpen = false"></div>

    <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <main class="layout-main" :class="isSidebarOpen ? 'md:pl-64' : 'pl-0'">
      <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <div class="layout-content flex flex-col min-h-screen">
        <div class="flex-1">
          <slot />
        </div>
        <AppFooter minimal />
      </div>
    </main>
  </div>
</template>
