const SENTENCE_PUNCTUATION = /[。，、；：,.;:!?！？]/
// 例如「1. 專案背景：」「2. 核心挑戰與角色：」
const LIST_LABEL = /\d+\.\s*[^\s：:]{1,12}[：:]\s*/g

const isHeadingLine = (line = '') => line.length <= 15 && !SENTENCE_PUNCTUATION.test(line)

/**
 * 將長篇介紹文字整理成 meta description
 * - 移除開頭沒有標點的短標題行（如「專案背景與核心貢獻」）與條列標籤（如「1. 專案背景：」）
 * - 超過長度時優先在句號處截斷，否則截斷並補上「…」
 * @param text 原始介紹文字
 * @param maxLength 最大字數
 * @returns 整理後的描述，原文為空時回傳 undefined
 */
export const toMetaDescription = (text?: string, maxLength = 100): string | undefined => {
  if (!text) return undefined

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  while (lines.length > 1 && isHeadingLine(lines[0])) {
    lines.shift()
  }

  const normalized = lines.join(' ').replace(LIST_LABEL, '').replace(/\s+/g, ' ').trim()
  if (!normalized) return undefined
  if (normalized.length <= maxLength) return normalized

  const truncated = normalized.slice(0, maxLength)
  const lastPeriod = truncated.lastIndexOf('。')
  if (lastPeriod >= maxLength / 2) return truncated.slice(0, lastPeriod + 1)

  return `${truncated.slice(0, maxLength - 1)}…`
}
