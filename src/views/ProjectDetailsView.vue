<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useProject } from '@/composables/useProject'
import { formatDate } from '@/utils/date'
import StatusBadge from '@/components/StatusBadge.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import BaseLoading from '@/components/BaseLoading.vue'
import type { Project, ImageDetail } from '@/types/project'
import {
  Monitor,
  Database,
  Cloud,
  Package,
  ChevronLeft,
  Edit2,
  Trash2,
  Code2,
  Layout,
  Lock,
  ExternalLink,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()
const projectId = route.params.id as string

const { project, isLoading, errorMsg, fetchProject, updateProject, deleteProject } = useProject()

const isDeleting = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

// 當前選中的 Tab ID
const activeTabId = ref<string>('')

onMounted(() => {
  fetchProject(projectId)
})

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

const handleUpdate = async (formData: Omit<Project, 'id' | 'createdAt'>) => {
  if (!authStore.isAdmin) return toast.error('權限不足')

  isSaving.value = true
  try {
    await updateProject(projectId, formData)
    toast.success('更新成功！')
    isEditing.value = false
    await fetchProject(projectId)
  } catch (error) {
    console.error(error)
    toast.error('更新失敗')
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async () => {
  if (!authStore.isAdmin) return
  const confirmed = await toast.confirm(
    `確定要刪除專案「${project.value?.name}」嗎？此動作無法復原。`,
    '危險操作',
  )
  if (!confirmed) return
  isDeleting.value = true
  try {
    await deleteProject(projectId)
    toast.success('專案已成功刪除')
    router.push('/')
  } catch (error) {
    console.error(error)
    toast.error('刪除失敗')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6 animate-in">
    <div class="flex items-center justify-between">
      <button
        @click="router.push('/dashboard')"
        class="flex items-center gap-1 text-slate-500 hover:text-primary-600 transition-colors"
      >
        <ChevronLeft class="w-4 h-4" /><span>返回列表</span>
      </button>

      <div v-if="authStore.isAdmin && !isEditing" class="flex gap-2">
        <button @click="isEditing = true" class="btn btn-secondary py-1.5 px-3">
          <Edit2 class="w-4 h-4 mr-2" /> 編輯
        </button>
        <button @click="handleDelete" :disabled="isDeleting" class="btn btn-danger py-1.5 px-3">
          <Trash2 class="w-4 h-4 mr-2" /> 刪除
        </button>
      </div>
    </div>

    <BaseLoading v-if="isLoading" message="正在取得專案詳情資料..." />
    <div v-else-if="errorMsg" class="card p-12 text-center text-red-500">{{ errorMsg }}</div>

    <template v-else>
      <div v-if="isEditing" class="card p-8">
        <h2 class="page-title mb-6">編輯專案內容</h2>
        <ProjectForm
          v-if="project"
          :initial-data="project"
          :loading="isSaving"
          @submit="handleUpdate"
          @cancel="isEditing = false"
        />
      </div>

      <div v-else class="space-y-8">
        <div class="card overflow-hidden">
          <div class="card-header flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <StatusBadge :status="project?.status || 'Active'" />
                <span class="text-meta">ID: {{ projectId }}</span>
              </div>
              <h1 class="page-title text-4xl">{{ project?.name }}</h1>
              <p class="text-meta mt-2">建立時間：{{ formatDate(project?.createdAt) }}</p>
            </div>
          </div>

          <div
            class="px-8 py-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20"
          >
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              專案背景與核心貢獻
            </h3>
            <div
              class="detail-label leading-relaxed whitespace-pre-line max-w-3xl text-slate-600 dark:text-slate-300"
            >
              {{ project?.description || '尚無專案描述' }}
            </div>
          </div>

          <div class="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div
              class="lg:col-span-1 space-y-8 border-r border-slate-100 dark:border-slate-700 pr-8 h-fit lg:sticky lg:top-8"
            >
              <div>
                <h3 class="detail-label">技術棧 Stack</h3>
                <div class="space-y-4">
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
                    <Cloud class="tech-icon text-indigo-500" />
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
            </div>

            <div class="lg:col-span-2 space-y-8">
              <div v-if="project?.isConfidential" class="nda-alert">
                <Lock class="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <div class="space-y-1">
                  <p class="nda-title">保密聲明 (Confidentiality Notice)</p>
                  <p class="nda-desc">
                    受限於保密協議
                    (NDA)，部分敏感介面細節已進行遮蔽處理。下方的圖表旨在呈現核心工程架構與資料治理邏輯。
                    <span class="block mt-1 opacity-75 leading-tight">
                      Due to NDA restrictions, internal UI details are redacted. The diagrams below
                      visualize the core engineering architecture and data governance logic.
                    </span>
                  </p>
                </div>
              </div>

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
                  class="details-content-box"
                  :class="activeTabContent.mode === 'tech' ? 'box-mode-tech' : 'box-mode-gallery'"
                >
                  <div v-if="activeTabContent.images.length" class="space-y-16">
                    <div
                      v-for="(img, index) in activeTabContent.images"
                      :key="index"
                      class="group relative"
                    >
                      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        <div class="lg:col-span-2 space-y-4 pt-2 order-2 lg:order-1">
                          <div
                            class="details-label"
                            :class="
                              activeTabContent.mode === 'tech' ? 'label-tech' : 'label-gallery'
                            "
                          >
                            <component
                              :is="activeTabContent.mode === 'tech' ? Code2 : Layout"
                              class="w-4 h-4"
                            />
                            >> {{ activeTabContent.mode === 'tech' ? 'FIGURE' : 'ITEM' }}
                            {{ 1 + index }}.0
                          </div>

                          <h4
                            class="details-title"
                            :class="
                              activeTabContent.mode === 'tech' ? 'title-tech' : 'title-gallery'
                            "
                          >
                            {{
                              img.caption ||
                              (activeTabContent.mode === 'tech'
                                ? 'SYSTEM ARCHITECTURE'
                                : 'UI COMPONENT')
                            }}
                          </h4>

                          <div
                            class="details-desc"
                            :class="activeTabContent.mode === 'tech' ? 'desc-tech' : 'desc-gallery'"
                          >
                            {{ img.description || 'No description provided.' }}
                          </div>

                          <div class="pt-4 flex items-center gap-2">
                            <span
                              class="details-tag"
                              :class="activeTabContent.mode === 'tech' ? 'tag-tech' : 'tag-gallery'"
                            >
                              Type:
                              {{ activeTabContent.mode === 'tech' ? 'Diagram' : 'Screenshot' }}
                            </span>
                          </div>
                        </div>

                        <div class="lg:col-span-3 order-1 lg:order-2">
                          <div
                            class="details-window"
                            :class="
                              activeTabContent.mode === 'tech' ? 'window-tech' : 'window-gallery'
                            "
                          >
                            <div
                              class="window-header"
                              :class="
                                activeTabContent.mode === 'tech' ? 'header-tech' : 'header-gallery'
                              "
                            >
                              <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                              <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                              <div class="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                              <span
                                class="ml-2 text-[10px] text-slate-500 font-mono truncate max-w-[200px]"
                              >
                                {{ img.caption || 'image_preview' }}.png
                              </span>
                            </div>

                            <a
                              :href="img.url"
                              target="_blank"
                              class="window-link-wrapper group"
                              :class="
                                activeTabContent.mode === 'tech' ? 'link-tech' : 'link-gallery'
                              "
                            >
                              <img
                                :src="img.url"
                                class="window-img group-hover:scale-105"
                                alt="Project Image"
                              />
                              <div
                                class="window-overlay group-hover:opacity-100"
                                :class="
                                  activeTabContent.mode === 'tech'
                                    ? 'overlay-tech'
                                    : 'overlay-gallery'
                                "
                              >
                                <span class="window-zoom-btn group-hover:translate-y-0">
                                  <span class="text-lg"><ExternalLink class="w-4 h-4" /></span>
                                  點擊查看原始大圖
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="index !== activeTabContent.images.length - 1"
                        class="details-divider"
                        :class="
                          activeTabContent.mode === 'tech' ? 'divider-tech' : 'divider-gallery'
                        "
                      ></div>
                    </div>
                  </div>

                  <div
                    v-else
                    class="details-empty"
                    :class="activeTabContent.mode === 'tech' ? 'empty-tech' : 'empty-gallery'"
                  >
                    暫無圖片資料
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
