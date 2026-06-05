<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 space-y-4">
    <div class="animate-in rounded-full h-12 w-12 border-b-2 border-primary-600"></div>

    <p v-if="message" class="page-subtitle animate-pulse font-medium">
      {{ message }}
    </p>
  </div>
</template>
