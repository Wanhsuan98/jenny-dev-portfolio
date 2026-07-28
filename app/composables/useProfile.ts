import { computed } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import type { ProfileData } from '../types/profile'
import profileFallback from '../assets/profile-fallback.json'

export function useProfile() {
  const {
    data: profile,
    pending,
    refresh: fetchProfile,
  } = useAsyncData<ProfileData | null>(
    'profile',
    async () => {
      const { $db } = useNuxtApp()
      if (!$db) throw new Error('Database not initialized')
      const docRef = doc($db, 'profiles', 'aboutme')
      const snap = await getDoc(docRef)

      if (snap.exists()) {
        return snap.data() as ProfileData
      }
      throw new Error('找不到個人資料文件')
    },
    {
      server: false,
      default: () => profileFallback as ProfileData,
    },
  )

  const loading = computed(() => pending.value && !profile.value)

  return { profile, loading, fetchProfile }
}
