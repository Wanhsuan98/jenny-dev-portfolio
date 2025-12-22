/**
 * 主要功能:
 * 1. 列表監聽: 負責從 Firestore 抓取整份清單。
 * 2. 新增專案 (Add): 因為新增是將資料丟入「集合」中，所以歸類在此。
 */
import { ref, onUnmounted } from 'vue'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Project } from '@/types/project'

export function useProjects() {
  const projects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: (() => void) | null = null

  // 初始化
  const initProjectsListener = () => {
    isLoading.value = true
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        projects.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[]
        isLoading.value = false
      },
      (err) => {
        console.error(err)
        error.value = '無法載入專案列表'
        isLoading.value = false
      },
    )
  }

  // 停止監聽
  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  // 新增專案
  const addProject = async (formData: Project) => {
    try {
      await addDoc(collection(db, 'projects'), {
        ...formData,
        createdAt: serverTimestamp(),
      })
      return true
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return {
    projects,
    isLoading,
    error,
    initProjectsListener,
    addProject,
  }
}
