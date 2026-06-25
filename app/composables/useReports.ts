import { collection, doc, getDocs, getDoc } from 'firebase/firestore'

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
  const {
    data: reports,
    pending: loading,
    error,
    refresh: fetchReports,
  } = useAsyncData<ResearchReport[]>(
    'reports',
    async () => {
      const { $db } = useNuxtApp()
      if (!$db) return []
      const reportsCol = collection($db, 'reports')
      const snapshot = await getDocs(reportsCol)

      const fetchedReports: ResearchReport[] = []
      snapshot.forEach((doc) => {
        fetchedReports.push({ id: doc.id, ...doc.data() } as ResearchReport)
      })
      return fetchedReports
    },
    {
      server: false,
      default: () => [],
    },
  )

  const getReportById = async (id: string): Promise<ResearchReport | null> => {
    const { $db } = useNuxtApp()
    if (!$db) return null
    try {
      // 先看看本地有沒有
      const localReport = reports.value?.find((r) => r.id === id)
      if (localReport) {
        return localReport
      }

      // 如果本地沒有就去 Firebase 單獨抓一筆
      const reportRef = doc($db, 'reports', id)
      const docSnap = await getDoc(reportRef)

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as ResearchReport
        // 加入快取
        if (reports.value) {
          reports.value.push(data)
        }
        return data
      } else {
        return null
      }
    } catch (err) {
      console.error('Error fetching report detail:', err)
      return null
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
