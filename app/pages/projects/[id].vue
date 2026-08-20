<script setup lang="ts">
import { ref, computed, watch } from 'vue'

definePageMeta({
  layout: false,
  alias: ['/project/:id'],
})

import type { ImageDetail } from '../../types/project'
import {
  Monitor,
  Database,
  Cloud,
  Package,
  ChevronLeft,
  Code2,
  Layout,
  Info,
  Lock,
  ExternalLink,
} from 'lucide-vue-next'

const route = useRoute()
const projectId = route.params.id as string

const { project, isLoading, errorMsg } = useProject(() => projectId)

// 當前選中的 Tab ID
const activeTabId = ref<string>('')

const handleBack = () => {
  navigateTo('/projects', { replace: true })
}

// 資料標準化 Computed
const normalizedProject = computed(() => {
  if (!project.value) return null
  const p = { ...project.value }

  if (!p.tabs || p.tabs.length === 0) {
    p.tabs = []
    const norm = (imgs?: (string | ImageDetail)[]) => {
      if (!imgs) return []
      return imgs.map((i) => (typeof i === 'string' ? { url: i, caption: '', description: '' } : i))
    }
    if (p.screenshots?.length) {
      p.tabs.push({
        id: 'legacy-ui',
        name: '元件設計 (Component Design)',
        mode: 'gallery',
        images: norm(p.screenshots),
      })
    }
    if (p.architectureImages?.length) {
      p.tabs.push({
        id: 'legacy-arch',
        name: '核心架構 (Architecture)',
        mode: 'tech',
        images: norm(p.architectureImages),
      })
    }
  }
  return p
})

// 自動選中第一個 Tab
watch(
  () => normalizedProject.value,
  (newVal) => {
    if (newVal?.tabs?.length && !activeTabId.value) {
      const firstTab = newVal.tabs[0]
      if (firstTab) {
        activeTabId.value = firstTab.id
      }
    }
  },
  { immediate: true },
)

// 取得當前選中的 Tab 內容
const activeTabContent = computed(() => {
  return normalizedProject.value?.tabs.find((t) => t.id === activeTabId.value)
})

// 標題區封面圖(圖片載入失敗時退回純文字標題)
const coverImageBroken = ref(false)
watch(
  () => project.value?.id,
  () => {
    coverImageBroken.value = false
  },
)
const coverImage = computed(() => {
  if (coverImageBroken.value) return undefined
  const cover = project.value?.coverImage || project.value?.screenshots?.[0]
  if (!cover) return undefined
  return typeof cover === 'string' ? cover : cover.url
})
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col"
  >
    <AppHeader />
    <div class="flex-grow p-6 max-w-7xl mx-auto space-y-8 animate-in">
      <button @click="handleBack" class="report-back-btn group">
        <ChevronLeft class="report-back-btn-icon" />
        返回履歷
      </button>

      <BaseLoading v-if="isLoading" message="正在取得專案詳情資料..." />
      <div v-else-if="errorMsg" class="report-detail-card p-12 text-center text-red-500 max-w-none">
        {{ errorMsg }}
      </div>

      <template v-else>
        <header>
          <div
            v-if="coverImage"
            class="relative rounded-3xl overflow-hidden shadow-xl aspect-[21/9] bg-slate-100 dark:bg-slate-800"
          >
            <img
              :src="coverImage"
              :alt="project?.name || '專案封面'"
              class="w-full h-full object-cover"
              @error="coverImageBroken = true"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
            ></div>
            <div
              class="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
            >
              <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                {{ project?.name }}
              </h1>
              <NuxtLink
                v-if="project?.name?.includes('LINE')"
                to="/liff"
                class="flex items-center gap-2 px-4 py-1.5 bg-[#00b900] hover:bg-[#00a300] text-white rounded-full text-sm font-bold transition-all shadow-md hover:shadow-[#00b900]/20 shrink-0 w-fit"
              >
                <ExternalLink class="w-4 h-4" />
                立即體驗
              </NuxtLink>
            </div>
          </div>

          <div v-else class="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 class="page-title text-4xl">{{ project?.name }}</h1>
            <NuxtLink
              v-if="project?.name?.includes('LINE')"
              to="/liff"
              class="flex items-center gap-2 px-4 py-1.5 bg-[#00b900] hover:bg-[#00a300] text-white rounded-full text-sm font-bold transition-all shadow-md hover:shadow-[#00b900]/20 shrink-0 w-fit"
            >
              <ExternalLink class="w-4 h-4" />
              立即體驗
            </NuxtLink>
          </div>
        </header>

        <section class="space-y-4">
          <div class="report-detail-section-title">
            <Info class="w-6 h-6 text-amber-500" />
            專案背景與核心貢獻
          </div>
          <div class="report-detail-card max-w-none space-y-6">
            <p>{{ project?.description || '尚無專案描述' }}</p>

            <div
              class="flex flex-wrap gap-x-10 gap-y-4 pt-5 border-t border-slate-100 dark:border-slate-700/50"
            >
              <div class="tech-stack-item">
                <Monitor class="tech-icon text-blue-500" />
                <div>
                  <p class="tech-category-label">Frontend</p>
                  <p class="tech-content-text">{{ project?.techFrontend }}</p>
                </div>
              </div>
              <div v-if="project?.techDatabase" class="tech-stack-item">
                <Database class="tech-icon text-green-500" />
                <div>
                  <p class="tech-category-label">Database</p>
                  <p class="tech-content-text">{{ project?.techDatabase }}</p>
                </div>
              </div>
              <div v-if="project?.techDeployment" class="tech-stack-item">
                <Cloud class="tech-icon text-cyan-500" />
                <div>
                  <p class="tech-category-label">Deployment</p>
                  <p class="tech-content-text">{{ project?.techDeployment }}</p>
                </div>
              </div>
              <div v-if="project?.techCore" class="tech-stack-item">
                <Package class="tech-icon text-orange-500" />
                <div>
                  <p class="tech-category-label">Key Packages</p>
                  <p class="tech-content-text">{{ project?.techCore }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div v-if="project?.isConfidential" class="nda-alert">
          <Lock class="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
          <div class="space-y-1">
            <p class="nda-title">保密聲明 (Confidentiality Notice)</p>
            <p class="nda-desc">
              受限於保密協議
              (NDA)，部分敏感介面細節已進行遮蔽處理。下方內容旨在分享核心工程架構與資料治理邏輯的設計思路。
              <span class="block mt-1 opacity-75 leading-tight">
                Due to NDA restrictions, internal UI details are redacted. The notes below share the
                design thinking behind the core engineering architecture and data governance logic.
              </span>
            </p>
          </div>
        </div>

        <section class="space-y-4">
          <div class="details-tab-nav">
            <button
              v-for="tab in normalizedProject?.tabs"
              :key="tab.id"
              @click="activeTabId = tab.id"
              class="details-tab-btn"
              :class="
                activeTabId === tab.id ? 'details-tab-btn-active' : 'details-tab-btn-inactive'
              "
            >
              <Layout v-if="tab.mode === 'gallery'" class="w-4 h-4" />
              <Code2 v-else class="w-4 h-4" />
              {{ tab.name }}
            </button>
          </div>

          <div
            v-if="activeTabContent"
            class="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div
              v-if="activeTabContent.images.length"
              class="report-detail-card max-w-none space-y-6"
            >
              <div
                v-for="(img, index) in activeTabContent.images"
                :key="index"
                class="flex items-start gap-4"
              >
                <span
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-bold text-sm shrink-0"
                >
                  {{ index + 1 }}
                </span>
                <div class="space-y-1.5 pb-1">
                  <h4 class="text-lg font-bold text-slate-800 dark:text-white">
                    {{ img.caption || '技術重點分享' }}
                  </h4>
                  <p class="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {{ img.description || 'No description provided.' }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="report-detail-card max-w-none text-center text-slate-400">
              暫無內容
            </div>
          </div>
        </section>
      </template>
    </div>
    <AppFooter />
  </div>
</template>
