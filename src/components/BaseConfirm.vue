<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import BaseModal from '@/components/BaseModal.vue'

const store = useToastStore()

const handleCancel = () => {
  store.resolveConfirm(false)
}

const handleConfirm = () => {
  store.resolveConfirm(true)
}
</script>

<template>
  <BaseModal
    :is-open="store.confirmState.isOpen"
    :title="store.confirmState.title"
    @close="handleCancel"
  >
    <div class="space-y-6">
      <p class="page-subtitle text-xl">
        {{ store.confirmState.message }}
      </p>

      <div class="flex justify-end gap-3">
        <button @click="handleCancel" class="btn-ghost">取消</button>
        <button @click="handleConfirm" class="btn-danger">確認</button>
      </div>
    </div>
  </BaseModal>
</template>
