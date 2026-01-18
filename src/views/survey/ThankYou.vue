<template>
  <div
    class="min-h-screen bg-[var(--content-bg)] flex items-center justify-center px-4"
  >
    <div :class="['w-full text-center', isMobile ? 'max-w-sm' : 'max-w-xl']">
      <!-- ICON -->
      <div class="flex justify-center mb-1">
        <div
          :class="[
            'rounded-full flex items-center justify-center',
            isMobile ? 'w-16 h-16 bg-blue-50' : 'w-20 h-20 bg-blue-50',
          ]"
        >
          <CircleCheckBig
            :class="['text-blue-600', isMobile ? 'w-9 h-9' : 'w-11 h-11']"
          />
        </div>
      </div>

      <!-- TITLE -->
      <a-typography-title :level="isMobile ? 3 : 2" class="!mb-1">
        Thank you!
      </a-typography-title>

      <a-typography-paragraph
        type="secondary"
        :class="isMobile ? 'mb-6 text-sm' : 'mb-8'"
      >
        Your feedback has been successfully submitted.
      </a-typography-paragraph>

      <!-- CARD -->
      <a-card
        class="border-0 shadow-md"
        :class="isMobile ? 'rounded-xl' : 'rounded-2xl'"
      >
        <a-space direction="vertical" size="middle" class="w-full">
          <a-typography-text strong>
            We truly appreciate your time.
          </a-typography-text>

          <a-typography-paragraph
            type="secondary"
            class="!mb-0"
            :class="isMobile ? 'text-sm' : ''"
          >
            Your feedback helps us improve our digital tools and maintain
            ethical and responsible business practices.
          </a-typography-paragraph>
        </a-space>
      </a-card>

      <!-- ACTION -->
      <div class="mt-8">
        <a-button
          type="primary"
          ghost
          size="large"
          block
          @click="restartSurvey"
        >
          Submit another response
        </a-button>

        <div v-if="isMobile" class="mt-3">
          <a-typography-text type="secondary" class="text-xs">
            You may safely close this page.
          </a-typography-text>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CircleCheckBig } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const restartSurvey = () => {
  // optional: reset state / localStorage survey
  // localStorage.removeItem('survey_answers')

  // redirect ke welcome page
  router.push({ name: 'Start Survey' })
}

const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>
