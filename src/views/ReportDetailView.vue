<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useReports } from '@/composables/useReports'
import { ChevronLeft, Download, CheckCircle, Info, BookOpen } from 'lucide-vue-next'
import type { ResearchReport } from '@/composables/useReports'

const route = useRoute()
const router = useRouter()
const { getReportById, loading } = useReports()

const reportId = computed(() => route.params.id as string)
const report = ref<ResearchReport | null>(null)

const goBack = () => {
  router.push('/#research-reports')
}

onMounted(async () => {
  if (reportId.value) {
    report.value = await getReportById(reportId.value)
  }
})
</script>

<template>
  <div class="report-detail-layout">
    <AppHeader />

    <main class="report-detail-container">
      <!-- 返回 -->
      <button @click="goBack" class="report-back-btn group">
        <ChevronLeft class="report-back-btn-icon" />
        返回上一頁
      </button>

      <div v-if="report" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <!-- 導讀內文區 -->
        <div class="lg:col-span-8 space-y-10">
          <header class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="report-detail-tag">
                {{ report.tag }}
              </span>
              <span class="report-detail-date">{{ report.date }}</span>
            </div>
            <h1 class="report-detail-title">
              {{ report.title }}
            </h1>
          </header>

          <section class="space-y-4">
            <div class="report-detail-section-title">
              <Info class="w-6 h-6 text-amber-500" />
              背景與動機
            </div>
            <p class="report-detail-card">
              {{ report.context }}
            </p>
          </section>

          <section class="space-y-4">
            <div class="report-detail-section-title">
              <CheckCircle class="w-6 h-6 text-emerald-500" />
              核心亮點
            </div>
            <ul class="report-detail-card !p-6 sm:!p-8 space-y-3">
              <li
                v-for="(item, index) in report.takeaways"
                :key="index"
                class="report-takeaway-item"
              >
                <span class="report-takeaway-icon">
                  {{ index + 1 }}
                </span>
                <p>{{ item }}</p>
              </li>
            </ul>
          </section>

          <section class="space-y-4">
            <div class="report-detail-section-title">
              <BookOpen class="w-6 h-6 text-indigo-500" />
              章節大綱
            </div>
            <div class="report-outline-container">
              <ol class="report-outline-list">
                <li v-for="(item, index) in report.outline" :key="index" class="pl-2">
                  {{ item }}
                </li>
              </ol>
            </div>
          </section>
        </div>

        <div class="lg:col-span-4 lg:pt-14">
          <div class="report-side-card">
            <div class="space-y-4">
              <h3 class="font-bold text-slate-800 dark:text-slate-200">報告資源</h3>

              <div class="report-info-row pb-2">
                <span>檔案格式</span>
                <span class="font-bold font-mono text-slate-700 dark:text-slate-300">{{
                  report.readTime
                }}</span>
              </div>

              <div class="report-info-row pb-4">
                <span>檔案大小</span>
                <span class="font-bold font-mono text-slate-700 dark:text-slate-300">{{
                  report.fileSize
                }}</span>
              </div>

              <a
                :href="report.link"
                target="_blank"
                rel="noopener noreferrer"
                class="report-download-btn"
              >
                <span class="font-black flex items-center gap-2">
                  <Download class="w-4 h-4" />
                  {{ report.readTime === 'PDF' ? '閱讀完整 PDF' : '下載完整報告' }}
                </span>
                <span class="text-[10px] text-indigo-200 uppercase tracking-widest hidden sm:block"
                  >View Original Document</span
                >
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="loading"
        class="text-center py-20 flex flex-col items-center justify-center space-y-4"
      >
        <div
          class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
        ></div>
        <p class="text-slate-500 font-medium tracking-wide">載入報告中...</p>
      </div>

      <div v-else class="text-center py-20">
        <h2 class="text-2xl font-bold text-slate-700 dark:text-slate-300">找不到該報告</h2>
        <button
          @click="goBack"
          class="mt-6 font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          返回首頁
        </button>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
