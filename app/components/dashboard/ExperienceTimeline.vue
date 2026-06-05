<script setup lang="ts">
import { ref, computed } from 'vue'
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp, Activity } from 'lucide-vue-next'

type PerformancePoint = string

type ExperienceItem = {
  date: string
  title: string
  company: string
  desc: string
  achievements?: PerformancePoint[]
}

const props = defineProps<{
  experiences: ExperienceItem[]
}>()

const isExpanded = ref(false)

const displayedExperiences = computed(() => {
  if (isExpanded.value) {
    return props.experiences
  }
  return props.experiences.slice(0, 2)
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <section id="experience" class="pt-16 border-t border-slate-100 dark:border-slate-700/50">
    <div class="db-section-header">
      <div class="db-icon-pink">
        <Briefcase class="w-6 h-6" />
      </div>
      <h2 class="db-section-title">經歷旅程</h2>
    </div>

    <div class="exp-container">
      <div class="exp-line"></div>

      <transition-group name="fade-list">
        <div
          v-for="item in displayedExperiences"
          :key="item.title + item.company"
          class="exp-item group"
        >
          <div class="exp-dot-wrapper">
            <div class="exp-dot"></div>
          </div>

          <div class="space-y-2">
            <div class="exp-date">
              <Calendar class="w-3 h-3" />
              {{ item.date }}
            </div>

            <div>
              <h3 class="skills-exp-title">
                {{ item.title }}
              </h3>
              <div class="text-meta flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5" />
                {{ item.company }}
              </div>
            </div>

            <p class="exp-desc">
              {{ item.desc }}
            </p>

            <div
              v-if="item.achievements && item.achievements.length > 0"
              class="db-achievement-card mt-4"
            >
              <div class="db-achievement-header">
                <Activity class="w-3 h-3 text-indigo-500" />
                Key Achievements & Impact
              </div>
              <ul class="space-y-3">
                <li
                  v-for="(point, pIdx) in item.achievements"
                  :key="pIdx"
                  class="db-achievement-item"
                >
                  <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                  <span class="leading-relaxed">
                    <template v-for="(word, wIdx) in point.split(' ')" :key="wIdx">
                      <span
                        :class="{
                          'db-keyword-highlight': [
                            'PM',
                            'Designer',
                            'Lead',
                            'Collaborated',
                            'Mentored',
                            'Architected',
                            'optimized',
                            'reduced',
                            'Advocated',
                            'Guided',
                            'Impact',
                            'Scalability',
                            'Stakeholders',
                            'Bridge',
                          ].some((k) => word.toLowerCase().includes(k.toLowerCase())),
                        }"
                      >
                        {{ word }}
                      </span>
                      {{ ' ' }}
                    </template>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div v-if="props.experiences.length > 2" class="mt-8 flex justify-center">
      <button @click="toggleExpand" class="exp-expand-btn">
        {{ isExpanded ? '收起經歷 (Show Less)' : '展開完整經歷 (View All Experience)' }}
        <component :is="isExpanded ? ChevronUp : ChevronDown" class="w-4 h-4" />
      </button>
    </div>
  </section>
</template>

<style scoped></style>
