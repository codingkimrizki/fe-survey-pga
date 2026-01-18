<template>
  <div
    class="min-h-screen bg-[var(--content-bg)] flex justify-center px-4 py-10"
  >
    <div class="w-full max-w-3xl">
      <!-- HEADER -->
      <div class="mb-4">
        <a-tag color="blue">Ethics & Compliance</a-tag>
      </div>

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
        <div v-else class="space-y-8">
          <div
            v-for="(q, index) in questions"
            :key="q.id_questions"
            class="p-4 rounded-xl bg-[#fafafa]"
          >
            <!-- QUESTION TEXT -->
            <div class="mb-4">
              <span class="font-semibold text-gray-700">
                {{ index + 1 }}.
              </span>
              <span class="ml-1 text-gray-800">
                {{ q.question_text }}
              </span>
            </div>

            <!-- ANSWER -->
            <!-- YES / NO -->
            <a-radio-group
              v-if="q.question_type === 'Y/N'"
              v-model:value="answers[q.id_questions]"
              :button-style="'solid'"
              class="flex"
              :class="isMobile ? 'flex-col gap-3' : 'gap-4'"
            >
              <a-radio-button value="Y" class="text-center">
                Yes
              </a-radio-button>
              <a-radio-button value="N" class="text-center">
                No
              </a-radio-button>
            </a-radio-group>

            <!-- SUGGESTION -->
            <a-textarea
              v-else-if="q.question_type === 'suggest'"
              v-model:value="answers[q.id_questions]"
              :rows="isMobile ? 3 : 4"
              placeholder="Write your suggestion here..."
            />

            <!-- FALLBACK -->
            <span v-else class="text-gray-400 italic">
              Unsupported question type
            </span>
          </div>
        </div>
      </a-card>

      <!-- NAVIGATION -->
      <div class="mt-6 flex justify-center gap-3">
        <!-- <a-button
        @click="backToWelcome"
        >
          ← Back
        </a-button> -->

        <a-button type="primary" @click="submitSurvey"> Submit </a-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const questions = ref([])
const answers = reactive({})
const loading = ref(false)
const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 640
}

const fetchQuestions = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:5000/api/questions/all')
    questions.value = res.data.data || res.data

    questions.value.forEach(q => {
      if (q.id_questions !== undefined) {
        answers[q.id_questions] = null
      } else {
        console.warn('Question missing id_questions:', q)
      }
    })

    console.log('QUESTIONS:', questions.value)
  } catch (err) {
    console.error('FETCH ERROR:', err)
  } finally {
    loading.value = false
  }
}

// const backToWelcome = () => {
//   // submit data ke backend
//   router.push({ name: 'Start Survey' })
// }

const submitSurvey = () => {
  // submit data ke backend
  router.push({ name: 'Finish' })
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  fetchQuestions()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>
<style scoped>
a-radio-button {
  min-width: 120px;
}
</style>
