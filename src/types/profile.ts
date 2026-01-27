// src/types/profile.ts
export interface Education {
  school: string
  major: string
  date: string
  desc?: string
}

export interface Experience {
  date: string
  title: string
  company: string
  desc: string
  achievements?: string[]
}

export interface ProfileData {
  basicInfo: {
    name: string
    title: string
    bio: string
    avatar: string
    resumeUrl?: string
  }
  skills: Array<{
    label: string
    value: number
  }>
  experiences: Experience[]
  educations: Education[]
}
