<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import BaseTable from '@/components/BaseTable.vue'
import BaseChart from '@/components/BaseChart.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import type { Column } from '@/types/table'
import type { ChartData, ChartOptions } from 'chart.js'

const authStore = useAuthStore()

// 定義資料介面
interface Attendee {
  id: string
  userId: string
  displayName: string
  pictureUrl: string
  status: string
  checkInTime: Timestamp | null
}

const tableColumns: Column<Attendee>[] = [
  { key: 'pictureUrl', label: '用戶', slot: true, width: '80px', align: 'center' },
  { key: 'displayName', label: '暱稱', slot: true },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
  { key: 'checkInTime', label: '簽到時間', slot: true, align: 'right' },
]

const attendees = ref<Attendee[]>([])

let unsubscribe: null | (() => void) = null

onMounted(() => {
  const q = query(collection(db, 'attendees'), orderBy('checkInTime', 'desc'))

  // 將 unsubscribe 存起來
  unsubscribe = onSnapshot(q, (snapshot) => {
    attendees.value = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Attendee,
    )
  })
})

onUnmounted(() => {
  // 離開頁面時取消監聽，防止記憶體洩漏
  if (unsubscribe) unsubscribe()
})

// 時間格式化
const formatDate = (ts: Timestamp | null) => {
  if (!ts) return '-'
  const date = ts.toDate()
  return date.toLocaleString('zh-TW', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 名字模糊處理函式
const maskName = (name: string) => {
  if (authStore.isAdmin) return name
  if (authStore.isObserver) {
    if (!name) return '***'
    if (name.length <= 2) return name[0] + '*'
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
  }
  return name
}

// 圖表資料
const chartData = computed<ChartData<'bar'>>(() => {
  const checkedInCount = attendees.value.length
  const targetCount = 10
  return {
    labels: ['已簽到人數', '目標人數'],
    datasets: [
      {
        label: '活動參與狀況',
        backgroundColor: ['#10b981', '#cbd5e1'],
        data: [checkedInCount, targetCount],
        borderRadius: 4,
        barThickness: 50,
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">活動即時監控</h1>
        <p class="page-subtitle">即時同步 LINE 用戶的簽到狀況。</p>
      </div>
      <div class="badge badge-md badge-primary">目前人數：{{ attendees.length }} 人</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseChart :chart-data="chartData" :chart-options="chartOptions" />

      <div class="card-gradient-green">
        <div>
          <h3 class="text-lg font-medium opacity-90">最新簽到</h3>
          <p class="text-3xl font-bold mt-2 truncate">
            {{ attendees[0] ? maskName(attendees[0].displayName) : '尚無人簽到' }}
          </p>
        </div>
        <div class="text-sm opacity-75">系統運作正常</div>
      </div>
    </div>

    <BaseTable :columns="tableColumns" :data="attendees">
      <template #cell-pictureUrl="{ row }">
        <div class="flex justify-center">
          <img
            v-if="row.pictureUrl"
            :src="row.pictureUrl"
            class="avatar"
            :class="{ 'blur-[3px]': authStore.isObserver }"
            alt="Avatar"
            title="個資已受保護 (觀察者模式)"
          />
          <div v-else class="avatar-placeholder">?</div>
        </div>
      </template>

      <template #cell-displayName="{ row }">
        <span :class="{ 'text-gray-500 dark:text-gray-300 italic': authStore.isObserver }">
          {{ maskName(row.displayName) }}
        </span>
      </template>

      <template #cell-status="{ row }">
        <StatusBadge :status="row.status" />
      </template>

      <template #cell-checkInTime="{ row }">
        <span class="text-gray-500 dark:text-gray-300 font-mono text-sm">
          {{ formatDate(row.checkInTime) }}
        </span>
      </template>
    </BaseTable>
  </div>
</template>
