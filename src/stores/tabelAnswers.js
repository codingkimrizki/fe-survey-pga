import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

export const useTabelAnswersStore = defineStore('tabelAnswers', {
  state: () => ({
    machineList: [], // 1 row = 1 IP per hari
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
    filter: {
      search: '',
      showDeleted: false,
      sortBy: '',
      order: '',
    },
  }),
  actions: {
    async get() {
      try {
        const res = await api.get('/answers/all')
        if (res.status === 200) {
          const data = res.data.data
          const statusSummary = res.data.statusSummary

          // group by ipAddress + date
          const grouped = {}
          data.forEach(ans => {
            const date = ans.createdAt.slice(0, 10) // YYYY-MM-DD
            const key = `${ans.ipAddress}_${date}`

            // jika belum ada, buat entry baru
            if (!grouped[key]) {
              grouped[key] = {
                ipAddress: ans.ipAddress,
                date,
                lastTime: ans.createdAt.slice(11, 19),
                status: statusSummary[ans.ipAddress] || 'clear',
              }
            } else {
              // update waktu jika ini lebih baru
              const currentTime = ans.createdAt
              if (
                currentTime > `${grouped[key].date}T${grouped[key].lastTime}`
              ) {
                grouped[key].lastTime = currentTime.slice(11, 19)
              }
            }
          })

          // convert ke array untuk table
          this.machineList = Object.values(grouped).map((item, index) => ({
            no: index + 1,
            ipAddress: item.ipAddress,
            date: item.date,
            time: item.lastTime,
            status: item.status,
          }))

          this.pagination.total = Object.keys(grouped).length
        }
      } catch (err) {
        message.error(err.response?.data?.message || 'Failed to fetch data')
        console.error(err)
      }
    },
  },
})
