/** * 專案資料介面 */
import { Timestamp } from 'firebase/firestore'

export interface Project {
  id?: string
  name?: string
  status?: 'Active' | 'Completed' | 'Pending'
  tech?: string
  screenshots?: string[]
  description?: string
  createdAt?: Timestamp
}
