<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ChevronDown, Zap, ShieldCheck, Gauge } from 'lucide-vue-next'
import GithubIcon from '~/components/icons/GithubIcon.vue'
import LinkedinIcon from '~/components/icons/LinkedinIcon.vue'
import NotionIcon from '~/components/icons/NotionIcon.vue'

definePageMeta({
  alias: ['/about'],
})

const { profile, loading, fetchProfile } = useProfile()

onMounted(() => {
  fetchProfile()
})

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/Wanhsuan98',
    icon: GithubIcon,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: LinkedinIcon,
  },
  {
    name: 'Notion',
    url: 'https://app.notion.com/p/3a68fa361b9e802490c2d62636cd6b06?source=copy_link',
    icon: NotionIcon,
  },
]

const resumeDetails = ref<HTMLDetailsElement | null>(null)

function closeResumeMenu() {
  if (resumeDetails.value) resumeDetails.value.open = false
}

function handleClickOutsideResumeMenu(event: MouseEvent) {
  if (resumeDetails.value && !resumeDetails.value.contains(event.target as Node)) {
    resumeDetails.value.open = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideResumeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideResumeMenu)
})

const metrics = [
  {
    id: 'ai-efficiency',
    title: 'Spec-Driven Testing',
    subtitle: '',
    statusText: 'Process',
    statusIcon: Zap,
    badgeClass: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-600 dark:text-cyan-400',
    dotClass: 'bg-cyan-600',
    desc: '開發 UI 之前，先將 PM/SA 規格轉化為前端 SDD (軟體設計文件)，並同步轉譯為 Vitest 測試案例 。在開發初期就為『核心業務邏輯』建立單元測試 ，確保後續功能迭代與重構時不會產生 Regression。',
  },
  {
    id: 'delivery-rate',
    title: 'AI-Assisted Dev Workflow',
    subtitle: '',
    statusText: 'AUTOMATED',
    statusIcon: ShieldCheck,
    badgeClass: 'bg-teal-500/10 border-teal-500/25 text-teal-600 dark:text-teal-400',
    dotClass: 'bg-teal-600',
    desc: '將既有的通用模板交給 AI 快速生成；並透過自研的 Workflow，實現 AI 自動化 Code Review 與 Git Commit 整合，達到一致工程化流程與提升開發效率。',
  },
  {
    id: 'lighthouse-score',
    title: 'Production Resilience',
    subtitle: '',
    statusText: 'Quality',
    statusIcon: Gauge,
    badgeClass: 'bg-orange-500/10 border-orange-500/25 text-orange-600 dark:text-orange-400',
    dotClass: 'bg-orange-600',
    desc: '具備大型公部門與企業級網站的正式環境交付經驗。SSR 關鍵路徑優化、國際化多語系架構與 WCAG 無障礙網站標準，確保專案兼具良好載入體驗、SEO與包容性設計。',
  },
]
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans relative overflow-x-hidden transition-colors duration-300 flex flex-col"
  >
    <!-- 漂浮發光球體背景 (Sleek Ambient Light) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slow"
      ></div>
      <div
        class="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/8 blur-[120px] animate-pulse-slow delay-1000"
      ></div>
      <div
        class="absolute top-[40%] left-[50%] -translate-x-1/2 w-[35vw] h-[35vw] rounded-full bg-orange-500/5 blur-[100px] animate-pulse-slow delay-500"
      ></div>
    </div>

    <AppHeader />

    <div class="relative z-10 flex-grow flex items-center py-6">
      <div class="w-full p-4 md:p-8 max-w-6xl mx-auto space-y-20 animate-in fade-in duration-700">
        <BaseLoading v-if="loading" message="正在從 Firebase 載入個人資料..." />

        <template v-else-if="profile">
          <!-- 1. Hero 區塊 (Branding Hero with Interactive Radar Chart) -->
          <section
            id="dashboard-hero"
            class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8"
          >
            <div class="lg:col-span-7 space-y-8">
              <!-- Name & Title -->
              <div class="space-y-4">
                <h1 class="text-5xl md:text-6xl font-black tracking-tight leading-none">
                  Hi, I'm
                  <span
                    class="bg-gradient-to-r from-cyan-400 via-teal-300 to-orange-400 bg-clip-text text-transparent"
                  >
                    {{ profile.basicInfo.name }}
                  </span>
                </h1>
                <div class="space-y-2">
                  <p
                    class="text-xl md:text-2xl font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2"
                  >
                    <span class="text-cyan-400">></span> {{ profile.basicInfo.title }}
                  </p>
                </div>
              </div>

              <!-- Tech Stack Pills -->
              <div class="flex flex-wrap gap-2.5 pt-1">
                <span
                  v-for="tech in ['Vue 3', 'Nuxt 3, 4', 'TypeScript', 'Tailwind CSS']"
                  :key="tech"
                  class="px-3.5 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-cyan-500/5 dark:bg-cyan-900/10 border border-cyan-500/20 dark:border-cyan-400/25 text-cyan-600 dark:text-cyan-300 shadow-sm backdrop-blur-md"
                >
                  {{ tech }}
                </span>
              </div>

              <!-- Bio -->
              <ul class="space-y-2 max-w-2xl">
                <li
                  v-for="(line, index) in profile.basicInfo.bio"
                  :key="index"
                  class="flex items-start gap-3 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light"
                >
                  <span class="font-mono text-slate-400 dark:text-slate-500 opacity-60 shrink-0"
                    >-</span
                  >
                  {{ line }}
                </li>
              </ul>

              <!-- Social Links & Resume -->
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <!-- 社群與聯絡：純 Icon 膠囊 -->
                <a
                  v-for="link in socialLinks"
                  :key="link.name"
                  :href="link.url"
                  target="_blank"
                  :aria-label="link.name"
                  :title="link.name"
                  class="flex items-center justify-center w-11 h-11 rounded-full bg-slate-100/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10 hover:shadow-[0_0_16px_rgba(34,211,238,0.35)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <component :is="link.icon" class="w-5 h-5" />
                </a>

                <div class="w-px h-6 bg-slate-300/50 dark:bg-slate-700/50 mx-1"></div>

                <!-- 履歷下載：合併為單一下拉選單 -->
                <details ref="resumeDetails" class="group relative">
                  <summary
                    class="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-cyan-500/30 dark:border-cyan-400/25 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden"
                  >
                    Resume
                    <ChevronDown
                      class="w-4 h-4 transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <div
                    class="absolute left-0 mt-2 w-40 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-slate-900/5 overflow-hidden z-20"
                  >
                    <a
                      v-if="profile.basicInfo.resumeUrl"
                      :href="profile.basicInfo.resumeUrl"
                      download
                      class="block px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      @click="closeResumeMenu"
                    >
                      中文版 (zh-TW)
                    </a>
                    <a
                      v-if="profile.basicInfo.resumeUrlEn"
                      :href="profile.basicInfo.resumeUrlEn"
                      download
                      class="block px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      @click="closeResumeMenu"
                    >
                      English (en-US)
                    </a>
                  </div>
                </details>
              </div>
            </div>

            <!-- Productivity Dashboard -->
            <div class="lg:col-span-5 space-y-6">
              <div
                v-for="item in metrics"
                :key="item.id"
                class="flex items-start gap-4 p-2.5 rounded-xl transition-all duration-300 border-b border-slate-200/20 dark:border-slate-800/30 last:border-b-0 pb-6 last:pb-0"
              >
                <!-- Metric Icon -->
                <div
                  class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-300/40 mt-1"
                >
                  <component :is="item.statusIcon" class="w-6 h-6" />
                </div>

                <!-- Details -->
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {{ item.title }}
                    </h4>
                    <!-- Pulsing Status Badge -->
                    <span
                      class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border"
                      :class="item.badgeClass"
                    >
                      <span
                        class="w-1 h-1 rounded-full animate-pulse"
                        :class="item.dotClass"
                      ></span>
                      {{ item.statusText }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                    {{ item.desc }}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </template>

        <p v-else class="text-error">無法載入個人資料，請確認 Firebase 資料。</p>
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

.glass-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.dark .glass-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
</style>
