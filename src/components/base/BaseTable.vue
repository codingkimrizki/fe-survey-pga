<template>
  <div>
    <a-flex justify="space-between" wrap="wrap" align="end" class="mb-large">
      <a-input
        v-model:value="search"
        placeholder="Search..."
        allowClear
        style="max-width: 300px"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <a-tooltip title="Register" placement="bottom" size="small" align="end">
        <a-button shape="circle" @click="router.push('/register')" size="large">
          <UserAddOutlined />
        </a-button>
      </a-tooltip>
    </a-flex>

    <!-- Table -->
    <a-table
      :bordered="bordered"
      :size="size"
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      row-key="id"
      :scroll="scroll"
    >
      <!-- Scoped slot dinamis -->
      <template #bodyCell="{ column, text, record, index }">
        <slot
          v-if="$slots[`${column.dataIndex}`]"
          :name="`${column.dataIndex}`"
          :text="text"
          :record="record"
          :index="index"
        />
        <template v-else>
          <span v-if="column.dataIndex">{{ formatCellValue(text) }}</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { formatDateTime } from '@/utils/formatDateTime'
import { formatThousandSeparator } from '@/utils/formatterInputNumber'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

// Props
defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  pagination: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  size: { default: 'small' },
  scroll: { type: Object, default: () => ({}) },
  addAction: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },
})

// router
const router = useRouter()

// Search model
const search = defineModel('search', { type: String })

// Emit
const emits = defineEmits(['change'])

// Emit saat ada perubahan di tabel (pagination / sorter / filter)
const handleTableChange = (pagination, filters, sorter) => {
  emits('change', { pagination, filters, sorter })
}

const formatCellValue = value => {
  if (value == null || value === '') return '-'
  // Jika angka
  if (typeof value === 'number' || (!isNaN(Number(value)) && value !== '')) {
    return formatThousandSeparator(Number(value))
  }
  // Deteksi format tanggal yang dikenal
  const validFormats = [
    'YYYY-MM-DD HH:mm:ss', // format dari SQL
    'YYYY-MM-DDTHH:mm:ss.SSSZ', // ISO dengan milidetik
    'YYYY-MM-DDTHH:mm:ssZ', // ISO tanpa milidetik
  ]
  let parsedDate = null
  // Coba parsing ketat hanya dengan format yang dikenali
  for (const fmt of validFormats) {
    const d = dayjs(value, fmt, true)
    if (d.isValid()) {
      parsedDate = d
      break
    }
  }
  // Jika semua gagal, cek apakah ini ISO standar (Z di akhir)
  if (!parsedDate && /T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
    parsedDate = dayjs(value)
  }
  // Jika tetap tidak valid, kembalikan value asli
  if (!parsedDate || !parsedDate.isValid()) return value
  return formatDateTime(parsedDate)
}
</script>
