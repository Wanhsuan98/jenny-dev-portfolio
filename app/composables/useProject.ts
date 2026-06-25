/**
 * 主要功能:
 * 1. 讀取單一資料: 根據 ID 抓取特定專案詳情。
 * 2. 更新 (Update): 修改特定專案的內容。
 * 3. 刪除 (Delete): 移除特定專案。
 */
import { ref, computed, nextTick } from 'vue'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import type { Project } from '../types/project'

export function useProject(idSource?: string | (() => string)) {
  const { $db } = useNuxtApp()
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
      throw new Error('找不到此專案，可能已被刪除。')
    },
    {
      server: false,
      default: () => null,
      watch: [id],
    },
  )

  const isLoading = computed(() => import.meta.server || pending.value)
  const errorMsg = computed(() => (error.value ? error.value.message : ''))

  const fetchProject = async (targetId?: string) => {
    if (targetId && !idSource) {
      manualId.value = targetId
      await nextTick()
    }
    await refresh()
  }

  // 更新專案
  const updateProject = async (targetId: string, formData: Partial<Project>) => {
    if (!$db) throw new Error('Database not initialized')
    try {
      const docRef = doc($db, 'projects', targetId)
      const updatePayload = {
        name: formData.name || '',
        techFrontend: formData.techFrontend || '',
        techDatabase: formData.techDatabase || '',
        techDeployment: formData.techDeployment || '',
        techCore: formData.techCore || '',
        status: formData.status || 'Active',
        isConfidential: formData.isConfidential ?? false,
        description: formData.description || '',
        tabs: formData.tabs || [],
      }

      await updateDoc(docRef, updatePayload)

      if (project.value) {
        Object.assign(project.value, formData)
      }
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // 刪除專案
  const deleteProject = async (targetId: string) => {
    if (!$db) throw new Error('Database not initialized')
    try {
      await deleteDoc(doc($db, 'projects', targetId))
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    project,
    isLoading,
    errorMsg,
    fetchProject,
    updateProject,
    deleteProject,
  }
}
