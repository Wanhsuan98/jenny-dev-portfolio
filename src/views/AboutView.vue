<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useProjects } from '@/composables/useProjects'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import BaseLoading from '@/components/BaseLoading.vue'
import type { Project, ImageDetail } from '@/types/project'
import { Github, Linkedin, Mail, Globe, Database, Cpu } from 'lucide-vue-next'
import type { ChartData, ChartOptions } from 'chart.js'

// --- 頁面子元件 ---
import DashboardHero from '@/components/dashboard/DashboardHero.vue'
import ResearchReportsSection from '@/components/dashboard/ResearchReportsSection.vue'
import EngineeringStandardsSection from '@/components/dashboard/EngineeringStandardsSection.vue'
import ExperienceTimeline from '@/components/dashboard/ExperienceTimeline.vue'
import TechStackSidebar from '@/components/dashboard/TechStackSidebar.vue'
import TechExplorerModal from '@/components/dashboard/TechExplorerModal.vue'
import ProjectShowcaseSection from '@/components/dashboard/ProjectShowcaseSection.vue'

import { useReports } from '@/composables/useReports'

const { profile, loading, fetchProfile } = useProfile()
const { projects, initProjectsListener } = useProjects()
const { reports: researchReports, fetchReports } = useReports()

// 重點專案
const featuredProjects = computed(() => {
  return projects.value.filter((p) => {
    return p.isLab || p.isFeatured || p.name?.includes('水利署') || p.name?.includes('外交部')
  })
})

onMounted(() => {
  fetchProfile()
  initProjectsListener()
  fetchReports()
})

type RelatedProject = {
  id?: string
  name?: string
  isLab?: boolean
  description?: string
  screenshots?: (string | ImageDetail)[]
  techFrontend?: string
}

type SkillTag = {
  name: string
  projects: RelatedProject[]
}

const isTechExplorerOpen = ref(false)
const selectedExplorerTech = ref<SkillTag | null>(null)

const techHighlights = computed(() => {
  // 預設
  const defaultFrontend: SkillTag[] = [
    { name: 'Vue 3', projects: [] },
    { name: 'TypeScript', projects: [] },
    { name: 'Vite', projects: [] },
    { name: 'Tailwind CSS', projects: [] },
  ]
  const defaultBackend: SkillTag[] = [
    { name: 'Firebase', projects: [] },
    { name: 'Vercel', projects: [] },
    { name: 'Git', projects: [] },
  ]

  if (projects.value.length === 0) {
    return [
      {
        label: 'Tech Stack',
        tags: defaultFrontend,
        icon: Cpu,
        color: 'text-indigo-500',
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        tagBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      },
      {
        label: 'Deployment & Tools',
        tags: defaultBackend,
        icon: Globe,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        tagBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      },
    ]
  }

  // --- 核心技能名單 ---
  const CORE_SKILLS = new Set([
    'Vue3',
    'Nuxt4',
    'TypeScript',
    'Tailwind CSS',
    'Vite',
    'Element Plus',
    'Vuetify',
    'LIFF SDK',
    'Python',
    'FastAPI',
    'Node.js',
    'Firestore',
    'PostgreSQL',
    'SQLite',
    'SQLAlchemy',
    'Docker',
    'Vercel',
    'Railway',
    'Git',
    'vue-i18n',
    'Sass/SCSS',
  ])

  // --- 輔助函式：提取、去重並過濾 ---
  const getUniqueTags = (fields: (keyof Project)[]) => {
    const tagMap = new Map<string, SkillTag>()

    projects.value.forEach((p) => {
      fields.forEach((key) => {
        const val = p[key]
        if (typeof val === 'string' && val) {
          val.split(/[,、;/\n|]/).forEach((t) => {
            const cleanTag = t.trim()
            if (cleanTag && (CORE_SKILLS.has(cleanTag) || projects.value.length === 0)) {
              if (!tagMap.has(cleanTag)) {
                tagMap.set(cleanTag, {
                  name: cleanTag,
                  projects: [],
                })
              }
              const currentTag = tagMap.get(cleanTag)!
              // 防止同一個專案被重複加入同一個技術標籤
              if (!currentTag.projects.find((proj) => proj.id === p.id)) {
                currentTag.projects.push({
                  id: p.id,
                  name: p.name,
                  isLab: !!p.isLab,
                  description: p.description,
                })
              }
            }
          })
        }
      })
    })
    return Array.from(tagMap.values())
  }

  const frontendTags = getUniqueTags(['techFrontend', 'techCore'])
  const backendTags = getUniqueTags(['techDatabase', 'techDeployment'])

  return [
    {
      label: 'Tech Stack',
      tags: frontendTags.length ? frontendTags : defaultFrontend,
      icon: Cpu,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      tagBg:
        'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20',
    },
    {
      label: 'Backend & Database',
      tags: backendTags.length ? backendTags : defaultBackend,
      icon: Database,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      tagBg:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20',
    },
  ]
})

const handleTechClick = (tag: SkillTag) => {
  selectedExplorerTech.value = tag
  isTechExplorerOpen.value = true
}

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/Wanhsuan98',
    icon: Github,
    hoverClass: 'hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: Linkedin,
    hoverClass: 'hover:bg-[#0077b5] hover:text-white',
  },
  {
    name: 'Email',
    url: 'mailto:wanhsuan98@gmail.com',
    icon: Mail,
    hoverClass: 'hover:bg-red-400 hover:text-white',
  },
]

// --- 儀表板圖表 ---
const skillData = computed<ChartData<'radar'> | null>(() => {
  return {
    labels: ['TypeScript', 'Vue 生態系', '效能優化', '測試涵蓋率', '工程架構'],
    datasets: [
      {
        label: '技術掌握度',
        data: [92, 95, 88, 85, 90],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverRadius: 8,
        pointRadius: 4,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        borderWidth: 2,
        fill: true,
      },
    ],
  }
})

const getSkillLevel = (score: number) => {
  if (score >= 90) return 'Expert'
  if (score >= 75) return 'Advanced'
  if (score >= 50) return 'Intermediate'
  return 'Beginner'
}

const skillOptions: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { display: true, color: 'rgba(148, 163, 184, 0.1)' },
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: { display: false, stepSize: 20 },
      pointLabels: {
        font: { size: 11, weight: 'bold', family: "'Inter', sans-serif" },
        color: '#94a3b8',
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context) => {
          const score = Number(context.raw)
          return `  ${getSkillLevel(score)} (${score}%)`
        },
      },
    },
  },
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    <AppHeader />

    <div class="pt-2 pb-16">
      <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <BaseLoading v-if="loading" message="正在從 Firebase 載入個人資料..." />

        <template v-else-if="profile">
          <DashboardHero
            :profile="profile"
            :socialLinks="socialLinks"
            :skillData="skillData"
            :skillOptions="skillOptions"
          />

          <!-- 專案與技能 -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- 專案 -->
            <div class="lg:col-span-8 space-y-8">
              <ProjectShowcaseSection :projects="featuredProjects" />
            </div>

            <!-- 技能與學歷 -->
            <div class="lg:col-span-4 space-y-8">
              <TechStackSidebar
                :techHighlights="techHighlights"
                :educations="profile.educations"
                @tag-click="handleTechClick"
              />
            </div>
          </div>

          <!-- 個人研究 -->
          <div class="space-y-16 mt-16">
            <ResearchReportsSection :reports="researchReports" />

            <!-- 開發標準 -->
            <EngineeringStandardsSection />

            <!-- 經歷 -->
            <ExperienceTimeline :experiences="profile.experiences" />
          </div>

          <!-- 技術探索 -->
          <TechExplorerModal
            :is-open="isTechExplorerOpen"
            :selected-tech="selectedExplorerTech"
            @close="isTechExplorerOpen = false"
          />
        </template>
        <p v-else class="text-error">無法載入個人資料，請確認 Firebase 資料。</p>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.scroll-mt-28 {
  scroll-margin-top: 7rem;
}
</style>
