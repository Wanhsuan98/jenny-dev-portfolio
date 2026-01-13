/** * 專案資料介面 */
import { Timestamp } from 'firebase/firestore'

export interface ImageDetail {
  url: string
  caption: string
  description: string
}

// 定義 Tab 結構
export interface ProjectTab {
  id: string
  name: string
  mode: 'gallery' | 'tech'
  images: ImageDetail[]
}

export interface Project {
  id?: string
  name?: string
  status?: 'Active' | 'Completed' | 'Pending'
  isConfidential: boolean
  techFrontend: string
  techDatabase: string
  techDeployment: string
  techCore?: string
  description: string
  screenshots?: (string | ImageDetail)[]
  architectureImages?: (string | ImageDetail)[]
  tabs: ProjectTab[]
  createdAt?: Timestamp
}
