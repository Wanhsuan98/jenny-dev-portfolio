<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLiffStore } from '@/stores/liff'
import { useToastStore } from '@/stores/toast'
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import liff from '@line/liff'

const liffStore = useLiffStore()
const toast = useToastStore()
const isSigningIn = ref(false)
const isFinished = ref(false)

onMounted(() => {
  liffStore.initLiff()
})

const handleCheckIn = async () => {
  if (isSigningIn.value) return

  isSigningIn.value = true

  try {
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href })
      return
    }

    const profile = await liff.getProfile()

    const checkInData = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || '',
      checkInTime: serverTimestamp(),
      status: 'Checked In',
    }

    await addDoc(collection(db, 'attendees'), checkInData)

    try {
      await liffStore.sendMessage(
        `✅ 簽到成功！\n\n我是 ${profile.displayName}，我已抵達活動現場。`,
      )
    } catch (err) {
      // 這裡報錯不需要中斷流程，使用者可能是在電腦版 Chrome 開的
      console.warn('無法發送 LINE 訊息 (可能是在外部瀏覽器)', err)
    }

    isFinished.value = true
    toast.success('簽到成功！資料已同步至後台 Dashboard')
  } catch (error) {
    console.error('簽到失敗:', error)
    toast.error('簽到發生錯誤，請稍後再試')
  } finally {
    isSigningIn.value = false
  }
}
</script>

<template>
  <div class="layout-login">
    <div v-if="!liffStore.isInitialized" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      <p class="mt-4 text-meta">正在連接 LINE 服務...</p>
    </div>

    <div
      v-else-if="liffStore.isLoggedIn && liffStore.profile"
      class="card w-full max-w-sm text-center p-8 border-t-4 border-t-primary-500"
    >
      <img
        v-if="liffStore.profile.pictureUrl"
        :src="liffStore.profile.pictureUrl"
        alt="User Profile"
        class="avatar-xl mx-auto mb-4"
      />
      <div v-else class="avatar-placeholder-xl mx-auto mb-4">👤</div>

      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
        {{ liffStore.profile.displayName }}
      </h2>
      <p class="page-subtitle">歡迎來到活動報名系統</p>

      <div class="mt-8 space-y-3">
        <button
          @click="handleCheckIn"
          :disabled="isSigningIn || isFinished"
          class="btn-primary w-full py-3 text-lg"
        >
          <span v-if="isSigningIn" class="flex items-center gap-2">
            <span class="animate-spin">⚪</span> 處理中...
          </span>
          <span v-else-if="isFinished">✅ 已完成簽到</span>
          <span v-else>立即簽到</span>
        </button>

        <button @click="liffStore.logout" class="btn-ghost w-full text-sm">登出</button>
      </div>
    </div>

    <div v-else class="text-center w-full max-w-sm">
      <div class="card p-8 shadow-xl">
        <h1 class="page-title mb-2">請先登入</h1>

        <p class="page-subtitle mb-6 text-sm">需要登入 LINE 帳號才能進行報名</p>

        <button @click="liffStore.login" class="btn-line w-full py-3 rounded-xl">
          使用 LINE 登入
        </button>
      </div>
    </div>
  </div>
</template>
