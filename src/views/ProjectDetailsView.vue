<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router' // 路由工具
import { doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const projectId = route.params.id as string

const project = ref<any>(null)
const isLoading = ref(true)
const errorMsg = ref('')
const isDeleting = ref(false)

onMounted(async () => {
  try {
    const docRef = doc(db, 'projects', projectId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      project.value = { id: docSnap.id, ...docSnap.data() }
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

// 刪除專案
const handleDelete = async () => {
  // 先檢查權限
  if (!authStore.isAdmin) {
    alert('您沒有刪除權限！')
    return
  }

  if (!confirm('確定要刪除這個專案嗎？此動作無法復原。')) return

  isDeleting.value = true
  try {
    await deleteDoc(doc(db, 'projects', projectId))
    alert('專案已刪除')
    router.push('/')
  } catch (err) {
    alert('刪除失敗，權限不足')
  } finally {
    isDeleting.value = false
  }
}

// 時間格式化
const formatDate = (ts: Timestamp) => {
  if (!ts) return '-'
  return ts.toDate().toLocaleString('zh-TW')
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="errorMsg" class="text-center py-12">
      <div class="text-red-500 text-xl mb-4">⚠️ {{ errorMsg }}</div>
      <button @click="router.push('/')" class="text-indigo-600 hover:underline">← 回到列表</button>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <button
          @click="router.push('/')"
          class="flex items-center text-gray-500 hover:text-indigo-600 transition"
        >
          <span class="mr-1">←</span> 返回專案列表
        </button>

        <button
          v-if="authStore.isAdmin"
          @click="handleDelete"
          :disabled="isDeleting"
          class="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition flex items-center gap-2 text-sm font-medium"
        >
          <span v-if="isDeleting">刪除中...</span>
          <span v-else>刪除專案</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div class="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div class="flex items-center gap-4 mb-4">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              :class="{
                'bg-green-100 text-green-700': project.status === 'Active',
                'bg-blue-100 text-blue-700': project.status === 'Completed',
                'bg-yellow-100 text-yellow-700': project.status === 'Pending',
              }"
            >
              {{ project.status }}
            </span>
            <span class="text-gray-400 text-sm"> 建立於：{{ formatDate(project.createdAt) }} </span>
          </div>
          <h1 class="text-4xl font-extrabold text-gray-800 tracking-tight">
            {{ project.name }}
          </h1>
        </div>

        <div class="p-8 space-y-8">
          <div>
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              使用技術 Stack
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.tech.split(',')"
                :key="tech"
                class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium"
              >
                {{ tech.trim() }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              專案描述 Description
            </h3>
            <div class="prose max-w-none text-gray-600 leading-relaxed">
              <p v-if="project.description">
                {{ project.description }}
              </p>
              <p v-else class="italic text-gray-400">
                此專案尚無詳細描述...
                <br />
                (這是因為我們目前的 Firebase 資料庫只有 name 和 tech 欄位，
                未來擴充欄位後，這裡就會顯示真正的內容。)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
