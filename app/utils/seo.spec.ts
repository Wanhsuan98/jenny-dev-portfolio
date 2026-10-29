import { describe, it, expect } from 'vitest'
import { toMetaDescription } from './seo'

describe('Utils: seo.ts', () => {
  it('should return undefined for empty text', () => {
    expect(toMetaDescription(undefined)).toBeUndefined()
    expect(toMetaDescription('')).toBeUndefined()
    expect(toMetaDescription(' \n ')).toBeUndefined()
  })

  it('should keep short text and collapse line breaks', () => {
    expect(toMetaDescription('本專案展示前後端整合。\n實作完整開發流程。')).toBe(
      '本專案展示前後端整合。 實作完整開發流程。',
    )
  })

  it('should remove heading lines and list labels', () => {
    const text = '專案背景與核心貢獻\n1. 專案背景： 打造官網。\n\n2. 核心挑戰與角色：負責前端架構。'
    expect(toMetaDescription(text)).toBe('打造官網。 負責前端架構。')
  })

  it('should truncate at the last period when it is past half of the limit', () => {
    const text = `${'甲'.repeat(60)}。${'乙'.repeat(60)}`
    expect(toMetaDescription(text)).toBe(`${'甲'.repeat(60)}。`)
  })

  it('should truncate with an ellipsis when no suitable period exists', () => {
    const result = toMetaDescription('丙'.repeat(150))
    expect(result).toHaveLength(100)
    expect(result?.endsWith('…')).toBe(true)
  })
})
