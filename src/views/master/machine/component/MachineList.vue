<template>
  <BaseTable
    :add-action="false"
    :bordered="true"
    v-model:search="machineStore.filter.search"
    size="small"
    :columns="columns"
    :data="machineStore.machineList"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ y: 'calc(100vh - 450px)', x: 'max-content' }"
    @change="onTableChange"
  >
    <!-- SLOT STATUS -->
    <template #status="{ text, record }">
      <a-button
        v-if="text === 'major'"
        type="primary"
        danger
        size="small"
        @click="handleAction(record)"
      >
        MAJOR
      </a-button>

      <a-button v-else-if="text === 'clear'" type="primary" size="small">
        CLEAR
      </a-button>

      <span v-else>-</span>
    </template>
  </BaseTable>
  <Teleport to="body">
    <BaseModal
      :visible="modal.visible"
      @close="handleClose"
      :modalTitle="modal.title"
    >
      <template #body>
        <div style="line-height: 1.5">
          <p><strong>IP Address:</strong> {{ modal.data?.ipAddress || '-' }}</p>
          <p><strong>Date:</strong> {{ modal.data?.date || '-' }}</p>
          <p><strong>Time:</strong> {{ modal.data?.time || '-' }}</p>
          <p><strong>Status:</strong> {{ modal.data?.status || '-' }}</p>
        </div>
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseTable from '@/components/base/BaseTable.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useTabelAnswersStore } from '@/stores/tabelAnswers'

const machineStore = useTabelAnswersStore()
const loading = ref(false)

const pagination = computed(() => ({
  current: machineStore.pagination.page,
  pageSize: machineStore.pagination.pageSize,
  total: machineStore.pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
}))

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
    width: 80,
  },
  {
    title: 'Device IP Address',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 200,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    width: 120,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
]

const onTableChange = async ({ pagination: pag, sorter }) => {
  machineStore.filter.sortBy = sorter.field
  machineStore.filter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
  machineStore.pagination.page = pag.current
  machineStore.pagination.pageSize = pag.pageSize
  await machineStore.get()
}

const debounceFetch = debounce(async () => {
  machineStore.pagination.page = 1
  loading.value = true
  await machineStore.get()
  loading.value = false
}, 500)

watch(
  [() => machineStore.filter.search, () => machineStore.filter.showDeleted],
  () => debounceFetch(),
  { deep: true },
)

onMounted(async () => {
  loading.value = true
  await machineStore.get()
  loading.value = false
})

const modal = ref({
  visible: false,
  title: '',
  data: null, // data baris yang diklik
})

const handleAction = (record = null) => {
  modal.value.visible = true
  modal.value.title = 'Major Alert'
  modal.value.data = record
}

const handleClose = () => {
  modal.value.visible = false
  modal.value.data = null
  modal.value.title = ''
}
</script>
