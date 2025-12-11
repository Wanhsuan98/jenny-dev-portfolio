/** * 專案表單元件 */
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Project } from '@/types/project'

const props = defineProps<{
  loading: boolean
  initialData?: Project
}>()

const emit = defineEmits<{
  (e: 'submit', payload: Project): void
  (e: 'cancel'): void
}>()

const isEditMode = computed(() => !!props.initialData)

const form = ref({
  name: '',
  tech: '',
  status: 'Active' as 'Active' | 'Pending' | 'Completed',
  screenshots: [] as string[],
  description: '',
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        name: newData.name || '',
        tech: newData.tech || '',
        status: newData.status as 'Active' | 'Pending' | 'Completed',
        // 確保陣列是複製的，避免參照污染
        screenshots: [...(newData.screenshots || [])],
        description: newData.description || '',
      }
    }
  },
  { immediate: true },
)

// 暫存圖片網址
const tempImageUrl = ref('')

const addScreenshot = () => {
  if (!tempImageUrl.value.trim()) return
  form.value.screenshots.push(tempImageUrl.value.trim())
  tempImageUrl.value = ''
}

const removeScreenshot = (index: number) => {
  form.value.screenshots.splice(index, 1)
}

// 送出表單
const handleSubmit = () => {
  if (!form.value.name || !form.value.tech) {
    alert('請填寫完整資訊')
    return
  }
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="form-label">專案名稱</label>
      <input
        v-model="form.name"
        type="text"
        required
        class="input-base"
        placeholder="例如：後台管理系統"
      />
    </div>

    <div>
      <label class="form-label">使用技術</label>
      <input
        v-model="form.tech"
        type="text"
        required
        class="input-base"
        placeholder="例如：Vue3, Tailwind"
      />
    </div>

    <div>
      <label class="form-label">目前狀態</label>
      <select v-model="form.status" class="input-base">
        <option value="Active">進行中 (Active)</option>
        <option value="Pending">排程中 (Pending)</option>
        <option value="Completed">已完成 (Completed)</option>
      </select>
    </div>

    <div>
      <label class="form-label">專案描述</label>
      <textarea
        v-model="form.description"
        rows="5"
        class="w-full input-base resize-none"
        placeholder="請輸入專案詳細介紹、亮點功能..."
      ></textarea>
    </div>

    <div>
      <label class="form-label">專案截圖連結 (Imgur 網址)</label>

      <div class="flex gap-2 mb-2">
        <input
          v-model="tempImageUrl"
          type="url"
          class="flex-1 input-base"
          placeholder="https://i.imgur.com/..."
          @keypress.enter.prevent="addScreenshot"
        />
        <button type="button" @click="addScreenshot" class="btn btn-ghost">新增</button>
      </div>

      <div v-if="form.screenshots.length > 0" class="space-y-2">
        <div
          v-for="(url, index) in form.screenshots"
          :key="index"
          class="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-2 rounded text-sm"
        >
          <a
            :href="url"
            target="_blank"
            class="flex items-center gap-2 overflow-hidden"
            title="點擊預覽圖片"
          >
            <span class="truncate link">{{ url }}</span>
          </a>

          <button
            type="button"
            @click="removeScreenshot(index)"
            class="btn btn-danger"
            title="移除此圖片"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <button type="button" @click="$emit('cancel')" class="btn btn-ghost">取消</button>
      <button type="submit" :disabled="loading" class="btn btn-primary">
        <span v-if="loading" class="animate-spin mr-2">⚪</span>
        {{ loading ? '儲存中...' : isEditMode ? '確認更新' : '確認新增' }}
      </button>
    </div>
  </form>
</template>
