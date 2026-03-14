<script setup lang="ts">
import { Code2, ChevronRight } from 'lucide-vue-next'
import BaseModal from '@/components/BaseModal.vue'
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

const props = defineProps<{
  isOpen: boolean
  selectedTech: SkillTag | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <BaseModal
    :is-open="props.isOpen"
    title="Tech Stack Deep Dive"
    @close="emit('close')"
    max-width="max-w-2xl"
  >
    <div v-if="props.selectedTech" class="space-y-8 p-1">
      <div class="flex items-center gap-4">
        <div
          class="db-section-icon bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
        >
          <Code2 class="w-8 h-8" />
        </div>
        <div>
          <h3 class="db-section-title">{{ props.selectedTech.name }}</h3>
          <p class="db-section-subtitle">
            Found in {{ props.selectedTech.projects.length }} Integrated Projects
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <RouterLink
          v-for="proj in props.selectedTech.projects"
          :key="proj.id"
          :to="proj.isLab ? `/lab/${proj.id}` : `/project/${proj.id}`"
          @click="emit('close')"
          class="db-modal-card group"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="db-tag-sm !bg-slate-200 dark:!bg-slate-700 !border-0">{{
                proj.isLab ? 'Lab' : 'Production'
              }}</span>
              <h4
                class="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors"
              >
                {{ proj.name }}
              </h4>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
              {{ proj.description || 'No description available for this build.' }}
            </p>
          </div>
          <ChevronRight
            class="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
          />
        </RouterLink>
      </div>
    </div>
  </BaseModal>
</template>
