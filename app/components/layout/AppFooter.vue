<script setup lang="ts">
import { onMounted } from 'vue'
import { Mail } from 'lucide-vue-next'

const { profile, fetchProfile } = useProfile()

defineProps<{
  minimal?: boolean
}>()

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-inner py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- 版權 & 座右銘 -->
        <div
          class="flex flex-col items-center sm:items-start gap-1 text-slate-500 dark:text-slate-400"
        >
          <span class="text-xs">© 2026 Jenny Lin. Built with Nuxt & Tailwind.</span>
        </div>

        <!-- 聯絡按鈕 -->
        <div>
          <a
            :href="`mailto:${profile?.basicInfo.email || 'wanhsuan98@gmail.com'}`"
            class="footer-btn-primary"
          >
            <Mail class="w-3.5 h-3.5" />
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
