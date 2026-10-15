<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Monitor, Database, Cloud, Package, ExternalLink } from 'lucide-vue-next'
import type { Project } from '../../types/project'

interface MetaItem {
  label: string
  value?: string
  icon: Component
  iconClass: string
  isAlwaysShown?: boolean
}

const props = defineProps<{
  project?: Project | null
}>()

const metaItems = computed<MetaItem[]>(() => {
  const items: MetaItem[] = [
    {
      label: 'Frontend',
      value: props.project?.techFrontend,
      icon: Monitor,
      iconClass: 'text-blue-500',
      isAlwaysShown: true,
    },
    {
      label: 'Database',
      value: props.project?.techDatabase,
      icon: Database,
      iconClass: 'text-green-500',
    },
    {
      label: 'Deployment',
      value: props.project?.techDeployment,
      icon: Cloud,
      iconClass: 'text-cyan-500',
    },
    {
      label: 'Key Packages',
      value: props.project?.techCore,
      icon: Package,
      iconClass: 'text-orange-500',
    },
  ]
  return items.filter((item) => item.isAlwaysShown || item.value)
})

// 外部連結只允許 http/https,避免 javascript: 等協定造成 XSS
const safeExternalUrl = computed(() => {
  const url = props.project?.externalUrl
  if (!url) return null
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed : null
  } catch {
    return null
  }
})
</script>

<template>
  <div class="project-detail-meta-bar">
    <div v-for="item in metaItems" :key="item.label" class="project-detail-meta-pill">
      <component :is="item.icon" class="project-detail-meta-icon" :class="item.iconClass" />
      <div>
        <p class="project-detail-meta-label">{{ item.label }}</p>
        <p class="project-detail-meta-value">{{ item.value }}</p>
      </div>
    </div>

    <!-- 外部連結只顯示網域,避免整串網址撐開版面 -->
    <a
      v-if="safeExternalUrl"
      :href="safeExternalUrl.href"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`開啟專案網站 ${safeExternalUrl.host}(另開新視窗)`"
      class="project-detail-meta-pill project-detail-meta-link"
    >
      <ExternalLink class="project-detail-meta-icon text-cyan-500" aria-hidden="true" />
      <div>
        <p class="project-detail-meta-label">Website</p>
        <p class="project-detail-meta-value">{{ safeExternalUrl.host }}</p>
      </div>
    </a>
  </div>
</template>
