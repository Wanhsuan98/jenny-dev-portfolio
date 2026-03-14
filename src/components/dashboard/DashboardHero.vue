<script setup lang="ts">
import { Activity, Terminal, Layers } from 'lucide-vue-next'
import BaseRadarChart from '@/components/BaseRadarChart.vue'

import type { Component } from 'vue'
import type { ProfileData } from '@/types/profile'
import type { ChartData, ChartOptions } from 'chart.js'

const props = defineProps<{
  profile: ProfileData
  socialLinks: { name: string; url: string; icon: Component; hoverClass: string }[]
  skillData: ChartData<'radar'> | null
  skillOptions?: ChartOptions<'radar'>
}>()
</script>

<template>
  <section id="dashboard-hero" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
    <!-- 個人資料 -->
    <div class="lg:col-span-7 space-y-6">
      <div class="flex items-center gap-4">
        <div class="relative group shrink-0">
          <img src="/public/avatar.jpg" class="db-hero-avatar" alt="Avatar" />
          <div class="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg">
            <Activity class="w-4 h-4" />
          </div>
        </div>
        <div>
          <h1 class="db-hero-name">
            {{ props.profile.basicInfo.name }}
          </h1>
          <p class="db-hero-role">
            <Terminal class="w-4 h-4" /> {{ props.profile.basicInfo.title }}
          </p>
        </div>
      </div>

      <p class="db-hero-bio">
        {{ props.profile.basicInfo.bio }}
      </p>

      <div class="flex flex-wrap gap-3">
        <a
          v-for="link in props.socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          class="db-hero-link"
        >
          <component :is="link.icon" class="w-4 h-4" />
          {{ link.name }}
        </a>
      </div>

      <div class="flex flex-wrap gap-3">
        <a
          v-if="props.profile.basicInfo.resumeUrl"
          :href="props.profile.basicInfo.resumeUrl"
          download
          class="db-btn-resume"
        >
          Resume (zh-TW)
        </a>
        <a
          v-if="props.profile.basicInfo.resumeUrlEn"
          :href="props.profile.basicInfo.resumeUrlEn"
          download
          class="db-btn-resume"
        >
          Resume (en-US)
        </a>
      </div>
    </div>

    <!-- 雷達圖 -->
    <div class="lg:col-span-5 relative group">
      <div class="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full"></div>
      <div class="db-radar-container">
        <div class="flex items-center justify-between mb-2">
          <h3
            class="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2"
          >
            <Layers class="w-3.5 h-3.5" /> Technical chart
          </h3>
        </div>
        <div class="h-full pb-8">
          <BaseRadarChart
            v-if="props.skillData"
            :chart-data="props.skillData"
            :chart-options="props.skillOptions"
          />
        </div>
      </div>
    </div>
  </section>
</template>
