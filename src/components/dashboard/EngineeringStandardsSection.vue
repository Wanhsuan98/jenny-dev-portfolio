<script setup lang="ts">
import { ref } from 'vue'
import {
  ShieldCheck,
  CheckCircle,
  Workflow,
  Activity,
  Wrench,
  ChevronDown,
  Box,
  Zap,
} from 'lucide-vue-next'

const engineeringStandards = [
  {
    title: 'Code Quality (ESLint)',
    icon: ShieldCheck,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    border: 'border-indigo-100 dark:border-indigo-500/20',
    details: ['Vue 3 PascalCase enforced', 'Strict TS recommended', 'No-console production block'],
  },
  {
    title: 'Formatting (Prettier)',
    icon: Wrench,
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    border: 'border-sky-100 dark:border-sky-500/20',
    details: ['Print width: 100', 'Single quotes', 'No semicolons'],
  },
  {
    title: 'Testing Flow',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-100 dark:border-emerald-500/20',
    details: ['Vitest for unit logic', 'Component regression', 'Playwright E2E'],
  },
  {
    title: 'Architecture & Design',
    icon: Box,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-100 dark:border-amber-500/20',
    details: [
      'Generic Typesafe Table Library',
      'Reactive Canvas-based Radar Charts',
      'Atomic State Persistence (Pinia)',
    ],
  },
]

const activeTab = ref<string | null>(engineeringStandards[0]?.title ?? null)

const toggleTab = (title: string) => {
  activeTab.value = activeTab.value === title ? null : title
}
</script>

<template>
  <section
    id="engineering-standards"
    class="pt-16 border-t border-slate-100 dark:border-slate-700/50"
  >
    <div class="text-center space-y-4 mb-12">
      <div class="db-badge-pill">
        <div class="flex items-center gap-2">
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Applied to this Project
        </div>
      </div>
      <h2 class="db-section-title text-center block w-full">Engineering Standards</h2>
      <p class="db-section-desc">
        本網站作為技術展示核心，嚴格遵循以下開發規範，
        <span class="hidden md:inline">確保每一行程式碼的長期可維護性與穩定。</span>
      </p>
    </div>

    <div class="space-y-4 max-w-4xl mx-auto">
      <div
        v-for="std in engineeringStandards"
        :key="std.title"
        class="std-accordion-item"
        :class="[
          activeTab === std.title
            ? std.border
            : 'border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600',
        ]"
      >
        <button @click="toggleTab(std.title)" class="std-accordion-trigger">
          <div class="flex items-center gap-4">
            <div class="std-accordion-icon-box" :class="[std.bg, std.color]">
              <component :is="std.icon" class="w-5 h-5" />
            </div>
            <h4 class="std-accordion-title">{{ std.title }}</h4>
          </div>
          <ChevronDown
            class="w-5 h-5 text-slate-400 transition-transform duration-300"
            :class="{ 'rotate-180': activeTab === std.title }"
          />
        </button>

        <div
          class="std-accordion-content"
          :class="
            activeTab === std.title ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          "
        >
          <div class="std-accordion-body">
            <ul class="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <li v-for="detail in std.details" :key="detail" class="db-highlight-item">
                <CheckCircle class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {{ detail }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 開發流程 -->
    <div class="db-workflow-container mt-16">
      <div class="std-workflow-accent-icon">
        <Workflow class="w-64 h-64" />
      </div>
      <div class="relative z-10 space-y-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="std-workflow-label">
            <Activity class="w-5 h-5" />
            CI/CD Pipeline & Quality Gate（For Personal Projects）
          </div>
          <div
            class="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            System Status: Verified & Operational
          </div>
        </div>

        <div
          class="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-0 font-mono"
        >
          <!-- Step 1 -->
          <div class="db-workflow-step">
            <div class="flex flex-col">
              <span class="text-slate-500 text-xs">01. LOCAL GATE</span>
              <span class="text-base font-bold">Git Hook Injection</span>
              <span class="workflow-tool-tag">Husky + Prettier</span>
            </div>
          </div>
          <div class="db-workflow-divider"></div>

          <!-- Step 2 -->
          <div class="db-workflow-step">
            <div class="flex flex-col">
              <span class="text-slate-500 text-xs">02. CLOUD CI</span>
              <span class="text-base font-bold">Automated Linting</span>
              <span class="workflow-tool-tag">GitHub Actions</span>
            </div>
          </div>
          <div class="db-workflow-divider"></div>

          <!-- Step 3 -->
          <div class="db-workflow-step">
            <div class="flex flex-col">
              <span class="text-slate-500 text-xs">03. VERIFICATION</span>
              <span class="text-base font-bold">Unit & E2E Testing</span>
              <span class="workflow-tool-tag">Vitest / Playwright</span>
            </div>
          </div>
          <div class="db-workflow-divider"></div>

          <!-- Step 4 -->
          <div class="db-workflow-step-active">
            <div class="flex flex-col">
              <span class="text-indigo-200 text-xs">04. DELIVERY</span>
              <span class="text-base font-bold">Edge Deployment</span>
              <span
                class="text-xs font-bold px-2 py-0.5 rounded bg-white/20 text-white mt-1 block w-fit"
                >Vercel Production</span
              >
            </div>
          </div>
        </div>

        <!-- 技術註解 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
          <div class="space-y-2">
            <div class="text-sm font-bold text-slate-300 flex items-center gap-2">
              <ShieldCheck class="w-3.5 h-3.5 text-indigo-400" /> Commit Integrity
            </div>
            <p class="text-sm text-slate-500 leading-relaxed font-medium">
              透過 Husky 強制執行 Prettier 與 ESLint，確保每一行進入知識庫的程式碼都符合團隊規範。
            </p>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Activity class="w-3.5 h-3.5 text-emerald-400" /> Fail-Safe Deployment
            </div>
            <p class="text-sm text-slate-500 leading-relaxed font-medium">
              任何 Pull Request 都必須通過完整單元測試與端對端測試，否則無法合併至生產分支。
            </p>
          </div>
          <div class="space-y-2">
            <div class="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Zap class="w-3.5 h-3.5 text-amber-400" /> Atomic Reverts
            </div>
            <p class="text-sm text-slate-500 leading-relaxed font-medium">
              採用 Vercel 進行部署，支援即時預覽與秒級版本回滾，確保系統具備極高的故障容忍度。
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
