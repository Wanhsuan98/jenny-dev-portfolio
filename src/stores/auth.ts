import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthReady = ref(false)
  const router = useRouter()

  // 監聽登入狀態變化
  const initAuth = () => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      isAuthReady.value = true
    })
  }

  // 2. 登入功能
  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass)
    } catch (error: unknown) {
      console.error('登入失敗:', error)
      throw new Error('帳號或密碼錯誤')
    }
  }

  // 3. 登出功能
  const logout = async () => {
    await signOut(auth)
    user.value = null
    router.push('/login')
  }

  return {
    user,
    isAuthReady,
    initAuth,
    login,
    logout,
  }
})
