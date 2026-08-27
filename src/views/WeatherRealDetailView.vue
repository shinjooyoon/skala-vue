<script setup>
// [복구] 과제 6·7의 "상세보기"가 실제로 이동하는 라우터 페이지입니다.
// 과제 4의 WeatherDetailView는 Mock Data를 보여줬지만, 여기서는 과제 6에서 만든
// 실제 API 로직(현재 날씨 + 대기오염 + 3일 예보)을 그대로 재사용해서 클릭한 도시 하나의
// 실시간 정보를 다시 불러와 보여줍니다. /axios/weather/:cityId, /library/weather/:cityId
// 두 경로가 이 화면 하나를 같이 씁니다 (route.meta.homePath로 돌아갈 목록만 구분).
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_KEY, cityDefs, aqiToDustLevel, buildRainForecast } from '../data/weatherApi'

const route = useRoute()
const router = useRouter()

const cityDetail = ref(null)
const isLoading = ref(true)
const loadError = ref('')

const fetchDetail = async () => {
  isLoading.value = true
  loadError.value = ''

  const cityDef = cityDefs.find((city) => city.id === route.params.cityId)
  if (!cityDef) {
    loadError.value = `'${route.params.cityId}' 도시 정보를 찾을 수 없습니다.`
    isLoading.value = false
    return
  }

  try {
    const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: cityDef.englishName, appid: API_KEY, units: 'metric', lang: 'kr' },
    })

    const { lat, lon } = weatherRes.data.coord

    const airRes = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
      params: { lat, lon, appid: API_KEY },
    })

    const forecastRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: { q: cityDef.englishName, appid: API_KEY, units: 'metric', lang: 'kr' },
    })

    cityDetail.value = {
      name: cityDef.name,
      temp: weatherRes.data.main.temp,
      status: weatherRes.data.weather[0].description,
      condition: weatherRes.data.weather[0].main,
      humidity: weatherRes.data.main.humidity,
      windSpeed: weatherRes.data.wind.speed,
      dustLevel: aqiToDustLevel(airRes.data.list[0].main.aqi),
      rainForecast: buildRainForecast(forecastRes.data.list),
    }
  } catch (error) {
    console.error('🔴 상세 정보 조회 실패:', error)
    loadError.value = '❌ 실시간 상세 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDetail)

// [WeatherMockup 참고] 날씨/기온에 따른 한 줄 추천 문구 — 과제 4와 동일한 판정 로직
const recommendation = computed(() => {
  if (!cityDetail.value) return ''
  const { condition, temp } = cityDetail.value
  const isRaining = ['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)

  if (isRaining && temp >= 25) {
    return '☔ 비도 오고 더워요! 우산과 물병을 모두 챙기세요.'
  }
  if (isRaining) {
    return '☔ 비가 오고 있어요! 우산을 꼭 챙기세요.'
  }
  if (temp >= 25) {
    return '💧 날씨가 더워요! 물병을 챙기는 것을 추천해요.'
  }
  return '😊 외출하기 괜찮은 날씨예요!'
})

// WeatherCard의 세차지수와 동일한 판정 기준을 재사용
const washIndex = computed(() => {
  if (!cityDetail.value) return null
  const noRainSoon = cityDetail.value.rainForecast.every((willRain) => !willRain)
  const dustOk = cityDetail.value.dustLevel !== '나쁨'

  if (noRainSoon && dustOk) {
    return { icon: '👍', text: '세차하기 좋아요' }
  }
  if (!noRainSoon) {
    return { icon: '☔', text: '곧 비 예보가 있어요' }
  }
  return { icon: '😷', text: '미세먼지가 나빠요' }
})

// /axios/weather/:cityId 로 왔으면 '/axios'로, /library/weather/:cityId 로 왔으면
// '/library'로 돌아갑니다 (라우트 정의의 meta.homePath로 구분).
const backPath = computed(() => route.meta?.homePath || '/')
const goBack = () => {
  router.push(backPath.value)
}
</script>

<template>
  <section class="detail-box" v-if="isLoading">
    <p class="loading-message">🔄 실시간 상세 정보를 불러오는 중입니다...</p>
  </section>

  <section class="detail-box" v-else-if="loadError">
    <p class="empty-message">😭 {{ loadError }}</p>
    <button class="btn-back" @click="goBack">← 목록으로 돌아가기</button>
  </section>

  <section class="detail-box" v-else-if="cityDetail">
    <h3>📊 {{ cityDetail.name }} 실시간 상세 정보</h3>
    <hr />
    <div class="detail-grid">
      <p>🌡️ 실시간 기온 <strong>{{ Math.round(cityDetail.temp) }}°C</strong></p>
      <p>🌤️ 기상 현황 <strong>{{ cityDetail.status }}</strong></p>
      <p>💧 대기 습도 <strong>{{ cityDetail.humidity }}%</strong></p>
      <p>💨 현재 풍속 <strong>{{ cityDetail.windSpeed }}m/s</strong></p>
      <p>🌫️ 미세먼지 <strong>{{ cityDetail.dustLevel }}</strong></p>
    </div>
    <p class="recommendation">{{ recommendation }}</p>
    <p class="wash-line">{{ washIndex.icon }} {{ washIndex.text }}</p>
    <button class="btn-back" @click="goBack">← 목록으로 돌아가기</button>
  </section>
</template>

<style scoped>
.detail-box {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background: var(--surface-muted, #f8f9fa);
  padding: 22px 24px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--surface-border, #e9ecef);
}

.detail-box h3 {
  font-size: 1rem;
  color: var(--ink-900, #2c3e50);
}

.detail-box hr {
  border: none;
  border-top: 1px solid var(--surface-border, #e9ecef);
  margin: 14px 0;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-grid p {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 8px 12px;
  background: var(--surface, #fff);
  border-radius: var(--radius-sm, 8px);
  color: var(--ink-500, #64748b);
  font-size: 14px;
}

.detail-grid p strong {
  color: var(--ink-900, #2c3e50);
}

.loading-message {
  text-align: center;
  color: var(--brand-600, #3498db);
  font-weight: bold;
  padding: 20px 0;
  margin: 0;
}

.empty-message {
  text-align: center;
  color: var(--danger-500, #e74c3c);
  padding: 10px 0;
}

.recommendation {
  margin-top: 14px;
  font-weight: bold;
  color: #2e7d32;
}

.wash-line {
  margin-top: 8px;
  font-weight: 600;
  color: var(--ink-700, #334155);
}

.btn-back {
  margin-top: 16px;
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: var(--ink-900, #1a252f);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.btn-back:hover {
  background: var(--brand-700, #0f172a);
}
</style>
