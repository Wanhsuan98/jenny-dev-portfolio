<script setup lang="ts">
import { ref } from 'vue'
import { Zap, Layout, ChevronRight } from 'lucide-vue-next'
import type { ImageDetail } from '@/types/project'

type RelatedProject = {
  id?: string
  name?: string
  isLab?: boolean
  isMockupImage?: boolean
  description?: string
  coverImage?: string
  screenshots?: (string | ImageDetail)[]
  techFrontend?: string
}

const props = withDefaults(
  defineProps<{
    projects: RelatedProject[]
    subtitle?: string
  }>(),
  {
    subtitle: '專案核心技術與架構之解析',
  },
)

// 圖片載入失敗時(例如 Firestore 資料中的 screenshots URL 已失效),改用預設的架構圖示佔位畫面
const brokenImageIds = ref(new Set<string>())

const getProjectImage = (project: RelatedProject) => {
  if (project.id && brokenImageIds.value.has(project.id)) return undefined
  const cover = project.coverImage || project.screenshots?.[0]
  if (!cover) return undefined
  return typeof cover === 'string' ? cover : cover.url
}

const handleImageError = (project: RelatedProject) => {
  if (project.id) brokenImageIds.value.add(project.id)
}
</script>

<template>
  <section id="showcase">
    <div class="db-section-header">
      <div class="db-icon-cyan">
        <Zap class="w-6 h-6" />
      </div>
      <div>
        <h2 class="db-section-title">Feature Showcases</h2>
        <p class="db-section-subtitle text-slate-400">{{ props.subtitle }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 重點專案展示 -->
      <transition-group name="fade-list">
        <div
          v-for="project in props.projects"
          :key="project.id"
          class="db-card db-card-hover group relative fade-list-item"
        >
          <div class="db-card-inner">
            <!-- 專案展示容器 -->
            <div class="db-project-visual group-hover:scale-[1.02] relative">
              <template v-if="getProjectImage(project)">
                <img
                  :src="getProjectImage(project)"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  :alt="project.name || '專案截圖'"
                  @error="handleImageError(project)"
                />
                <div v-if="project.isMockupImage" class="db-project-mockup-badge">
                  <Layout class="w-3 h-3 opacity-70" />
                  此為示意圖
                </div>
              </template>
              <div v-else class="db-project-visual-placeholder">
                <!-- 技術背景 -->
                <div
                  class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                >
                  <div class="absolute inset-0 flex flex-wrap gap-2 p-2 rotate-12 scale-150">
                    <div
                      v-for="i in 12"
                      :key="i"
                      class="w-10 h-10 rounded-lg border border-slate-900 dark:border-white"
                    ></div>
                  </div>
                </div>
                <div class="relative z-10 flex flex-col items-center gap-2">
                  <Layout class="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  <span class="text-[8px] font-black uppercase tracking-widest text-slate-400"
                    >Architecture</span
                  >
                </div>
              </div>
            </div>

            <div class="flex-1 space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="db-badge-solution">{{
                    project.isLab ? 'Research Lab' : 'Production'
                  }}</span>
                  <h3 class="db-project-title">{{ project.name || 'Project' }}</h3>
                </div>
              </div>

              <p class="db-project-desc">
                {{ project.description }}
              </p>

              <div class="flex flex-wrap gap-2 pt-1">
                <template v-if="project.techFrontend">
                  <span
                    v-for="tag in project.techFrontend.split(',').slice(0, 3)"
                    :key="tag"
                    class="db-tag-sm"
                  >
                    # {{ tag.trim() }}
                  </span>
                </template>
              </div>

              <div class="flex items-center gap-3 pt-4">
                <NuxtLink
                  v-if="project.id"
                  :to="project.isLab ? `/lab/${project.id}` : `/project/${project.id}`"
                  class="db-btn db-btn-primary"
                >
                  查看技術細節 <ChevronRight class="w-3.5 h-3.5" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </section>
</template>

<style scoped></style>
