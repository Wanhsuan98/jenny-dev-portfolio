// src/types/profile.ts
export interface ProfileData {
  basicInfo: {
    name: string
    title: string
    bio: string[]
    avatar: string
    email?: string
    resumeUrl?: string
    resumeUrlEn?: string
  }
}
