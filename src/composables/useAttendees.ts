/**
 * 主要功能:
 * 1. 監聽簽到名單 (Real-time Listener)
 * 2. 處理簽到 (Create/Check-in)
 */

import { ref, onUnmounted } from 'vue'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Attendee } from '@/types/attendee'

interface CheckInPayload {
  userId: string
  displayName: string
  pictureUrl?: string
}

export function useAttendees() {
  const attendees = ref<Attendee[]>([])
  const isLoading = ref(false)
  let unsubscribe: (() => void) | null = null

  // 監聽名單
  const initAttendeesListener = () => {
    isLoading.value = true
    const q = query(collection(db, 'attendees'), orderBy('checkInTime', 'desc'))
    unsubscribe = onSnapshot(q, (snapshot) => {
      attendees.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Attendee[]
      isLoading.value = false
    })
  }

  // 自動清理
  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  // 使用者簽到
  const checkInUser = async (payload: CheckInPayload) => {
    try {
      // 封裝資料並寫入資料庫
      await addDoc(collection(db, 'attendees'), {
        userId: payload.userId,
        displayName: payload.displayName,
        pictureUrl: payload.pictureUrl || '',
        status: 'Checked In',
        checkInTime: serverTimestamp(),
      })
      return true
    } catch (error) {
      console.error('簽到寫入失敗:', error)
      throw error
    }
  }

  return {
    attendees,
    isLoading,
    initAttendeesListener,
    checkInUser,
  }
}
