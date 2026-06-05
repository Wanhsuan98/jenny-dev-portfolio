/** * 基礎彈窗元件 */
<script setup lang="ts">
withDefaults(
  defineProps<{
    isOpen: boolean
    title?: string
    maxWidth?: string
  }>(),
  {
    title: '',
    maxWidth: 'max-w-md',
  },
)

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        @click="$emit('close')"
      ></div>

      <div
        class="relative card w-full overflow-hidden transform transition-all flex flex-col max-h-[90vh]"
        :class="maxWidth"
      >
        <div
          class="px-6 py-4 border-b border-gray-100 dark:border-slate-800/60 flex items-center shrink-0"
          :class="title ? 'justify-between' : 'justify-end'"
        >
          <h3 v-if="title" class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
          <button
            @click="$emit('close')"
            class="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
