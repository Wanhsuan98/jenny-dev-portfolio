/**
 * SSR payload: 讓 Firestore Timestamp 能從伺服器傳到客戶端並還原成 Timestamp。
 */
import { Timestamp } from 'firebase/firestore'

export default definePayloadPlugin(() => {
  definePayloadReducer(
    'FirestoreTimestamp',
    (value) => value instanceof Timestamp && [value.seconds, value.nanoseconds],
  )
  definePayloadReviver(
    'FirestoreTimestamp',
    ([seconds, nanoseconds]: [number, number]) => new Timestamp(seconds, nanoseconds),
  )
})
