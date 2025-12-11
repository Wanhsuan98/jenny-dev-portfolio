import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

// 確認對話框的狀態介面
interface ConfirmState {
  isOpen: boolean
  title: string
  message: string
  resolve: ((value: boolean) => void) | null
}

export const useToastStore = defineStore('toast', () => {
  // ==============================
  // Toast 通知
  // ==============================
  const toasts = ref<Toast[]>([])
  let nextId = 0

  const show = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = nextId++
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  const success = (msg: string) => show(msg, 'success')
  const error = (msg: string) => show(msg, 'error')
  const info = (msg: string) => show(msg, 'info')
  const warning = (msg: string) => show(msg, 'warning')

  // ==============================
  // Promise-based Confirm
  // ==============================
  const confirmState = ref<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    resolve: null,
  })

  const confirm = (message: string, title = '確認操作'): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmState.value = {
        isOpen: true,
        title,
        message,
        resolve,
      }
    })
  }

  const resolveConfirm = (value: boolean) => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(value)
    }
    // 重置並關閉
    confirmState.value.isOpen = false
    confirmState.value.resolve = null
  }

  return {
    toasts,
    show,
    remove,
    success,
    error,
    info,
    warning,
    confirmState,
    confirm,
    resolveConfirm,
  }
})
