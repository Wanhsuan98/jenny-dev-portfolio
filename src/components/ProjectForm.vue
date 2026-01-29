<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { Project, ImageDetail, ProjectTab } from '@/types/project'
import { Link, Trash2, Plus, Image as ImageIcon, Layout, Code2, X } from 'lucide-vue-next'

const toast = useToastStore()

// 最大 Tab 限制
const MAX_TABS = 5

const props = defineProps<{
  loading: boolean
  initialData?: Project
}>()

const emit = defineEmits<{
  (e: 'submit', payload: Project): void
  (e: 'cancel'): void
}>()

const isEditMode = computed(() => !!props.initialData)

// 產生 ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// 圖片格式化
const normalizeImages = (imgs?: (string | ImageDetail)[]): ImageDetail[] => {
  if (!imgs) return []
  return imgs.map((img) => {
    if (typeof img === 'string') {
      return { url: img, caption: '', description: '' }
    }
    return img
  })
}

const form = ref({
  name: '',
  techFrontend: '',
  techDatabase: '',
  techDeployment: '',
  techCore: '',
  isConfidential: false,
  status: 'Active' as 'Active' | 'Pending' | 'Completed',
  description: '',
  tabs: [] as ProjectTab[],
})

// 存 Tab ID
const activeTabId = ref<string>('')

// 圖片暫存
const tempImage = ref({
  url: '',
  caption: '',
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
        isConfidential: newData.isConfidential ?? false,
        description: newData.description || '',
        tabs: [],
      }

      if (newData.tabs && newData.tabs.length > 0) {
        form.value.tabs = JSON.parse(JSON.stringify(newData.tabs))
      } else {
        const uiImages = normalizeImages(newData.screenshots)
        const archImages = normalizeImages(newData.architectureImages)

        if (uiImages.length > 0 || archImages.length > 0 || !isEditMode.value) {
          form.value.tabs.push({
            id: generateId(),
            name: '元件設計 (Component Design)',
            mode: 'gallery',
            images: uiImages,
          })
          form.value.tabs.push({
            id: generateId(),
            name: '核心架構 (Architecture)',
            mode: 'tech',
            images: archImages,
          })
        }
      }

      const firstTab = form.value.tabs[0]
      if (firstTab) {
        activeTabId.value = firstTab.id
      }
    } else {
      const tab1Id = generateId()
      form.value.tabs = [
        { id: tab1Id, name: '元件設計', mode: 'gallery', images: [] },
        { id: generateId(), name: '核心架構', mode: 'tech', images: [] },
      ]
      activeTabId.value = tab1Id
    }
  },
  { immediate: true },
)

// --- Tab 相關功能 ---
const addTab = () => {
  // 限制最大分頁數
  if (form.value.tabs.length >= MAX_TABS) {
    toast.warning(`最多只能新增 ${MAX_TABS} 個分頁。`)
    return
  }

  const newId = generateId()
  form.value.tabs.push({
    id: newId,
    name: '新分頁',
    mode: 'gallery',
    images: [],
  })
  activeTabId.value = newId
}

const removeTab = (index: number) => {
  // 基本數量防呆
  if (form.value.tabs.length <= 1) {
    return toast.error('至少需要保留一個分頁')
  }

  const targetTab = form.value.tabs[index]
  if (!targetTab) return

  const isCurrent = targetTab.id === activeTabId.value

  // 刪除 Tab
  form.value.tabs.splice(index, 1)

  // 切換分頁邏輯
  // 如果刪掉的是當前分頁，而且還有剩下的分頁
  if (isCurrent && form.value.tabs.length > 0) {
    const firstTab = form.value.tabs[0]
    if (firstTab) {
      activeTabId.value = firstTab.id
    }
  }
}

// 取得當前編輯的 Tab
const currentTab = computed(() => {
  return form.value.tabs.find((t) => t.id === activeTabId.value)
})

// --- 圖片相關功能 ---
const addImage = () => {
  if (!currentTab.value) return
  const { url, caption, description } = tempImage.value

  if (!url.trim()) {
    toast.error('請輸入圖片網址')
    return
  }

  currentTab.value.images.push({ url, caption, description })
  tempImage.value = { url: '', caption: '', description: '' }
}

const removeImage = (index: number) => {
  if (!currentTab.value) return
  currentTab.value.images.splice(index, 1)
}

const handleSubmit = () => {
  if (!form.value.name) {
    toast.error('請填寫專案名稱')
    return
  }
  emit('submit', { ...form.value } as Project)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8 animate-in">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <label class="form-label">專案名稱</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="input-base"
          placeholder="例如：水利署後台管理系統"
        />
      </div>
      <div>
        <label class="form-label">前端技術</label>
        <input v-model="form.techFrontend" type="text" required class="input-base" />
      </div>
      <div>
        <label class="form-label">資料庫 (選填)</label>
        <input v-model="form.techDatabase" type="text" class="input-base" />
      </div>
      <div>
        <label class="form-label">部署平台 (選填)</label>
        <input v-model="form.techDeployment" type="text" class="input-base" />
      </div>
      <div>
        <label class="form-label">核心套件 (選填)</label>
        <input v-model="form.techCore" type="text" class="input-base" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="form-label">目前狀態</label>
        <select v-model="form.status" class="input-base">
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label class="form-label">保密設定</label>
        <div class="form-checkbox-card">
          <div class="flex items-center h-5">
            <input
              id="isConfidential"
              v-model="form.isConfidential"
              type="checkbox"
              class="form-checkbox"
            />
          </div>
          <div class="text-sm">
            <label for="isConfidential" class="form-checkbox-label"> 顯示 NDA 保密聲明 </label>
            <p class="form-checkbox-desc">勾選後，詳情頁將顯示紅色保密警示。</p>
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <label class="form-label">專案描述</label>
        <textarea
          v-model="form.description"
          rows="8"
          class="w-full input-base resize-none"
          placeholder="專案背景與核心貢獻..."
        ></textarea>
      </div>
    </div>

    <div class="form-divider"></div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          內容分頁管理 (Dynamic Tabs)
          <span class="text-xs font-normal text-gray-500 ml-2">
            ({{ form.tabs.length }} / {{ MAX_TABS }})
          </span>
        </h3>

        <button
          type="button"
          @click="addTab"
          :disabled="form.tabs.length >= MAX_TABS"
          class="btn btn-secondary text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800"
        >
          <Plus class="w-4 h-4 mr-1" />
          {{ form.tabs.length >= MAX_TABS ? '已達上限' : '新增分頁' }}
        </button>
      </div>

      <div class="tab-nav-container">
        <div
          v-for="(tab, index) in form.tabs"
          :key="tab.id"
          @click="activeTabId = tab.id"
          class="tab-trigger group"
          :class="activeTabId === tab.id ? 'tab-trigger-active' : 'tab-trigger-inactive'"
        >
          <span class="text-sm font-medium">{{ tab.name || '未命名' }}</span>
          <button type="button" @click.stop="removeTab(index)" class="tab-close-btn">
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <div
        v-if="currentTab"
        class="space-y-6 bg-white dark:bg-gray-900 rounded-lg p-1 border border-transparent"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 form-section-card">
          <div>
            <label class="form-label">分頁名稱 (Tab Name)</label>
            <input
              v-model="currentTab.name"
              type="text"
              class="input-base"
              placeholder="例如：元件設計"
            />
          </div>
          <div>
            <label class="form-label">展示模式 (Display Mode)</label>
            <div class="flex gap-2 mt-1">
              <button
                type="button"
                @click="currentTab.mode = 'gallery'"
                class="mode-select-btn"
                :class="
                  currentTab.mode === 'gallery'
                    ? 'mode-select-gallery-active'
                    : 'mode-select-inactive'
                "
              >
                <Layout class="w-4 h-4" />
                <span class="text-xs">UI 展示 (隨系統)</span>
              </button>
              <button
                type="button"
                @click="currentTab.mode = 'tech'"
                class="mode-select-btn"
                :class="
                  currentTab.mode === 'tech' ? 'mode-select-tech-active' : 'mode-select-inactive'
                "
              >
                <Code2 class="w-4 h-4" />
                <span class="text-xs">技術架構 (IDE風格)</span>
              </button>
            </div>
            <p class="text-[10px] text-gray-400 mt-1.5 ml-1">
              * UI 展示會隨亮/暗模式切換；技術架構則常駐深色風格以呈現專業感。
            </p>
          </div>
        </div>

        <div class="form-section-card space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-12">
              <label class="form-label">新增圖片至「{{ currentTab.name }}」</label>
              <div class="relative">
                <div class="input-icon-wrapper"><Link class="h-4 w-4 text-gray-400" /></div>
                <input
                  v-model="tempImage.url"
                  type="text"
                  class="input-base pl-10"
                  placeholder="圖片路徑 (URL)..."
                />
              </div>
            </div>

            <div class="md:col-span-12">
              <input
                v-model="tempImage.caption"
                type="text"
                class="input-base"
                placeholder="圖片標題 (Caption)"
              />
            </div>

            <div class="md:col-span-12">
              <textarea
                v-model="tempImage.description"
                rows="5"
                class="input-base resize-none py-2 leading-relaxed"
                placeholder="技術解說 (Description)..."
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="button" @click="addImage" class="btn btn-secondary">
              <Plus class="w-4 h-4 mr-2" /> 加入圖片
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
            <ImageIcon class="w-4 h-4" /> 圖片列表 ({{ currentTab.images.length }})
          </h4>

          <div v-if="currentTab.images.length === 0" class="upload-placeholder">此分頁暫無圖片</div>

          <div v-else class="space-y-3">
            <div
              v-for="(img, idx) in currentTab.images"
              :key="idx"
              class="img-list-item"
              :class="currentTab.mode === 'tech' ? 'theme-tech-item' : 'theme-gallery-item'"
            >
              <div
                class="img-list-thumb"
                :class="currentTab.mode === 'tech' ? 'theme-tech-thumb' : 'theme-gallery-thumb'"
              >
                <img :src="img.url" class="max-w-full max-h-full object-contain" />
              </div>

              <div class="flex-1 min-w-0 space-y-2">
                <input
                  v-model="img.caption"
                  class="w-full text-sm font-bold bg-transparent border-b border-transparent focus:border-primary-500 outline-none"
                  :class="currentTab.mode === 'tech' ? 'input-text-tech' : 'input-text-gallery'"
                  placeholder="輸入標題..."
                />
                <textarea
                  v-model="img.description"
                  rows="5"
                  class="w-full text-xs bg-transparent resize-none border-b border-transparent focus:border-primary-500 outline-none"
                  :class="currentTab.mode === 'tech' ? 'input-desc-tech' : 'input-desc-gallery'"
                  placeholder="輸入解說..."
                ></textarea>
              </div>

              <button type="button" @click="removeImage(idx)" class="btn-icon-delete">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions-footer">
      <button type="button" @click="$emit('cancel')" class="btn btn-ghost">取消</button>
      <button type="submit" :disabled="loading" class="btn btn-primary min-w-[100px]">
        {{ loading ? '儲存中...' : isEditMode ? '確認更新' : '確認新增' }}
      </button>
    </div>
  </form>
</template>
