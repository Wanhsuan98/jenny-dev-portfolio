/**
 * 主要功能:
 * 1. 讀取單一資料: 根據 ID 抓取特定專案詳情。
 * 2. 更新 (Update): 修改特定專案的內容。
 * 3. 刪除 (Delete): 移除特定專案。
 */
import { ref } from 'vue'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Project } from '@/types/project'

export function useProject() {
  const project = ref<Project | null>(null)
  const isLoading = ref(false)
  const errorMsg = ref('')

  const fetchProject = async (id: string) => {
    isLoading.value = true
    errorMsg.value = ''
    try {
      const docRef = doc(db, 'projects', id)
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
  }

  // 更新專案
  const updateProject = async (id: string, formData: Partial<Project>) => {
    try {
      const docRef = doc(db, 'projects', id)
      await updateDoc(docRef, {
        name: formData.name,
        techFrontend: formData.techFrontend,
        techDatabase: formData.techDatabase,
        techDeployment: formData.techDeployment,
        techCore: formData.techCore || '',
        status: formData.status,
        description: formData.description,
        screenshots: formData.screenshots,
      })

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
  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id))
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
