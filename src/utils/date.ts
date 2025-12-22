import { Timestamp } from 'firebase/firestore'

/**
 * 將 Firebase Timestamp 格式化為本地時間字串
 * @param ts Firebase Timestamp 物件
 * @param options Intl.DateTimeFormatOptions 格式設定
 * @returns 格式化後的日期字串
 */
export const formatDate = (ts: unknown, options?: Intl.DateTimeFormatOptions): string => {
  if (ts && typeof (ts as Timestamp).toDate === 'function') {
    const date = (ts as Timestamp).toDate()

    if (!options) {
      return date.toLocaleString('zh-TW')
    }

    return date.toLocaleString('zh-TW', options)
  }
  return '-'
}
