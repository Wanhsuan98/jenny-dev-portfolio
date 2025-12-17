<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { Project } from '@/types/project'

const toast = useToastStore()

const props = defineProps<{
  loading: boolean
  initialData?: Project
}>()

const emit = defineEmits<{
  (e: 'submit', payload: Project): void
  (e: 'cancel'): void
}>()

const isEditMode = computed(() => !!props.initialData)

// 初始化表單結構
const form = ref({
  name: '',
  techFrontend: '',
  techDatabase: '',
  techDeployment: '',
  techCore: '',
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
        techFrontend: newData.techFrontend || '',
        techDatabase: newData.techDatabase || '',
        techDeployment: newData.techDeployment || '',
        techCore: newData.techCore || '',
        status: newData.status as 'Active' | 'Pending' | 'Completed',
        screenshots: [...(newData.screenshots || [])],
        description: newData.description || '',
      }
    }
  },
  { immediate: true },
)

const tempImageUrl = ref('')
const addScreenshot = () => {
  if (!tempImageUrl.value.trim()) return
  form.value.screenshots.push(tempImageUrl.value.trim())
  tempImageUrl.value = ''
}
const removeScreenshot = (index: number) => {
  form.value.screenshots.splice(index, 1)
}

const handleSubmit = () => {
  // 檢查必填欄位
  if (
    !form.value.name ||
    !form.value.techFrontend ||
    !form.value.techDatabase ||
    !form.value.techDeployment
  ) {
    toast.error('請填寫完整技術棧資訊')
    return
  }
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <label class="form-label">專案名稱</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="input-base"
          placeholder="例如：LINE 即時簽到系統"
        />
      </div>

      <div>
        <label class="form-label">前端技術</label>
        <input
          v-model="form.techFrontend"
          type="text"
          required
          class="input-base"
          placeholder="Vue 3, Tailwind CSS"
        />
      </div>

      <div>
        <label class="form-label">資料庫 / 後端服務</label>
        <input
          v-model="form.techDatabase"
          type="text"
          required
          class="input-base"
          placeholder="Firebase Firestore"
        />
      </div>

      <div>
        <label class="form-label">部署平台</label>
        <input
          v-model="form.techDeployment"
          type="text"
          required
          class="input-base"
          placeholder="Vercel, Google Cloud"
        />
      </div>

      <div>
        <label class="form-label">核心套件 (選填)</label>
        <input
          v-model="form.techCore"
          type="text"
          class="input-base"
          placeholder="@line/liff, Chart.js"
        />
      </div>
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
        rows="4"
        class="w-full input-base resize-none"
        placeholder="描述專案亮點..."
      ></textarea>
    </div>

    <div>
      <label class="form-label">專案截圖連結</label>
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
      <div v-if="form.screenshots.length > 0" class="space-y-2 max-h-40 overflow-y-auto pr-2">
        <div
          v-for="(url, index) in form.screenshots"
          :key="index"
          class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm border border-gray-200 dark:border-gray-600"
        >
          <span class="truncate text-gray-500 flex-1 mr-2">{{ url }}</span>
          <button
            type="button"
            @click="removeScreenshot(index)"
            class="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <button type="button" @click="$emit('cancel')" class="btn btn-ghost">取消</button>
      <button type="submit" :disabled="loading" class="btn btn-primary min-w-[100px]">
        {{ loading ? '儲存中...' : isEditMode ? '確認更新' : '確認新增' }}
      </button>
    </div>
  </form>
</template>
