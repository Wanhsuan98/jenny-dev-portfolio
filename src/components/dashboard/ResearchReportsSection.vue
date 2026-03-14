<script setup lang="ts">
import { BookOpen, FileText, Clock, ChevronRight } from 'lucide-vue-next'

type ResearchReport = {
  title: string
  tag: string
  date: string
  summary: string
  readTime: string
  link: string
  id?: string
}

const props = defineProps<{
  reports: ResearchReport[]
}>()
</script>

<template>
  <section
    id="research-reports"
    class="pt-16 border-t border-slate-100 dark:border-slate-700/50 scroll-mt-24"
  >
    <div class="db-section-header">
      <div class="db-icon-amber">
        <BookOpen class="w-6 h-6" />
      </div>
      <div>
        <h2 class="db-section-title">Engineering Research & Reports</h2>
        <p class="db-section-subtitle">技術研究與深度報告</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="report in props.reports"
        :key="report.title"
        class="db-card db-card-hover group relative overflow-hidden flex flex-col hover:border-amber-500/50"
      >
        <!-- 背景圖示 -->
        <FileText class="db-report-bg-icon group-hover:rotate-12" />

        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <span class="db-report-tag">{{ report.tag }}</span>
            <span class="db-report-date">{{ report.date }}</span>
          </div>

          <h4 class="db-report-title">
            {{ report.title }}
          </h4>

          <p class="db-report-desc">
            {{ report.summary }}
          </p>

          <div class="db-report-footer">
            <div class="db-report-meta"><Clock class="w-3.5 h-3.5" /> {{ report.readTime }}</div>
            <!-- 報告導讀頁面連結 -->
            <RouterLink
              :to="`/report/${report.id}`"
              class="db-report-action inline-flex items-center gap-1 font-bold"
            >
              VIEW REPORT <ChevronRight class="w-3.5 h-3.5" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
