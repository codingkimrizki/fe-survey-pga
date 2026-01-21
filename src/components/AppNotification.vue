<template>
  <a-dropdown placement="bottomRight" :trigger="['hover']" arrow>
    <a-badge :count="store.countNotification">
      <a-button type="dashed" shape="circle">
        <span class="items-center">
          <MailOutlined />
        </span>
      </a-button>
    </a-badge>
    <template #overlay>
      <a-menu class="notif-menu">
        <span class="medium mb-small bold" style="padding: 8px 10px"
          >Survey Portal</span
        >
        <a-menu-item @click="router.push({ name: 'Start Survey' })">
          <a-flex justify="space-between">
            <span>Form</span>
          </a-flex>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { MailOutlined } from '@ant-design/icons-vue'
import { useMaintenanceNotifyStore } from '@/stores/maintenanceNotify'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useMaintenanceNotifyStore()
</script>

<style scoped>
.notif-menu {
  min-width: 250px;
}
</style>
