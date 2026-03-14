<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Mail, Download } from 'lucide-vue-next'
import { useProfile } from '@/composables/useProfile'
import pkg from '../../../package.json'

defineProps<{
  minimal?: boolean
}>()

const version = pkg.version
const isOnline = ref(navigator.onLine)
const { profile, fetchProfile } = useProfile()

const updateStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  fetchProfile()
  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)
})

onUnmounted(() => {
  window.removeEventListener('offline', updateStatus)
  window.removeEventListener('online', updateStatus)
})
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- 完整模式 -->
      <div v-if="!minimal">
        <!-- 聯絡區 -->
        <div class="footer-cta-section">
          <div class="footer-cta-text">
            <h3 class="footer-cta-title">Let's Connect.</h3>
            <p class="footer-cta-desc">正在尋找技術夥伴或單純想交流開發心得嗎？</p>
          </div>

          <div class="footer-cta-actions">
            <a
              v-if="profile?.basicInfo.resumeUrl"
              :href="profile.basicInfo.resumeUrl"
              download
              class="footer-resume-link"
            >
              <Download class="w-4 h-4" />
              Resume (ZH)
            </a>
            <a
              v-if="profile?.basicInfo.resumeUrlEn"
              :href="profile.basicInfo.resumeUrlEn"
              download
              class="footer-resume-link"
            >
              <Download class="w-4 h-4" />
              Resume (EN)
            </a>
            <a
              :href="`mailto:${profile?.basicInfo.email || 'wanhsuan98@gmail.com'}`"
              class="footer-btn-primary"
            >
              <Mail class="w-4 h-4" />
              Get in Touch
            </a>
          </div>
        </div>

        <!-- 底部資訊 -->
        <div class="footer-inner">
          <!-- 版權 -->
          <div class="footer-copyright">
            <span>© 2025 Jenny Lin.</span>
            <span class="footer-location-tag"> Built in Taiwan </span>
          </div>

          <!-- 狀態與版號 -->
          <div class="footer-right-side">
            <div class="footer-status-badge">
              <div
                class="footer-status-dot"
                :class="isOnline ? 'bg-emerald-500/50' : 'bg-red-500/50 animation-pulse'"
              ></div>
              {{ isOnline ? 'System Nominal' : 'System Offline' }}
            </div>
            <span class="footer-version-label"> v{{ version }} </span>
          </div>
        </div>
      </div>

      <!-- 簡潔模式 -->
      <div v-else class="footer-inner">
        <div class="footer-copyright">
          <span>© 2025 Jenny Lin.</span>
        </div>

        <div class="footer-right-side">
          <div class="footer-status-badge">
            <div
              class="footer-status-dot"
              :class="isOnline ? 'bg-emerald-500/50' : 'bg-red-500/50 animation-pulse'"
            ></div>
            {{ isOnline ? 'Nominal' : 'Offline' }}
          </div>
          <span class="footer-version-label"> v{{ version }} </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
