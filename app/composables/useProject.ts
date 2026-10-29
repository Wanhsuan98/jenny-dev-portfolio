/**
 * 讀取單一資料: 根據 ID 抓取特定專案詳情。
 */
import { ref, computed, nextTick } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import type { Project } from '../types/project'

export function useProject(idSource?: string | (() => string)) {
  const { $db } = useNuxtApp()
  const event = useRequestEvent()
  const manualId = ref('')

  const id = computed(() => {
    if (idSource) {
      return typeof idSource === 'function' ? idSource() : idSource
    }
    return manualId.value
  })

  const {
    data: project,
    pending,
    error,
    refresh,
  } = useAsyncData(
    () => (id.value ? `project-${id.value}` : 'project-empty'),
    async () => {
      if (!id.value || !$db) return null
      const docRef = doc($db, 'projects', id.value)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Project
      }
      // 伺服器端回傳 404，避免不存在的專案被當成正常頁面收錄
      if (event) setResponseStatus(event, 404)
      throw createError({ statusCode: 404, message: '找不到此專案，可能已被刪除。' })
    },
    {
      default: () => null,
      watch: [id],
    },
  )

  const isLoading = computed(() => pending.value)
  const errorMsg = computed(() => (error.value ? error.value.message : ''))
  const isNotFound = computed(() => error.value?.statusCode === 404)

  const fetchProject = async (targetId?: string) => {
    if (targetId && !idSource) {
      manualId.value = targetId
      await nextTick()
    }
    await refresh()
  }

  return {
    project,
    isLoading,
    errorMsg,
    isNotFound,
    fetchProject,
  }
}
