/**
 * 列表監聽: 負責從 Firestore 抓取整份清單。
 */
import { ref, onUnmounted } from 'vue'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import type { Project } from '../types/project'

export function useProjects() {
  const projects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: (() => void) | null = null

  // 初始化
  const initProjectsListener = () => {
    const { $db } = useNuxtApp()
    if (!$db) return

    isLoading.value = true
    const q = query(collection($db, 'projects'), orderBy('createdAt', 'desc'))

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

  return {
    projects,
    isLoading,
    error,
    initProjectsListener,
  }
}
