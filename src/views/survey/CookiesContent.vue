<template>
  <a-modal
    :open="open"
    title="Persetujuan Penggunaan Cookies"
    :width="isMobile ? '100%' : 520"
    :footer="null"
    centered
    @cancel="emitClose"
    @ok="emitClose"
  >
    <a-space direction="vertical" size="middle" class="w-full">
      <a-alert
        type="info"
        show-icon
        message="Privasi & Keamanan Data"
        description="Kami menggunakan cookies dan informasi perangkat untuk memastikan keamanan, meningkatkan kualitas layanan, serta keperluan audit dan kepatuhan."
      />

      <a-typography-paragraph>
        Data yang dapat kami kumpulkan:
      </a-typography-paragraph>

      <a-list size="small">
        <a-list-item>Alamat IP</a-list-item>
        <a-list-item>Jenis perangkat & browser</a-list-item>
        <a-list-item>Waktu akses</a-list-item>
      </a-list>

      <a-typography-text type="secondary" class="text-xs">
        Dengan melanjutkan, Anda menyetujui penggunaan cookies sesuai kebijakan
        kami.
      </a-typography-text>

      <a-divider />

      <a-space :direction="isMobile ? 'vertical' : 'horizontal'" class="w-full">
        <a-button block @click="handleDecline"> Batal </a-button>
        <a-button type="primary" block @click="handleAccept">
          Saya Setuju
        </a-button>
      </a-space>
    </a-space>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close', 'accepted'])

const emitClose = () => {
  emit('close')
}

const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 640
}

const handleAccept = () => {
  localStorage.setItem('cookie_consent', 'accepted')
  emit('accepted')
  emit('close')
}

const handleDecline = () => {
  emit('close')
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>
