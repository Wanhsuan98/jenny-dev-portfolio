import { describe, it, expect } from 'vitest'
import { formatDate } from './date'
import { Timestamp } from 'firebase/firestore'

describe('Utils: date.ts', () => {
  it('should return "-" if an invalid timestamp is provided', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate({})).toBe('-')
  })

  it('should format a valid Firebase Timestamp correctly', () => {
    // 模擬 Timestamp 行為
    const mockDateObj = new Date('2025-01-01T12:00:00Z')
    const mockTimestamp = {
      toDate: () => mockDateObj,
    } as unknown as Timestamp

    const formatted = formatDate(mockTimestamp)
    expect(formatted).toContain('2025')
  })
})
