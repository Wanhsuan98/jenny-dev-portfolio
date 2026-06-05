import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToastStore } from './toast'

describe('Store: useToastStore', () => {
  beforeEach(() => {
    // 每次測試前重置 Pinia 狀態
    setActivePinia(createPinia())
    // 啟用假時間 (Fake Timers) 來控制 setTimeout
    vi.useFakeTimers()
  })

  afterEach(() => {
    // 測試結束後還原真實時間
    vi.restoreAllMocks()
  })

  it('初始狀態 toast 清單應該是空的', () => {
    const store = useToastStore()
    expect(store.toasts).toHaveLength(0)
  })

  it('成功新增一個 toast 後，清單應該會有對應的狀態與訊息', () => {
    const store = useToastStore()

    store.success('儲存成功！')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0]?.message).toBe('儲存成功！')
    expect(store.toasts[0]?.type).toBe('success')
    // 確認都有獨立的 ID
    expect(store.toasts[0]?.id).toBeDefined()
  })

  it('如果手動觸發 remove()，指定的 toast 會被移除', () => {
    const store = useToastStore()

    store.info('一號通知')
    store.error('二號通知')
    expect(store.toasts).toHaveLength(2)

    // 取得第一筆通知的 ID 並移除它
    const targetId = store.toasts[0]!.id
    store.remove(targetId)

    // 只剩下 '二號通知'，長度變為 1
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0]?.message).toBe('二號通知')
  })

  it('Toast 會在預設的 duration (3 秒) 到期後自動消失', () => {
    const store = useToastStore()

    // 發送一個維持 3000ms 的通知
    store.show('這會在三秒後消失', 'warning', 3000)
    expect(store.toasts).toHaveLength(1)

    // 快轉系統時間往前走 2900 毫秒 -> 應該還在
    vi.advanceTimersByTime(2900)
    expect(store.toasts).toHaveLength(1)

    // 再快轉系統時間往前走 100 毫秒 (累積達 3000ms) -> 應該要消失
    vi.advanceTimersByTime(100)
    expect(store.toasts).toHaveLength(0)
  })

  it('觸發 confirm 時會改變狀態，並且可以透過 resolveConfirm 取代 Promise', async () => {
    const store = useToastStore()

    // 發起一個對話框並等待
    // 注意：這裡不加 await，因為加了會卡住，我們要模擬點擊
    const confirmPromise = store.confirm('你確定要刪除嗎？', '危險操作')

    // 狀態會立刻變成打開
    expect(store.confirmState.isOpen).toBe(true)
    expect(store.confirmState.message).toBe('你確定要刪除嗎？')
    expect(store.confirmState.title).toBe('危險操作')

    // 模擬使用者點擊了「確認 (true)」
    store.resolveConfirm(true)

    // 等待 Promise 回傳結果
    const result = await confirmPromise
    expect(result).toBe(true)

    // 操作完成後，對話框要自動關閉
    expect(store.confirmState.isOpen).toBe(false)
  })
})
