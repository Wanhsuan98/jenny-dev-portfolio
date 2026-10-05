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
  <div class="project-detail-page">
    <AppHeader />
    <div class="project-detail-container">
      <NuxtLink to="/projects" class="report-back-btn group">
        <ChevronLeft class="report-back-btn-icon" />
        返回專案列表
      </NuxtLink>

      <BaseLoading v-if="isLoading" message="正在取得專案詳情資料..." />
      <div v-else-if="errorMsg" class="report-detail-card p-12 text-center text-red-500 max-w-none">
        {{ errorMsg }}
      </div>

      <template v-else>
        <header class="space-y-6">
          <div v-if="coverImage" class="project-detail-hero aspect-[21/9]">
            <img
              :src="coverImage"
              :alt="project?.name || '專案封面'"
              class="w-full h-full object-cover"
              @error="coverImageBroken = true"
            />
            <div class="project-detail-hero-overlay"></div>
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

          <div class="project-detail-meta-bar">
            <div class="project-detail-meta-pill">
              <Monitor class="project-detail-meta-icon text-blue-500" />
              <div>
                <p class="project-detail-meta-label">Frontend</p>
                <p class="project-detail-meta-value">{{ project?.techFrontend }}</p>
              </div>
            </div>
            <div v-if="project?.techDatabase" class="project-detail-meta-pill">
              <Database class="project-detail-meta-icon text-green-500" />
              <div>
                <p class="project-detail-meta-label">Database</p>
                <p class="project-detail-meta-value">{{ project?.techDatabase }}</p>
              </div>
            </div>
            <div v-if="project?.techDeployment" class="project-detail-meta-pill">
              <Cloud class="project-detail-meta-icon text-cyan-500" />
              <div>
                <p class="project-detail-meta-label">Deployment</p>
                <p class="project-detail-meta-value">{{ project?.techDeployment }}</p>
              </div>
            </div>
            <div v-if="project?.techCore" class="project-detail-meta-pill">
              <Package class="project-detail-meta-icon text-orange-500" />
              <div>
                <p class="project-detail-meta-label">Key Packages</p>
                <p class="project-detail-meta-value">{{ project?.techCore }}</p>
              </div>
            </div>
          </div>
        </header>

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

        <div class="project-detail-grid">
          <aside class="lg:col-span-4">
            <div class="project-detail-side-card">
              <div class="space-y-3">
                <h2 class="report-detail-section-title">
                  <Info class="w-5 h-5 text-amber-500" />
                  專案背景與核心貢獻
                </h2>
                <p class="project-detail-side-desc">{{ project?.description || '尚無專案描述' }}</p>
              </div>

              <div
                v-if="normalizedProject?.tabs?.length"
                class="border-t border-slate-100 dark:border-slate-700/50 pt-6"
              >
                <p class="project-detail-nav-label">內容導覽</p>
                <nav class="space-y-1">
                  <button
                    v-for="tab in normalizedProject.tabs"
                    :key="tab.id"
                    @click="activeTabId = tab.id"
                    class="project-detail-nav-btn"
                    :class="
                      activeTabId === tab.id
                        ? 'project-detail-nav-btn-active'
                        : 'project-detail-nav-btn-inactive'
                    "
                  >
                    <Layout v-if="tab.mode === 'gallery'" class="w-4 h-4 shrink-0" />
                    <Code2 v-else class="w-4 h-4 shrink-0" />
                    <span class="truncate">{{ tab.name }}</span>
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          <div class="lg:col-span-8">
            <div
              v-if="activeTabContent"
              class="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div v-if="activeTabContent.images.length" class="project-detail-timeline">
                <div class="project-detail-timeline-line" aria-hidden="true"></div>
                <div
                  v-for="(img, index) in activeTabContent.images"
                  :key="index"
                  class="project-detail-item"
                >
                  <span class="project-detail-item-node">{{ index + 1 }}</span>
                  <h4 class="project-detail-item-title">
                    {{ img.caption || '技術重點分享' }}
                  </h4>
                  <p class="project-detail-item-desc">
                    {{ img.description || 'No description provided.' }}
                  </p>
                </div>
              </div>

              <div v-else class="project-detail-empty">暫無內容</div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <AppFooter />
  </div>
</template>
