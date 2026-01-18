<template>
  <div
    class="min-h-screen bg-[var(--content-bg)] flex items-center justify-center px-4"
  >
    <div class="w-full max-w-xl">
      <!-- TOP LABEL -->
      <div class="mb-4">
        <a-tag color="blue">Ethics & Compliance</a-tag>
      </div>

      <!-- TITLE -->
      <a-typography-title :level="2" class="!mb-1">
        Responsible Business Alliance
      </a-typography-title>
      <a-typography-paragraph type="secondary" class="!mb-8">
        Ethics Reporting Portal
      </a-typography-paragraph>

      <!-- CARD -->
      <a-card class="rounded-2xl shadow-lg border-0">
        <a-space direction="vertical" size="large" class="w-full">
          <!-- PRIVACY -->
          <div class="flex gap-3">
            <InfoCircleOutlined class="w-5 h-5 stroke-blue-600" />
            <div>
              <a-typography-text strong>
                Kerahasiaan Dijamin
              </a-typography-text>
              <a-typography-paragraph type="secondary" class="!mb-0">
                Semua jawaban Anda bersifat rahasia dan digunakan hanya untuk
                peningkatan sistem dan kepatuhan perusahaan.
              </a-typography-paragraph>
            </div>
          </div>

          <!-- INFO -->
          <div class="rounded-xl bg-[var(--content-bg)] p-4">
            <a-typography-text strong> Alur singkat: </a-typography-text>

            <a-steps direction="vertical" size="small" class="mt-3">
              <a-step title="Jawab pertanyaan Ya / Tidak" />
              <a-step title="Berikan saran atau masukan" />
              <a-step title="Selesai dalam ± 5 menit" />
            </a-steps>
          </div>

          <!-- CTA -->
          <a-button
            type="primary"
            size="large"
            block
            :disabled="!hasConsent"
            @click="startSurvey"
          >
            Mulai Pengisian
          </a-button>

          <CookiesContent
            :open="showModal"
            @close="showModal = false"
            @accepted="onAccepted"
          />
        </a-space>
      </a-card>

      <!-- FOOT NOTE -->
      <div class="mt-4 text-center">
        <a-typography-text type="secondary" class="text-xs">
          Portal ini mengikuti standar Responsible Business Alliance (RBA)
        </a-typography-text>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import CookiesContent from './CookiesContent.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const startSurvey = () => {
  router.push({ name: 'Question' })
}

const hasConsent = ref(false)

const showModal = ref(false)
const isMobile = ref(false)

const onAccepted = () => {
  hasConsent.value = true
}

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 640 // tailwind sm
}

onMounted(() => {
  checkIsMobile()

  const consent = localStorage.getItem('cookie_consent')
  if (!consent) {
    showModal.value = true
  } else {
    hasConsent.value = true
  }

  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>
