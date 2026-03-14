<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const isSidebarOpen = ref(window.innerWidth >= 768)
</script>

<template>
  <div class="layout-root">
    <div v-if="isSidebarOpen" class="layout-backdrop" @click="isSidebarOpen = false"></div>

    <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <main class="layout-main" :class="isSidebarOpen ? 'md:pl-64' : 'pl-0'">
      <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <div class="layout-content flex flex-col min-h-screen">
        <div class="flex-1">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
        <AppFooter minimal />
      </div>
    </main>
  </div>
</template>
