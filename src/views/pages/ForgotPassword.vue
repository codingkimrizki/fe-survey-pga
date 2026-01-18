<template>
  <div class="min-h-screen bg-[#f6f8fb] px-4 py-6 flex justify-center">
    <div class="w-full max-w-4xl space-y-8">
      <!-- CARD PER APP -->
      <a-card
        v-for="app in props.selectedApps"
        :key="app"
        class="rounded-2xl shadow-md border-0"
        :body-style="{ padding: isMobile ? '16px' : '24px' }"
      >
        <!-- HEADER -->
        <div class="mb-6">
          <a-tag color="blue" class="mb-2">
            {{ pageName }}
          </a-tag>

          <a-typography-title
            :level="isMobile ? 4 : 3"
            class="!mb-1 capitalize"
          >
            {{ appName(app) }}
          </a-typography-title>

          <a-typography-text type="secondary">
            Please answer honestly based on your experience
          </a-typography-text>
        </div>

        <!-- QUESTIONS -->
        <a-space direction="vertical" size="large" class="w-full">
          <a-card
            v-for="q in questions"
            :key="q.id_question"
            size="small"
            class="rounded-xl bg-[#fafafa] border"
          >
            <a-form layout="vertical">
              <a-form-item :label="q.question_text" class="mb-0">
                <!-- YES / NO -->
                <a-radio-group
                  v-if="q.question_type === 'Y/N'"
                  v-model:value="ratings[app][q.id_question]"
                  :class="[
                    'w-full',
                    isMobile
                      ? 'flex flex-col gap-2'
                      : 'flex justify-center gap-8',
                  ]"
                >
                  <a-radio value="Y">Yes</a-radio>
                  <a-radio value="N">No</a-radio>
                </a-radio-group>

                <!-- SUGGESTION -->
                <a-textarea
                  v-else-if="q.question_type === 'suggest'"
                  v-model:value="ratings[app][q.id_question]"
                  :rows="isMobile ? 3 : 2"
                  placeholder="Write your suggestion..."
                />
              </a-form-item>
            </a-form>
          </a-card>
        </a-space>
      </a-card>

      <!-- NAVIGATION -->
      <a-card
        class="rounded-2xl border-0 shadow-sm"
        :body-style="{ padding: isMobile ? '12px' : '20px' }"
      >
        <div
          :class="[
            'flex gap-3',
            isMobile ? 'flex-col' : 'flex-row justify-between',
          ]"
        >
          <a-button block type="default" @click="props.prevStep">
            ← Back
          </a-button>

          <a-button
            block
            type="primary"
            :loading="submitting"
            @click="handleNext"
          >
            {{ props.pageId < 8 ? 'Next' : 'Submit' }}
          </a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
