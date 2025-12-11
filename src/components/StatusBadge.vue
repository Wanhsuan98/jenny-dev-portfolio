<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string | undefined
}>()

// Status Mapping
const statusMap: Record<string, string> = {
  Active: 'badge-success',
  Online: 'badge-success',
  'Checked In': 'badge-success',
  Completed: 'badge-info',
  Pending: 'badge-warning',
  Error: 'badge-danger',
  Offline: 'badge-danger',
  // 預設
  Unknown: 'badge-secondary',
}

const badgeClass = computed(() => {
  if (!props.status) return 'badge-secondary'
  return statusMap[props.status] || 'badge-secondary'
})
</script>

<template>
  <span class="badge badge-sm" :class="badgeClass">
    {{ status || '-' }}
  </span>
</template>
