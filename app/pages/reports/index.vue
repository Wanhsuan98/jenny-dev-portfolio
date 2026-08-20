<script setup lang="ts">
import { onMounted } from 'vue'

definePageMeta({
  layout: false,
})

const { reports: researchReports, fetchReports } = useReports()

onMounted(() => {
  fetchReports()
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
      <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-20 animate-in fade-in duration-700">
        <section id="research-reports" class="pt-8">
          <ResearchReportsSection :reports="researchReports" />
        </section>
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
