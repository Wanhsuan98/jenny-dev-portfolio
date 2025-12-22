<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useProjects } from '@/composables/useProjects'
import BaseTable from '@/components/BaseTable.vue'
import BaseChart from '@/components/BaseChart.vue'
import BaseModal from '@/components/BaseModal.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import type { Column } from '@/types/table'
import type { Project } from '@/types/project'
import type { ChartData, ChartOptions } from 'chart.js'

const authStore = useAuthStore()
const toast = useToastStore()

const { projects, initProjectsListener, addProject } = useProjects()

const tableColumns: Column<Project>[] = [
  { key: 'name', label: '專案名稱', slot: true },
  { key: 'techFrontend', label: '主要技術Stack', slot: true },
  { key: 'status', label: '狀態', slot: true, align: 'center' },
]

const isModalOpen = ref(false)
const isSubmitting = ref(false)

onMounted(() => {
  initProjectsListener()
})

const handleAddProject = async (formData: Project) => {
  isSubmitting.value = true
  try {
    await addProject(formData)
    toast.success('新增成功')
    isModalOpen.value = false
  } catch (error) {
    console.log(error)
    toast.error('新增失敗')
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

      <button
        v-if="authStore.isAdmin"
        @click="isModalOpen = true"
        class="btn-primary flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>

        <span class="hidden md:inline">新增專案</span>
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

      <template #cell-techFrontend="{ row }">
        <div class="whitespace-nowrap overflow-hidden text-ellipsis">
          <span class="detail-label">
            {{ row.techFrontend }}
          </span>
          <template v-if="row.techCore">
            <span class="mx-1.5 text-slate-400 font-light">&</span>
            <span class="detail-label">
              {{ row.techCore }}
            </span>
          </template>
        </div>
      </template>

      <template #cell-status="{ row }">
        <span
          class="badge badge-sm"
          :class="{
            'badge-success': row.status === 'Active',
            'badge-info': row.status === 'Completed',
            'badge-warning': row.status === 'Pending',
          }"
        >
          {{ row.status }}
        </span>
      </template>
    </BaseTable>

    <BaseModal :is-open="isModalOpen" title="新增專案" @close="isModalOpen = false">
      <ProjectForm
        :loading="isSubmitting"
        @submit="handleAddProject"
        @cancel="isModalOpen = false"
      />
    </BaseModal>
  </div>
</template>
