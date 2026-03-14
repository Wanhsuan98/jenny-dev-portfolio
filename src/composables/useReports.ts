import { ref } from 'vue'
import { collection, doc, getDocs, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export interface ResearchReport {
  id: string
  title: string
  tag: string
  date: string
  summary: string
  readTime: string
  link: string
  context: string
  takeaways: string[]
  outline: string[]
  fileSize: string
}

export function useReports() {
  const reports = ref<ResearchReport[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchReports = async () => {
    loading.value = true
    error.value = null
    try {
      const reportsCol = collection(db, 'reports')
      const snapshot = await getDocs(reportsCol)

      const fetchedReports: ResearchReport[] = []
      snapshot.forEach((doc) => {
        fetchedReports.push({ id: doc.id, ...doc.data() } as ResearchReport)
      })

      reports.value = fetchedReports
      return fetchedReports
    } catch {
      console.error('Error fetching reports:')
      error.value = '無法載入報告資料，請稍後再試'
      return []
    } finally {
      loading.value = false
    }
  }

  const getReportById = async (id: string): Promise<ResearchReport | null> => {
    loading.value = true
    error.value = null
    try {
      // 先看看本地有沒有
      const localReport = reports.value.find((r) => r.id === id)
      if (localReport) {
        loading.value = false
        return localReport
      }

      // 如果本地沒有就去 Firebase 單獨抓一筆
      const reportRef = doc(db, 'reports', id)
      const docSnap = await getDoc(reportRef)

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as ResearchReport
        // 加入快取
        reports.value.push(data)
        return data
      } else {
        error.value = '找不到該報告'
        return null
      }
    } catch {
      console.error('Error fetching report detail:')
      error.value = '載入失敗，請稍後再試'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    reports,
    loading,
    error,
    fetchReports,
    getReportById,
  }
}
