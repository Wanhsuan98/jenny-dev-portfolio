<script setup lang="ts">
import { ref, onMounted } from 'vue'

const liffStore = useLiffStore()
const toast = useToastStore()

const { checkInUser } = useAttendees()

const isSigningIn = ref(false)
const isFinished = ref(false)

onMounted(() => {
  liffStore.initLiff()
})

const handleCheckIn = async () => {
  // 防呆
  if (isSigningIn.value || isFinished.value) return

  if (!liffStore.isLoggedIn || !liffStore.profile) {
    liffStore.login()
    return
  }

  isSigningIn.value = true

  try {
    await checkInUser({
      userId: liffStore.profile.userId,
      displayName: liffStore.profile.displayName,
      pictureUrl: liffStore.profile.pictureUrl,
    })

    try {
      await liffStore.sendMessage(
        `✅ 簽到成功！\n\n我是 ${liffStore.profile.displayName}，我已抵達活動現場。`,
      )
    } catch (err) {
      console.warn(err, '非 LINE App 環境，略過訊息發送')
    }

    isFinished.value = true
    toast.success('簽到成功！資料已同步至後台 Dashboard')
  } catch (error) {
    console.error(error)
    toast.error('簽到發生錯誤，請稍後再試')
  } finally {
    isSigningIn.value = false
  }
}
</script>

<template>
  <div class="layout-login">
    <BaseLoading v-if="!liffStore.isInitialized" message="正在連接 LINE 服務..." />

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
