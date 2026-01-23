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
import axios from 'axios'

const emit = defineEmits(['close', 'accepted'])

const emitClose = () => {
  emit('close')
}
const isMobile = ref(false)
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 640
}

// geolocation
const latitude = ref(null)
const longitude = ref(null)
const locationSource = ref(null)
const city = ref('')
const region = ref('')
const country = ref('')

const handleAccept = async () => {
  // <--- tambahin async di sini
  localStorage.setItem('cookie_consent', 'accepted')
  emit('accepted')

  // coba ambil GPS
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        // <--- ini tetap async, karena ada await di sini
        latitude.value = position.coords.latitude
        longitude.value = position.coords.longitude
        locationSource.value = 'gps'

        // kirim ke backend
        await axios.post('/submit-location', {
          latitude: latitude.value,
          longitude: longitude.value,
          location_source: locationSource.value,
        })
        console.log('Location submitted with GPS!')
      },
      async () => {
        // fallback Geo IP
        locationSource.value = 'ip'
        const ipRes = await axios.post('http://localhost:5000/geo-ip', {
          ip: null,
        })
        latitude.value = ipRes.data.latitude
        longitude.value = ipRes.data.longitude
        city.value = ipRes.data.city
        region.value = ipRes.data.region
        country.value = ipRes.data.country

        await axios.post('/submit-location', {
          latitude: latitude.value,
          longitude: longitude.value,
          city: city.value,
          region: region.value,
          country: country.value,
          location_source: locationSource.value,
        })
        console.log('Location submitted with Geo IP fallback!')
      },
    )
  } else {
    console.log('Browser tidak support GPS, fallback ke Geo IP')
    locationSource.value = 'ip'
    const ipRes = await axios.post('http://localhost:5000/geo-ip', { ip: null })
    latitude.value = ipRes.data.latitude
    longitude.value = ipRes.data.longitude
    city.value = ipRes.data.city
    region.value = ipRes.data.region
    country.value = ipRes.data.country

    await axios.post('/submit-location', {
      latitude: latitude.value,
      longitude: longitude.value,
      city: city.value,
      region: region.value,
      country: country.value,
      location_source: locationSource.value,
    })
    console.log('Location submitted with Geo IP fallback!')
  }

  emitClose()
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
