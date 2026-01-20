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
  />
</template>

<script setup>
import BaseTable from '@/components/base/BaseTable.vue'
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
  { title: 'No', dataIndex: 'no', key: 'no', width: 80 },
  {
    title: 'Device IP Address',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 200,
  },
  { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
  { title: 'Time', dataIndex: 'time', key: 'time', width: 120 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 120 },
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
</script>
