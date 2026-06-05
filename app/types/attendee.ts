import type { Timestamp } from 'firebase/firestore'

export interface Attendee {
  id: string
  userId: string
  displayName: string
  pictureUrl: string
  status: string
  checkInTime: Timestamp | null
}
