<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { Cpu, Database, Globe } from 'lucide-vue-next'
import type { ImageDetail } from '../../types/project'

definePageMeta({
  layout: false,
})

const { projects, initProjectsListener } = useProjects()

// 重點專案
const featuredProjects = computed(() => {
  return projects.value.filter((p) => {
    return p.isLab || p.isFeatured || p.name?.includes('水利署') || p.name?.includes('外交部')
  })
})

onMounted(() => {
  initProjectsListener()
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

/*
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
    { name: 'Node.js', projects: [] },
    { name: 'Python', projects: [] },
  ]
  const defaultTools: SkillTag[] = [
    { name: 'Git', projects: [] },
    { name: 'Docker', projects: [] },
    { name: 'Vercel', projects: [] },
  ]

  if (projects.value.length === 0) {
    return [
      {
        label: 'Frontend Stack',
        tags: defaultFrontend,
        icon: Cpu,
        color: 'text-cyan-400',
        glowFrom: 'rgba(34, 211, 238, 0.4)',
        glowTo: 'rgba(20, 184, 166, 0.4)',
        shadowColor: 'rgba(6, 182, 212, 0.2)',
        hoverBorder: 'hover:border-cyan-500/40 hover:text-cyan-300',
        badgeClass: 'bg-cyan-500/10 text-cyan-400',
      },
      {
        label: 'Backend & Database',
        tags: defaultBackend,
        icon: Database,
        color: 'text-teal-400',
        glowFrom: 'rgba(20, 184, 166, 0.4)',
        glowTo: 'rgba(52, 211, 153, 0.4)',
        shadowColor: 'rgba(20, 184, 166, 0.2)',
        hoverBorder: 'hover:border-teal-500/40 hover:text-teal-300',
        badgeClass: 'bg-teal-500/10 text-teal-400',
      },
      {
        label: 'DevOps & Tools',
        tags: defaultTools,
        icon: Globe,
        color: 'text-orange-400',
        glowFrom: 'rgba(249, 115, 22, 0.4)',
        glowTo: 'rgba(245, 158, 11, 0.4)',
        shadowColor: 'rgba(249, 115, 22, 0.2)',
        hoverBorder: 'hover:border-orange-500/40 hover:text-orange-300',
        badgeClass: 'bg-orange-500/10 text-orange-400',
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
  const backendTags = getUniqueTags(['techDatabase'])
  const deploymentTags = getUniqueTags(['techDeployment'])

  return [
    {
      label: 'Frontend Stack',
      tags: frontendTags.length ? frontendTags : defaultFrontend,
      icon: Cpu,
      color: 'text-cyan-400',
      glowFrom: 'rgba(34, 211, 238, 0.4)',
      glowTo: 'rgba(20, 184, 166, 0.4)',
      shadowColor: 'rgba(6, 182, 212, 0.2)',
      hoverBorder: 'hover:border-cyan-500/40 hover:text-cyan-300',
      badgeClass: 'bg-cyan-500/10 text-cyan-400',
    },
    {
      label: 'Backend & Database',
      tags: backendTags.length ? backendTags : defaultBackend,
      icon: Database,
      color: 'text-teal-400',
      glowFrom: 'rgba(20, 184, 166, 0.4)',
      glowTo: 'rgba(52, 211, 153, 0.4)',
      shadowColor: 'rgba(20, 184, 166, 0.2)',
      hoverBorder: 'hover:border-teal-500/40 hover:text-teal-300',
      badgeClass: 'bg-teal-500/10 text-teal-400',
    },
    {
      label: 'DevOps & Tools',
      tags: deploymentTags.length ? deploymentTags : defaultTools,
      icon: Globe,
      color: 'text-orange-400',
      glowFrom: 'rgba(249, 115, 22, 0.4)',
      glowTo: 'rgba(245, 158, 11, 0.4)',
      shadowColor: 'rgba(249, 115, 22, 0.2)',
      hoverBorder: 'hover:border-orange-500/40 hover:text-orange-300',
      badgeClass: 'bg-orange-500/10 text-orange-400',
    },
  ]
})

const handleTechClick = (tag: SkillTag) => {
  selectedExplorerTech.value = tag
  isTechExplorerOpen.value = true
}
*/
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden transition-colors duration-300 flex flex-col"
  >
    <!-- 漂浮發光球體背景 (Sleek Ambient Light) -->
    <div
      class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse-slow"
    ></div>
    <div
      class="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/8 blur-[120px] pointer-events-none animate-pulse-slow delay-1000"
    ></div>
    <div
      class="absolute top-[40%] left-[50%] -translate-x-1/2 w-[35vw] h-[35vw] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none animate-pulse-slow delay-500"
    ></div>

    <AppHeader />

    <div class="pt-8 pb-20 relative z-10 flex-grow">
      <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-20 animate-in fade-in duration-700">
        <!-- 2. Core Tech Stack Section (Interactive glowing grid cards) -->
        <!--
        <section id="showcase" class="space-y-6 pt-8">
          <div class="space-y-2">
            <h2 class="text-3xl font-black tracking-tight">Core Tech Stack</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-mono">// Click tags to filter projects</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div
              v-for="tech in techHighlights"
              :key="tech.label"
              class="tech-card group/tech-card"
              :style="{
                '--glow-from': tech.glowFrom,
                '--glow-to': tech.glowTo,
                '--shadow-color': tech.shadowColor
              }"
            >
              <div class="flex items-center gap-3 mb-6 relative z-10">
                <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 group-hover/tech-card:border-slate-700 transition-colors" :class="tech.color">
                  <component :is="tech.icon" class="w-6 h-6" />
                </div>
                <h3 class="text-lg font-bold text-slate-200">{{ tech.label }}</h3>
              </div>

              <div class="flex flex-wrap gap-2.5 relative z-10">
                <button
                  v-for="tag in tech.tags"
                  :key="tag.name"
                  @click="handleTechClick(tag)"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-300 flex items-center gap-2 border"
                  :class="[
                    tag.projects.length > 0 
                      ? ['cursor-pointer bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-950/80', tech.hoverBorder] 
                      : 'cursor-default bg-slate-950/10 border-transparent text-slate-500'
                  ]"
                >
                  <span>{{ tag.name }}</span>
                  <span v-if="tag.projects.length > 1" class="px-1.5 py-0.5 rounded-md text-[10px] font-bold" :class="tech.badgeClass">
                    {{ tag.projects.length }}
                  </span>
                  <span v-else-if="tag.projects.length === 1" class="w-1.5 h-1.5 rounded-full bg-slate-500/40"></span>
                </button>
              </div>
            </div>
          </div>
        </section>
        -->

        <!-- 3. Projects Showcase -->
        <section id="tech-stack" class="space-y-6 pt-8">
          <ProjectShowcaseSection :projects="featuredProjects" />
        </section>
      </div>
    </div>

    <AppFooter />

    <!-- Tech Explorer Modal -->
    <TechExplorerModal
      :is-open="isTechExplorerOpen"
      :selected-tech="selectedExplorerTech"
      @close="isTechExplorerOpen = false"
    />
  </div>
</template>

<style scoped>
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.5;
    transform: translate(0, 0) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(15px, -15px) scale(1.03);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 10s ease-in-out infinite;
}

.tech-card {
  position: relative;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
}

.dark .tech-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.tech-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  padding: 1.5px;
  background: linear-gradient(to bottom right, var(--glow-from), var(--glow-to));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.tech-card:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow:
    0 10px 30px -10px rgba(0, 0, 0, 0.5),
    0 0 20px -5px var(--shadow-color);
}

.tech-card:hover::before {
  opacity: 1;
}
</style>
