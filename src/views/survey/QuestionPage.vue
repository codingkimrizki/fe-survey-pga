<template>
  <div
    class="min-h-screen bg-[var(--content-bg)] flex justify-center px-4 py-10"
  >
    <div class="w-full max-w-3xl">
      <!-- HEADER -->
      <a-flex
        justify="flex-between"
        align="center"
        wrap="wrap"
        style="margin-bottom: 1rem"
      >
        <a-tag color="blue">Ethics & Compliance</a-tag>
        <a-flex align="center" gap="12">
          <ThemeToggle />
          <TranslateGoogle />
        </a-flex>
      </a-flex>

      <!-- TITLE -->
      <a-typography-title :level="2" class="!mb-1">
        Survey Questions
      </a-typography-title>

      <a-typography-paragraph type="secondary" class="!mb-8">
        Please answer honestly. This survey takes only a few minutes.
      </a-typography-paragraph>

      <!-- CARD -->
      <a-card class="rounded-2xl shadow-md" bordered>
        <!-- LOADING -->
        <div v-if="loading" class="flex justify-center py-10">
          <a-spin size="large" />
        </div>

        <!-- QUESTIONS -->
        <div v-else class="space-y-4">
          <div
            v-for="(q, index) in questions"
            :key="q.id_questions"
            :id="`question-${q.id_questions}`"
            class="p-4 rounded-xl space-y-4"
            :class="[
              'bg-[var(--content-bg)]',
              errors[q.id_questions]
                ? 'border-2 border-red-500'
                : 'border border-transparent',
            ]"
          >
            <div class="flex w-full">
              <!-- Nomor -->
              <a-typography-paragraph class="font-semibold text-gray-700 w-6">
                {{ index + 1 }}.
              </a-typography-paragraph>

              <div class="flex flex-col flex-1">
                <!-- Pertanyaan -->
                <a-typography-paragraph class="text-gray-800 text-justify">
                  {{ q.question_text }}
                </a-typography-paragraph>

                <div class="w-full">
                  <!-- Yes/No (required) -->
                  <a-radio-group
                    v-if="q.question_type === 'Y/N'"
                    v-model:value="answers[q.id_questions]"
                    :button-style="'solid'"
                    class="flex gap-4"
                  >
                    <a-radio value="Y">Ya, Pernah</a-radio>
                    <a-radio value="N">Tidak</a-radio>
                  </a-radio-group>

                  <!-- Suggestion (optional) -->
                  <a-textarea
                    v-else-if="q.question_type === 'suggest'"
                    v-model:value="answers[q.id_questions]"
                    :rows="isMobile ? 3 : 4"
                    placeholder="Write your suggestion here..."
                    class="w-full resize-none mt-2"
                  />

                  <!-- Fallback -->
                  <span v-else class="text-gray-400 italic mt-2">
                    Unsupported question type
                  </span>
                </div>

                <!-- Error message untuk Yes/No -->
                <span
                  v-if="errors[q.id_questions]"
                  class="text-red-500 text-sm mt-1"
                >
                  This question is required
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-card>

      <!-- NAVIGATION -->
      <div class="mt-6 flex justify-center gap-3">
        <a-button type="primary" @click="submitSurvey">Submit</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import TranslateGoogle from '@/components/TranslateGoogle.vue'

const router = useRouter()
const questions = ref([])
const answers = reactive({})
const errors = reactive({})
const loading = ref(false)
const isMobile = ref(false)

// detect mobile
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 640
}

// fetch questions dari backend
const fetchQuestions = async () => {
  loading.value = true
  try {
    const res = await api.get('/questions/all')
    questions.value = res.data.data || res.data
    questions.value.forEach(q => {
      answers[q.id_questions] = null
      errors[q.id_questions] = false
    })
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// submit survey
const submitSurvey = async () => {
  let hasError = false

  // reset errors
  Object.keys(errors).forEach(key => (errors[key] = false))

  // cek pertanyaan Yes/No
  questions.value.forEach(q => {
    if (q.question_type === 'Y/N' && !answers[q.id_questions]) {
      errors[q.id_questions] = true
      hasError = true
    }
  })

  if (hasError) {
    message.error('Please answer all required Yes/No questions!')
    const firstErrorId = questions.value.find(
      q => errors[q.id_questions],
    ).id_questions
    document
      .getElementById(`question-${firstErrorId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  // convert answers reactive object ke array
  const answerArray = Object.entries(answers).map(([id_questions, ans]) => ({
    id_questions: Number(id_questions),
    answer: ans,
  }))

  try {
    loading.value = true
    // kirim ke backend
    await api.post('/answers/submit', answerArray)
    message.success('Survey submitted successfully!')
    router.push({ name: 'Finish' })
  } catch (err) {
    console.error(err)
    message.error('Failed to submit survey.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  fetchQuestions()
})

onUnmounted(() => window.removeEventListener('resize', checkIsMobile))
</script>

<style scoped>
a-radio-button {
  min-width: 120px;
}
</style>
