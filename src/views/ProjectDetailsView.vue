<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import StatusBadge from '@/components/StatusBadge.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import type { Project } from '@/types/project'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const projectId = route.params.id as string

const project = ref<Project | null>(null)
const isLoading = ref(true)
const errorMsg = ref('')

const isDeleting = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

onMounted(async () => {
  try {
    const docRef = doc(db, 'projects', projectId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      project.value = { id: docSnap.id, ...docSnap.data() } as Project
    } else {
      errorMsg.value = '找不到此專案，可能已被刪除。'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = '讀取資料失敗'
  } finally {
    isLoading.value = false
  }
})

// 儲存修改
const handleUpdate = async (formData: Project) => {
  if (!authStore.isAdmin) return toast.error('權限不足')

  isSaving.value = true
  try {
    const docRef = doc(db, 'projects', projectId)

    await updateDoc(docRef, {
      name: formData.name,
      tech: formData.tech,
      status: formData.status,
      description: formData.description,
      screenshots: formData.screenshots,
    })

    // 更新本地顯示資料
    if (project.value) {
      project.value = {
        ...project.value,
        ...formData,
      }
    }

    toast.success('更新成功！')
    isEditing.value = false
  } catch (error) {
    console.error(error)
    toast.error('更新失敗')
  } finally {
    isSaving.value = false
  }
}

// 刪除專案
const handleDelete = async () => {
  if (!authStore.isAdmin) return

  const confirmed = await toast.confirm(
    `確定要刪除專案「${project.value?.name}」嗎？此動作無法復原。`,
    '危險操作',
  )

  if (!confirmed) return

  isDeleting.value = true
  try {
    await deleteDoc(doc(db, 'projects', projectId))
    toast.success('專案已成功刪除')
    router.push('/')
  } catch (error) {
    console.error(error)
    toast.error('刪除失敗')
  } finally {
    isDeleting.value = false
  }
}

// 時間格式化
const formatDate = (ts: Timestamp) => {
  if (!ts || !ts.toDate) return '-'
  return ts.toDate().toLocaleString('zh-TW')
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="errorMsg" class="text-center py-12">
      <div class="text-red-500 text-xl mb-4">⚠️ {{ errorMsg }}</div>
      <button @click="router.push('/')" class="text-primary-600 hover:underline">← 回到列表</button>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <button @click="router.push('/')" class="page-subtitle">← 返回專案列表</button>

        <div v-if="authStore.isAdmin" class="flex gap-3">
          <template v-if="!isEditing">
            <button @click="isEditing = true" class="btn-secondary">編輯</button>
            <button @click="handleDelete" :disabled="isDeleting" class="btn-danger">
              {{ isDeleting ? '刪除中...' : '刪除' }}
            </button>
          </template>
        </div>
      </div>

      <div v-if="isEditing" class="card p-8 space-y-6 transition-colors">
        <h2 class="page-title">編輯專案內容</h2>

        <ProjectForm
          v-if="project"
          :initial-data="project"
          :loading="isSaving"
          @submit="handleUpdate"
          @cancel="isEditing = false"
        />
      </div>

      <div v-else class="card overflow-hidden transition-colors">
        <div class="card-header">
          <div class="flex items-center gap-4 mb-4">
            <StatusBadge :status="project?.status || 'Active'" />
            <span class="text-meta">
              建立於：{{ formatDate(project?.createdAt as Timestamp) }}
            </span>
          </div>
          <h1 class="page-title">
            {{ project?.name }}
          </h1>
        </div>

        <div class="p-8 space-y-8">
          <div>
            <h3 class="detail-label">使用技術 Stack</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in project?.tech?.split(',') ?? []" :key="tech" class="tag">
                {{ tech.trim() }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="detail-label">專案描述 Description</h3>
            <div class="detail-content">
              {{ project?.description || '此專案尚無詳細描述...' }}
            </div>
          </div>

          <div>
            <h3 class="detail-label">專案截圖 Screenshots</h3>
            <div
              v-if="project?.screenshots && project?.screenshots.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div v-for="(imgUrl, index) in project?.screenshots" :key="index">
                <a
                  :href="imgUrl"
                  target="_blank"
                  class="flex items-center gap-2 overflow-hidden"
                  title="點擊預覽圖片"
                >
                  <span class="truncate link">{{ imgUrl }}</span>
                </a>
              </div>
            </div>
            <div v-else class="detail-meta">
              <span>此專案尚未上傳截圖</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
