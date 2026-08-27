<script setup>
// Axios 활용 — mock 데이터를 실제 OpenWeatherMap API 데이터로 교체하고,
// OpenWeatherMap의 다른 API(대기오염) + 완전히 별도의 외부 API(countries.dev)로 기능을 확장합니다.
// (독립 실습용 API 키: 강의 저장소 bottletiger/skala-vue의
//  src/components/practices/library/AxiosWeather.vue 예제에 포함된 키를 그대로 사용합니다.)
//
// [복구] 과제 4·5에서 쓰던 실제 vue-router를 이어받아, "상세보기"를 이제 /axios/weather/:cityId
// 라우트로 실제 이동시킵니다 (예전에는 window.alert로 대체했었습니다).
import { ref, computed, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_KEY, cityDefs, aqiToDustLevel, buildRainForecast } from '../data/weatherApi'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const route = useRoute()
const router = useRouter()

// /axios/about, /axios/weather/:cityId 로 들어와 있으면 아래 RouterView가 그 화면을 보여주고,
// 그 외(기본 /axios 상태)에는 이 화면 본래의 대시보드를 보여줍니다.
const isShowingSubRoute = computed(() => route.path.startsWith('/axios/'))

const weatherList = ref([])
const isLoading = ref(true)
const loadError = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 요구사항 #1: OpenWeatherMap 현재 날씨 API로 mock 데이터를 실제 데이터로 교체
// 요구사항 #2: OpenWeatherMap이 제공하는 또 다른 API(대기오염 API)를 추가로 호출해 기능 확장
const fetchRealWeatherData = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const results = await Promise.all(
      cityDefs.map(async (city) => {
        const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: { q: city.englishName, appid: API_KEY, units: 'metric', lang: 'kr' },
        })

        const { lat, lon } = weatherRes.data.coord

        // 🟢 같은 OpenWeatherMap 소속의 대기오염(Air Pollution) API를 추가 연동
        const airRes = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
          params: { lat, lon, appid: API_KEY },
        })

        // 🟢 [수정] 세차지수용 3일 예보 — 5일/3시간 예보 API를 실제로 호출
        const forecastRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: { q: city.englishName, appid: API_KEY, units: 'metric', lang: 'kr' },
        })

        return {
          id: city.id,
          name: city.name,
          temp: weatherRes.data.main.temp,
          status: weatherRes.data.weather[0].description,
          rainForecast: buildRainForecast(forecastRes.data.list),
          dustLevel: aqiToDustLevel(airRes.data.list[0].main.aqi),
        }
      }),
    )

    weatherList.value = results
  } catch (error) {
    console.error('🔴 실시간 날씨 API 연동 실패:', error)
    loadError.value = '❌ 실시간 날씨 데이터를 가져오지 못했습니다. API 키 상태나 네트워크를 확인하세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchRealWeatherData)

const handleSelectCard = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// [복구] window.alert() 대신 실제 라우터로 상세 페이지 이동
const handleClickDetail = (city) => {
  router.push('/axios/weather/' + city.id)
}

// ------------------------------------------------------------------
// 기타 외부 API(countries.dev)로 국가 정보를 보여주고,
// 이미 받아온 실시간 날씨 데이터만으로 "지금 여행하기 좋은 시기인지"를 판단해 확장합니다.
// (환율 기반 "가성비" 추천은 계산이 복잡하고 체감하기 어려워서, 실제 기온·강수 상태를
//  보고 계절감을 알려주는 방식으로 바꿨습니다.)
// 참고: restcountries.com(v3.1)은 현재 서비스가 유료 API 키를 요구하도록 바뀌어서
// 항상 실패했습니다 — 키가 필요 없는 대체 API인 countries.dev로 교체했습니다.
// ------------------------------------------------------------------
const worldCityInput = ref('Tokyo')
const isSearchingWorld = ref(false)
const worldSearchError = ref('')
const worldWeather = ref(null)
const worldCountry = ref(null)
const travelTip = ref('')

// 목적지의 실시간 기온·날씨 상태를 보고 "지금이 여행하기 좋은 시기인지" 간단히 판단
// (환율처럼 별도 API를 더 호출하지 않고, 이미 받아온 weatherData 하나로 계산합니다)
const buildTravelTip = (weatherData) => {
  const temp = weatherData.main.temp
  const condition = weatherData.weather[0].main // Clear/Clouds/Rain/Drizzle/Thunderstorm/Snow 등

  if (condition === 'Snow') {
    return '❄️ 지금은 눈이 내리는 겨울철이에요. 방한 장비를 꼭 챙기세요.'
  }
  if (['Rain', 'Drizzle', 'Thunderstorm'].includes(condition)) {
    return '🌧️ 지금은 비가 잦은 시기예요. 우산과 방수용품을 챙기는 게 좋아요.'
  }
  if (temp >= 28) {
    return '🔥 무더운 한여름 날씨예요. 자외선 차단제와 수분 보충을 꼭 챙기세요.'
  }
  if (temp >= 18) {
    return '🌤️ 여행하기 딱 좋은 쾌적한 날씨예요!'
  }
  if (temp >= 5) {
    return '🍂 선선한 환절기 날씨예요. 얇은 겉옷을 챙기면 좋아요.'
  }
  return '🥶 쌀쌀한 겨울 날씨예요. 두꺼운 옷을 준비하세요.'
}

const handleSearchWorldCity = async () => {
  const cityName = worldCityInput.value.trim()
  if (!cityName) {
    return
  }

  isSearchingWorld.value = true
  worldSearchError.value = ''
  worldWeather.value = null
  worldCountry.value = null
  travelTip.value = ''

  // 1단계: 날씨 조회(OpenWeatherMap) — 이 단계가 실패하면 "도시를 못 찾음"이 맞는 원인입니다.
  try {
    const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: cityName, appid: API_KEY, units: 'metric', lang: 'kr' },
    })
    worldWeather.value = weatherRes.data
    // 🟢 실시간 날씨 데이터만으로 바로 여행 시기 판단 (추가 API 호출 없이 즉시 계산)
    travelTip.value = buildTravelTip(weatherRes.data)
  } catch (error) {
    console.error('🔴 날씨 조회 실패:', error)
    const status = error.response?.status
    if (status === 404) {
      worldSearchError.value = '❌ 도시를 찾을 수 없습니다. 영문 도시명으로 다시 시도해보세요. (예: Tokyo, Paris, Hanoi)'
    } else if (status === 401) {
      worldSearchError.value = '❌ OpenWeatherMap API 키 인증에 실패했습니다.'
    } else {
      worldSearchError.value = '❌ 날씨 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.'
    }
    isSearchingWorld.value = false
    return
  }

  // 2단계: 국가 정보(countries.dev, 키 불필요) — 날씨 조회가 성공했다면, 이 단계가
  // 실패해도 "도시를 못 찾음"으로 잘못 안내하지 않도록 별도의 try/catch로 분리합니다.
  try {
    const countryRes = await axios.get(`https://countries.dev/alpha/${worldWeather.value.sys.country}`)
    worldCountry.value = countryRes.data
  } catch (error) {
    console.error('🟡 국가 정보(countries.dev) 조회 실패 — 날씨 결과는 계속 보여줍니다:', error)
  }

  isSearchingWorld.value = false
}
</script>

<template>
  <RouterView v-if="isShowingSubRoute" />

  <div v-else class="dashboard-wrapper">
    <BaseDashboardCard title="🏙️ 지역별 실시간 날씨">
      <p v-if="isLoading" class="loading-message">🔄 실시간 기상 데이터를 불러오는 중입니다...</p>
      <p v-else-if="loadError" class="error-message">{{ loadError }}</p>
      <template v-else>
        <div class="weather-grid">
          <WeatherCard
            v-for="item in weatherList"
            :key="item.id"
            :city="item"
            @select-card="handleSelectCard"
            @click-detail="handleClickDetail"
          />
        </div>
      </template>
    </BaseDashboardCard>

    <div class="status-bar">{{ selectedCityInfo }}</div>

    <BaseDashboardCard title="🌍 세계 도시 검색 + 여행 시기 추천">
      <div class="world-search">
        <input
          v-model="worldCityInput"
          type="text"
          placeholder="영문 도시명 입력 (예: Tokyo, Paris, Hanoi)"
          @keyup.enter="handleSearchWorldCity"
        />
        <button class="btn-search" :disabled="isSearchingWorld" @click="handleSearchWorldCity">
          {{ isSearchingWorld ? '검색 중...' : '검색' }}
        </button>
      </div>

      <p v-if="worldSearchError" class="error-message">{{ worldSearchError }}</p>

      <div v-if="worldWeather" class="world-result">
        <img
          v-if="worldCountry?.flags?.png"
          :src="worldCountry.flags.png"
          :alt="`${worldCountry.name} 국기`"
          class="country-flag"
        />
        <div class="world-info">
          <h4>{{ worldWeather.name }}<span v-if="worldCountry">, {{ worldCountry.name }}</span></h4>
          <p>🌡️ {{ Math.round(worldWeather.main.temp) }}°C · {{ worldWeather.weather[0].description }}</p>
          <template v-if="worldCountry">
            <p>🏛️ 수도: {{ worldCountry.capital || '정보 없음' }}</p>
            <p>💱 통화: {{ worldCountry.currencies?.[0]?.name || '정보 없음' }}</p>
          </template>
          <p v-else class="country-fallback">🌍 국가 정보를 불러오지 못했어요. (날씨 정보만 표시)</p>
          <p v-if="travelTip" class="travel-tip">{{ travelTip }}</p>
        </div>
      </div>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 12px;
}

.weather-grid :deep(.weather-card) {
  margin-bottom: 0;
}

.loading-message {
  text-align: center;
  color: var(--brand-600, #3498db);
  font-weight: bold;
  padding: 20px 0;
  margin: 0;
}

.error-message {
  text-align: center;
  color: var(--danger-500, #e74c3c);
  padding: 10px 0;
  margin: 0;
}

.status-bar {
  background: var(--success-50, #e8f5e9);
  padding: 12px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: var(--radius-sm, 8px);
}

.world-search {
  display: flex;
  gap: 8px;
}

.world-search input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--surface-border, #dee2e6);
  border-radius: var(--radius-sm, 8px);
  background: var(--surface, #fff);
  color: var(--ink-900, #2c3e50);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.world-search input:focus {
  outline: none;
  border-color: var(--brand-500, #6366f1);
  box-shadow: 0 0 0 3px var(--brand-50, rgba(99, 102, 241, 0.15));
}

.btn-search {
  padding: 10px 18px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: var(--brand-600, #3498db);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-search:hover:not(:disabled) {
  background: var(--brand-700, #2c80c2);
}

.btn-search:disabled {
  background: var(--ink-400, #b2bec3);
  cursor: not-allowed;
}

.world-result {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-top: 16px;
  padding: 16px;
  background: var(--surface-muted, #f8fafc);
  border-radius: var(--radius-md, 12px);
}

.country-flag {
  width: 64px;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--surface-border, #dee2e6);
}

.world-info h4 {
  margin: 0 0 6px 0;
  color: var(--ink-900, #2c3e50);
  font-weight: 700;
}

.world-info p {
  margin: 4px 0;
  color: var(--ink-700, #334155);
  font-size: 14px;
}

.travel-tip {
  font-weight: bold;
  color: #b8860b;
}

.country-fallback {
  color: var(--ink-500, #7f8c8d);
  font-size: 13px;
}
</style>
