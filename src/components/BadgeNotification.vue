<template>
  <a-badge :count="store.countNotification">
    <a-button type="dashed" shape="circle">
      <span class="items-center">
        <BellOutlined />
      </span>
    </a-button>
  </a-badge>
</template>

<script setup>
import { BellOutlined } from '@ant-design/icons-vue'
import { useMaintenanceNotifyStore } from '@/stores/maintenanceNotify'

const store = useMaintenanceNotifyStore()
</script>
