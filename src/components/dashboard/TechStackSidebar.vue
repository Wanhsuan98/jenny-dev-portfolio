<script setup lang="ts">
import { MousePointerClick, Link as LinkIcon, GraduationCap } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { ImageDetail } from '@/types/project'

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

type TechHighlight = {
  label: string
  tags: SkillTag[]
  icon: Component
  color: string
  bg: string
  tagBg: string
}

type EducationItem = {
  date: string
  major: string
  school: string
}

const props = defineProps<{
  techHighlights: TechHighlight[]
  educations: EducationItem[]
}>()

const emit = defineEmits<{
  (e: 'tag-click', tag: SkillTag): void
}>()
</script>

<template>
  <div class="lg:col-span-4 space-y-8">
    <!-- 互動技術標籤 -->
    <section id="tech-stack" class="db-sidebar-section-tech">
      <div class="flex items-center justify-between mb-4">
        <h3 class="db-sidebar-title text-slate-800 dark:text-white">
          <MousePointerClick class="w-5 h-5 text-indigo-500" />
          點擊標籤查看相關專案
        </h3>
      </div>
      <div class="space-y-6">
        <div v-for="(tech, idx) in props.techHighlights" :key="idx">
          <p class="db-section-subtitle mb-3 ml-1">
            {{ tech.label }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in tech.tags"
              :key="tag.name"
              @click="emit('tag-click', tag)"
              class="db-tech-tag group/tag"
              :class="[tech.tagBg, tag.projects.length > 0 ? 'cursor-pointer' : 'cursor-default']"
            >
              {{ tag.name }}
              <div v-if="tag.projects.length > 1" class="db-tech-badge">
                {{ tag.projects.length }}
              </div>
              <LinkIcon
                v-else-if="tag.projects.length === 1"
                class="w-3 h-3 opacity-30 group-hover/tag:opacity-100"
              />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 學歷 -->
    <section id="education" class="db-sidebar-section-edu">
      <h3 class="db-sidebar-title mb-4">
        <GraduationCap class="w-5 h-5 text-sky-500" /> Education
      </h3>
      <div class="space-y-4">
        <div v-for="(edu, idx) in props.educations" :key="idx" class="db-edu-item">
          <p class="text-xs font-bold text-sky-600 dark:text-sky-400">{{ edu.date }}</p>
          <h4 class="text-sm font-bold dark:text-white">{{ edu.major }}</h4>
          <p class="text-xs text-slate-500">{{ edu.school }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
