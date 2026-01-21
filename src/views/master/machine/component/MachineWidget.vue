<template>
  <a-row :gutter="[24, 24]" :wrap="true">
    <BaseWidget
      :height="110"
      title="Supplier"
      :value="answersStore.getTotalIpAddress"
      :icon="SettingOutlined"
      description="Counted supplier listed on database"
    />
    <BaseWidget
      :height="110"
      title="Major"
      :value="answersStore.getTotalMajor"
      :icon="ExclamationCircleOutlined"
      description="Counted major listed on database"
    />
  </a-row>
</template>

<script setup>
import { onMounted } from 'vue'
import BaseWidget from '@/components/base/BaseWidget.vue'
import { useAnswersStore } from '@/stores/answers'
import {
  SettingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
const answersStore = useAnswersStore()

onMounted(() => {
  answersStore.fetchAnswers() // ini yang ambil data dari backend
})
</script>

<style scoped></style>
