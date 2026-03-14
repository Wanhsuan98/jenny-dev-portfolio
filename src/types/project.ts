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

export interface LabHighlight {
  iconType: 'server' | 'shield' | 'key' | 'database' | 'code' | 'check'
  title: string
  description: string
}

export interface LabPipelineStep {
  title: string
  description: string
}

export interface LabAction {
  label: string
  description: string
  iconType: 'zap' | 'dashboard' | 'external' | 'link'
  themeColor: 'indigo' | 'green' | 'blue'
  to?: string
  href?: string
}

export interface LabTechDetail {
  label: string
  content: string
  iconType?: 'code' | 'server' | 'database' | 'cpu' | 'layers'
}

export interface Project {
  id?: string
  name?: string
  status?: 'Active' | 'Completed' | 'Pending'
  isConfidential: boolean
  isLab?: boolean
  isFeatured?: boolean
  techFrontend: string
  techDatabase: string
  techDeployment: string
  techCore?: string
  description: string
  screenshots?: (string | ImageDetail)[]
  architectureImages?: (string | ImageDetail)[]
  tabs: ProjectTab[]
  labTechArchitecture?: LabTechDetail[]
  labHighlights?: LabHighlight[]
  labPipeline?: LabPipelineStep[]
  labActions?: LabAction[]
  externalUrl?: string
  createdAt?: Timestamp
}
