<script setup lang="ts">
import { onMounted } from 'vue'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div>
    <BaseToast />
    <BaseConfirm />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
