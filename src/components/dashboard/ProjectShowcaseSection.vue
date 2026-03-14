<script setup lang="ts">
import { ref, computed } from 'vue'
import { Zap, Layout, ChevronRight, ChevronDown } from 'lucide-vue-next'
import type { ImageDetail } from '@/types/project'

type RelatedProject = {
  id?: string
  name?: string
  isLab?: boolean
  description?: string
  screenshots?: (string | ImageDetail)[]
  techFrontend?: string
}

const props = defineProps<{
  projects: RelatedProject[]
}>()

const isExpanded = ref(false)

const displayedProjects = computed(() => {
  if (isExpanded.value) {
    return props.projects
  }
  return props.projects.slice(0, 2)
})

const PROJECT_THEMES = [
  { keyword: 'LINE', image: '/projects/line-checkin.png', isMockup: false },
  { keyword: 'LEGO', image: '/projects/lego-moc.png', isMockup: false },
  { keyword: '水利署', image: '/projects/wra-mockup.png', isMockup: true },
  { keyword: '全球合作暨訓練架構後台', image: '/projects/gctf-mockup.png', isMockup: true },
  {
    keyword: '全球合作暨訓練架構官網',
    image: '/projects/gctf-official-website.png',
    isMockup: false,
  },
]

const getProjectTheme = (project: RelatedProject) => {
  return PROJECT_THEMES.find((theme) => project.name?.includes(theme.keyword))
}

const getProjectImage = (project: RelatedProject) => getProjectTheme(project)?.image
const isMockupImage = (project: RelatedProject) => getProjectTheme(project)?.isMockup || false
</script>

<template>
  <section id="showcase">
    <div class="db-section-header">
      <div class="db-icon-indigo">
        <Zap class="w-6 h-6" />
      </div>
      <div>
        <h2 class="db-section-title">Feature Showcases</h2>
        <p class="db-section-subtitle text-slate-400">專案核心技術與架構之解析</p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- 重點專案展示 -->
      <transition-group name="fade-list">
        <div
          v-for="project in displayedProjects"
          :key="project.id"
          class="db-card db-card-hover group relative fade-list-item"
        >
          <div class="db-card-inner">
            <!-- 專案展示容器 -->
            <div class="db-project-visual group-hover:scale-[1.02] relative">
              <template v-if="getProjectImage(project)">
                <img :src="getProjectImage(project)" class="w-full h-full object-cover" />
                <div v-if="isMockupImage(project)" class="db-project-mockup-badge">
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
                <RouterLink
                  v-if="project.id"
                  :to="project.isLab ? `/lab/${project.id}` : `/project/${project.id}`"
                  class="db-btn db-btn-primary"
                >
                  查看技術細節 <ChevronRight class="w-3.5 h-3.5" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div v-if="props.projects.length > 2 && !isExpanded" class="mt-8 flex justify-center">
      <button @click="isExpanded = true" class="db-load-more-btn">
        載入更多專案 (Load More Projects)
        <ChevronDown class="w-4 h-4" />
      </button>
    </div>
  </section>
</template>

<style scoped></style>
