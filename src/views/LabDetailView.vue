<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProject } from '@/composables/useProject'
import AppHeader from '@/components/layout/AppHeader.vue'
import {
  MessageSquare,
  Users,
  Zap,
  EyeOff,
  ExternalLink,
  ArrowRight,
  Code2,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Server,
  Database,
  Key,
  Link as LinkIcon,
  Cpu,
  Layers,
} from 'lucide-vue-next'
import BaseLoading from '@/components/BaseLoading.vue'

const route = useRoute()
const { project, isLoading, errorMsg, fetchProject } = useProject()

// 當路由 ID 改變時，重新讀取資料
onMounted(() => {
  fetchProject(route.params.id as string)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchProject(newId as string)
  },
)

// 圖標映射表
const getIcon = (type: string) => {
  const icons: Record<string, typeof Server | typeof MessageSquare> = {
    // Highlights Icons
    server: Server,
    shield: CheckCircle2,
    key: Key,
    database: Database,
    message: MessageSquare,
    users: Users,
    zap: Zap,
    eye: EyeOff,
    code: Code2,
    check: CheckCircle2,
    cpu: Cpu,
    layers: Layers,
    // Action Icons
    dashboard: LayoutDashboard,
    external: ExternalLink,
    link: LinkIcon,
  }
  return icons[type] || Code2
}

// 根據主題顏色與圖標類型生成樣式
const getStyle = (type: string, theme?: string) => {
  const activeTheme = theme || 'indigo'

  // 這裡我們動態計算 Tailwind class
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500/20',
    green: 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-500/20',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-500/20',
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border-rose-500/20',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-500/20',
    emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/20',
  }

  // 特殊圖標對應特定色系 (如 server 恆藍，shield 恆靛)
  const iconSpecificColors: Record<string, string> = {
    server: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    shield: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
    key: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    database: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    message: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    users: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    zap: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    eye: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',
  }

  return iconSpecificColors[type] || colorMap[activeTheme]
}

const getBtnClass = (theme: string) => {
  const classes: Record<string, string> = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30',
    green: 'bg-green-600 hover:bg-green-700 shadow-green-600/30',
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30',
  }
  return classes[theme] || classes.indigo
}
const isPublicMode = computed(() => route.name === 'lab-public')
</script>

<template>
  <div
    :class="{
      'min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300': isPublicMode,
    }"
  >
    <AppHeader v-if="isPublicMode" />
    <div class="p-6 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <BaseLoading v-if="isLoading" message="正在從知識庫提取實驗數據..." />

      <div
        v-else-if="errorMsg"
        class="card p-12 text-center text-red-500 flex flex-col items-center gap-4"
      >
        <AlertCircle class="w-12 h-12" />
        <p class="text-lg font-bold">{{ errorMsg }}</p>
        <p class="text-sm text-slate-500">請確保 Firebase 中存在此專案 ID 的資料。</p>
      </div>

      <template v-else-if="project">
        <!-- Hero Section -->
        <header class="text-center space-y-4">
          <div
            class="lab-badge"
            :class="
              project.id?.includes('line')
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
            "
          >
            <Code2 class="w-3.5 h-3.5" /> Showcase
          </div>
          <h1 class="lab-title">
            {{ project.name }}
          </h1>
          <p class="lab-description">
            {{ project.description }}
          </p>
        </header>

        <!-- Primary CTA: External Live Demo -->
        <div
          v-if="project.externalUrl"
          class="flex justify-center -mt-4 animate-in fade-in slide-in-from-top-2 duration-1000 delay-300"
        >
          <a
            :href="project.externalUrl"
            target="_blank"
            class="lab-btn group w-fit px-10 py-4 rounded-2xl group shadow-2xl hover:scale-105 active:scale-95 transition-all"
            :class="
              project.id?.includes('line')
                ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
            "
          >
            啟動 Live Demo 網站
            <ExternalLink
              class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </a>
        </div>

        <!-- Technical Architecture Section -->
        <section v-if="project.labTechArchitecture" class="space-y-4 py-4">
          <!-- Section Header -->
          <div class="lab-section-header">
            <div class="flex items-center gap-3">
               <div class="p-2.5 bg-indigo-500/10 rounded-xl">
                  <Cpu class="w-5 h-5 text-indigo-500" />
               </div>
               <div>
                 <h2 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Technical Architecture</h2>
               </div>
            </div>
          </div>

          <!-- Cards Grid -->
          <div 
            class="lab-tech-grid"
            :class="project.labTechArchitecture.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2'"
          >
            <div 
              v-for="tech in project.labTechArchitecture" 
              :key="tech.label"
              class="lab-tech-card group"
            >
              <!-- Decorative Accent Line -->
              <div class="lab-tech-accent"></div>
              
              <div class="flex flex-col gap-6">
                <div class="flex items-center justify-between">
                  <h4 class="lab-tech-label">
                    {{ tech.label }}
                  </h4>
                  <div v-if="tech.iconType" class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <component :is="getIcon(tech.iconType)" class="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                
                <p class="lab-tech-content">
                  {{ tech.content }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Highlights Grid -->
        <div v-if="project.labHighlights" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="item in project.labHighlights"
            :key="item.title"
            class="lab-highlight-card group"
          >
            <div class="flex items-start gap-5 text-left">
              <div :class="['p-3 rounded-xl shrink-0 transition-colors', getStyle(item.iconType)]">
                <component :is="getIcon(item.iconType)" class="w-6 h-6" />
              </div>
              <div class="space-y-2">
                <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {{ item.title }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pipeline Section -->
        <section
          v-if="project.labPipeline"
          class="lab-section-card bg-slate-50/30 dark:bg-slate-900/40"
        >
          <h3 class="text-xl font-bold mb-8 flex items-center gap-2 text-left">
            <ArrowRight
              class="w-5 h-5"
              :class="project.id?.includes('line') ? 'text-green-500' : 'text-indigo-500'"
            />
            Technical Integration Pipeline
          </h3>

          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div class="relative flex justify-between">
              <div
                v-for="(step, idx) in project.labPipeline"
                :key="step.title"
                class="bg-slate-50 dark:bg-slate-900 px-2 flex flex-col items-center"
              >
                <div
                  class="lab-pipeline-dot"
                  :class="
                    project.id?.includes('line')
                      ? 'border-green-500 text-green-500'
                      : 'border-indigo-500 text-indigo-500'
                  "
                >
                  {{ idx + 1 }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div
              v-for="step in project.labPipeline"
              :key="step.title"
              class="text-center md:text-left"
            >
              <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ step.title }}</h4>
              <p class="text-xs text-slate-500 mt-1">{{ step.description }}</p>
            </div>
          </div>
        </section>

        <!-- Dynamic Action Section -->
        <div v-if="project.labActions" class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div
            v-for="action in project.labActions"
            :key="action.label"
            class="lab-action-card animate-in fade-in slide-in-from-bottom-2"
            :class="getStyle(action.iconType, action.themeColor)"
          >
            <div class="text-left space-y-4 mb-6">
              <div
                class="p-3 rounded-xl w-fit"
                :class="
                  action.themeColor === 'green'
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-500 text-white'
                "
              >
                <component :is="getIcon(action.iconType)" class="w-6 h-6" />
              </div>
              <h4 class="text-2xl font-bold text-slate-800 dark:text-white">{{ action.label }}</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ action.description }}
              </p>
            </div>

            <!-- Internal Link -->
            <RouterLink
              v-if="action.to"
              :to="action.to"
              class="lab-btn group"
              :class="getBtnClass(action.themeColor)"
            >
              立即體驗
              <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </RouterLink>

            <!-- External Link -->
            <a
              v-if="action.href"
              :href="action.href"
              target="_blank"
              class="lab-btßn group"
              :class="getBtnClass(action.themeColor)"
            >
              啟動 Live Demo 網站
              <ExternalLink
                class="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
