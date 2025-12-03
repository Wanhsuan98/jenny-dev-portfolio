/** * 狀態徽章元件 */
<script setup lang="ts">
defineProps<{ status: string }>()
</script>

<template>
  <span
    class="px-3 py-1 rounded-full text-xs font-medium"
    :class="{
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': status === 'Active',
      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': status === 'Completed',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': status === 'Pending',
    }"
  >
    {{ status }}
  </span>
</template>
