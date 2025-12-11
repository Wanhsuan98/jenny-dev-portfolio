<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import BaseTable from '@/components/BaseTable.vue'
import BaseChart from '@/components/BaseChart.vue'
import BaseModal from '@/components/BaseModal.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import type { Column } from '@/types/table'
import type { ChartData, ChartOptions } from 'chart.js'
import type { Project } from '@/types/project'

const authStore = useAuthStore()

const tableColumns: Column<Project>[] = [
  { key: 'name', label: '專案名稱', slot: true },
  { key: 'tech', label: '使用技術' },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
]

const projects = ref<Project[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)

let unsubscribe: null | (() => void) = null

onMounted(() => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    projects.value = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Project,
    )
  })
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

const handleAddProject = async (formData: Project) => {
  if (!formData.name || !formData.tech) return alert('請填寫完整資訊')

  isSubmitting.value = true
  try {
    await addDoc(collection(db, 'projects'), {
      ...formData,
      createdAt: serverTimestamp(),
    })

    isModalOpen.value = false
  } catch (error) {
    console.error('新增失敗', error)
    alert('新增失敗')
  } finally {
    isSubmitting.value = false
  }
}

const chartData = computed<ChartData<'bar'>>(() => {
  const active = projects.value.filter((p) => p.status === 'Active').length
  const completed = projects.value.filter((p) => p.status === 'Completed').length
  const pending = projects.value.filter((p) => p.status === 'Pending').length

  return {
    labels: ['Active', 'Completed', 'Pending'],
    datasets: [
      {
        label: '專案狀態統計',
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        data: [active, completed, pending],
        borderRadius: 4,
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
        <h1 class="page-title">專案總覽</h1>
        <p class="page-subtitle">管理您的所有 MarTech 專案進度。</p>
      </div>

      <button v-if="authStore.isAdmin" @click="isModalOpen = true" class="btn btn-primary gap-2">
        <span>+</span> 新增專案
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseChart :chart-data="chartData" :chart-options="chartOptions" />

      <div class="card-gradient-indigo">
        <div>
          <h3 class="text-lg font-medium opacity-90">總專案數</h3>
          <p class="text-4xl font-bold mt-2">{{ projects.length }}</p>
        </div>
        <div class="text-sm opacity-75">資料來自 Firestore</div>
      </div>
    </div>

    <BaseTable :columns="tableColumns" :data="projects">
      <template #cell-name="{ row }">
        <RouterLink :to="{ name: 'project-details', params: { id: row.id } }" class="link">
          {{ row.name }}
        </RouterLink>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="row.status" />
      </template>
    </BaseTable>

    <BaseModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      title="新增專案"
      @close="isModalOpen = false"
    >
      <ProjectForm
        :loading="isSubmitting"
        @submit="handleAddProject"
        @cancel="isModalOpen = false"
      />
    </BaseModal>
  </div>
</template>
