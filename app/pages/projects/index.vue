<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

definePageMeta({
  layout: false,
})

const { projects, initProjectsListener } = useProjects()

type TabKey = 'production' | 'lab'

const TABS: { key: TabKey; label: string; subtitle: string }[] = [
  { key: 'production', label: '落地專案', subtitle: '實際交付予客戶或組織之正式專案' },
  { key: 'lab', label: 'Side Project', subtitle: '個人研發與技術探索之實驗性專案' },
]

const activeTab = ref<TabKey>('production')

const productionProjects = computed(() => projects.value.filter((p) => !p.isLab))
const labProjects = computed(() => projects.value.filter((p) => p.isLab))

const displayedProjects = computed(() =>
  activeTab.value === 'production' ? productionProjects.value : labProjects.value,
)

onMounted(() => {
  initProjectsListener()
})
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
      <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <!-- Tab Switcher -->
        <div
          class="flex items-center gap-2 p-1 w-fit rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50"
        >
          <button
            v-for="tab in TABS"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-5 py-2 rounded-full text-sm font-bold transition-all duration-300"
            :class="
              activeTab === tab.key
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            "
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Projects Showcase -->
        <ProjectShowcaseSection
          :key="activeTab"
          :projects="displayedProjects"
          :subtitle="TABS.find((t) => t.key === activeTab)?.subtitle"
        />
      </div>
    </div>

    <AppFooter />
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
</style>
