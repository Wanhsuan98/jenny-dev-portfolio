<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import BaseTable from '@/components/BaseTable.vue'
import BaseChart from '@/components/BaseChart.vue'
import type { Column } from '@/types/table'
import type { ChartData, ChartOptions } from 'chart.js'

// 1. 定義新的資料介面 (對應 LIFF 寫入的欄位)
interface Attendee {
  id: string
  userId: string
  displayName: string
  pictureUrl: string
  status: string
  checkInTime: Timestamp | null // Firebase 的時間格式
}

// 2. 更新表格欄位設定
const tableColumns: Column<Attendee>[] = [
  { key: 'pictureUrl', label: '用戶', slot: true, width: '80px', align: 'center' }, // 頭貼
  { key: 'displayName', label: '暱稱' },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
  { key: 'checkInTime', label: '簽到時間', slot: true, align: 'right' }, // 時間需要格式化
]

const attendees = ref<Attendee[]>([])

// 3. 改用 onSnapshot 實現「即時監聽」 (Real-time Listener)
// 只要有人在手機上簽到，這裡的程式碼會自動觸發，不用重新整理網頁！
onMounted(() => {
  // 建立查詢：抓取 attendees 集合，並依照簽到時間倒序排列 (最新的在上面)
  const q = query(collection(db, 'attendees'), orderBy('checkInTime', 'desc'))

  // 開啟監聽器
  onSnapshot(q, (snapshot) => {
    const tempAttendees: Attendee[] = []
    snapshot.forEach((doc) => {
      tempAttendees.push({
        id: doc.id,
        ...doc.data(),
      } as Attendee)
    })
    attendees.value = tempAttendees
    console.log('📦 後台收到最新簽到資料:', tempAttendees)
  })
})

// 4. 工具函式：把 Firebase Timestamp 轉成好看的時間字串
const formatDate = (ts: Timestamp | null) => {
  if (!ts) return '-'
  const date = ts.toDate() // 轉成 JS Date 物件
  return date.toLocaleString('zh-TW', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// --- 圖表邏輯 (統計簽到人數) ---
const chartData = computed<ChartData<'bar'>>(() => {
  // 這裡我們簡單統計一下「已簽到」的人數
  // 為了讓圖表豐富一點，我們假裝有一個目標人數 (例如 10 人)
  const checkedInCount = attendees.value.length
  const targetCount = 10

  return {
    labels: ['已簽到人數', '目標人數'],
    datasets: [
      {
        label: '活動參與狀況',
        backgroundColor: ['#10b981', '#cbd5e1'], // 綠色 vs 灰色
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
        <h1 class="text-2xl font-bold text-gray-800">活動即時監控</h1>
        <p class="text-gray-500 mt-1">即時同步 LINE 用戶的簽到狀況。</p>
      </div>
      <div class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium">
        目前人數：{{ attendees.length }} 人
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseChart :chart-data="chartData" :chart-options="chartOptions" />

      <div
        class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white shadow-md flex flex-col justify-between"
      >
        <div>
          <h3 class="text-lg font-medium opacity-90">最新簽到</h3>
          <p class="text-3xl font-bold mt-2 truncate">
            {{ attendees[0]?.displayName || '尚無人簽到' }}
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
            class="w-10 h-10 rounded-full border border-gray-200 object-cover"
            alt="Avatar"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
          >
            ?
          </div>
        </div>
      </template>

      <template #cell-status="{ row }">
        <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          {{ row.status }}
        </span>
      </template>

      <template #cell-checkInTime="{ row }">
        <span class="text-gray-500 font-mono text-sm">
          {{ formatDate(row.checkInTime) }}
        </span>
      </template>
    </BaseTable>
  </div>
</template>
