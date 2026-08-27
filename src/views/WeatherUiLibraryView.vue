<script setup>
// 과제 7: 외부 UI Library(Element Plus) 적용 — 과제 6(Axios)의 로직은 그대로 두고,
// Element Plus 컴포넌트로 화면을 감싸고 입력값 검증을 붙였습니다.
//
// 이번에 실제로 쓰는 Element Plus 기능은 3가지뿐입니다 (더 늘리지 않은 이유: 강의
// Hands on 요구사항이 "자유롭게 적용"이라, 각각 왜 썼는지 설명할 수 있는 만큼만 사용):
//  1) el-card (#header 슬롯) — Code Challenge의 "el-card: v-slot 및 기타 속성 사용" 예시를
//     그대로 가져와서, 기존 BaseDashboardCard(직접 만든 카드)를 라이브러리 카드로 교체했습니다.
//  2) v-loading 디렉티브 — 첫 번째 카드에 직접 붙여서, 기존에 "로딩 중..." 문구를 직접
//     그리던 것을 라이브러리가 제공하는 로딩 오버레이로 대체했습니다.
//  3) el-input / el-button / ElMessage — Code Challenge의 "userForm Validation" 패턴
//     (조건 체크 → ElMessage 안내 → return)을 세계 도시 검색 입력값 검증에 그대로 적용했고,
//     추가로 검색 결과에 el-tag로 더움/선선함 상태를 표시했습니다.
//
// [복구] 과제 5(WeatherHomeView)에 있던 화씨/섭씨 토글, 폭염 경고, 즐겨찾기 목록을
// 이 화면 안으로 그대로 옮겨왔습니다. "서비스 소개"와 "상세보기"는 로컬 상태가 아니라
// 과제 4·5에서 쓰던 실제 vue-router(/library/about, /library/weather/:cityId)를 이어받았습니다.
import { ref, computed, onMounted } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { API_KEY, cityDefs, aqiToDustLevel, buildRainForecast } from '../data/weatherApi'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import AlertBox from '../components/exercise/AlertBox.vue'
import UnitToggler from '../components/exercise/UnitToggler.vue'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()

// [복구] /library/about, /library/weather/:cityId 로 들어와 있으면 RouterView가 그 화면을
// 보여주고, 그 외(기본 /library 상태)에는 이 화면 본래의 대시보드를 보여줍니다.
const isShowingSubRoute = computed(() => route.path.startsWith('/library/'))

const weatherList = ref([])
const isLoading = ref(true)
const loadError = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 과제 6과 동일한 Axios 로직: OpenWeatherMap 현재 날씨 + 대기오염 + 3일 예보 API를 병렬 호출
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

        const airRes = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
          params: { lat, lon, appid: API_KEY },
        })

        // 🟢 세차지수용 3일 예보 — 5일/3시간 예보 API를 실제로 호출
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

// [복구] window.alert() 대신 실제 라우터로 상세 페이지 이동 (과제 6과 동일한 방식)
const handleClickDetail = (city) => {
  router.push('/library/weather/' + city.id)
}

// [복구] 폭염 경고 기준 온도 — 과제 5(WeatherHomeView)에 있던 기능을 그대로 가져왔습니다.
const alertThreshold = ref(30)
const hotAlertCities = computed(() => weatherList.value.filter((item) => item.temp > alertThreshold.value))
const handleUpdateThreshold = (newValue) => {
  alertThreshold.value = newValue
}

// [복구] 즐겨찾기한 도시 목록 — 이름만 나열하면 온도·상세보기 같은 정보를 볼 수 없어서
// 쓸모가 없다는 피드백을 받아, 이름이 아니라 도시 객체 전체를 모아 아래 즐겨찾기 박스에서도
// WeatherCard를 그대로 재사용해 보여줍니다.
const favoriteCities = computed(() =>
  weatherList.value.filter((item) => favoriteStore.isFavorite(item.id)),
)

// [복구] 즐겨찾기 박스에 이미 카드로 보이는 도시는 아래 전체 목록에서는 겹치지 않게 빼줍니다.
const nonFavoriteWeatherList = computed(() =>
  weatherList.value.filter((item) => !favoriteStore.isFavorite(item.id)),
)

// 과제 6과 동일: countries.dev로 국가 정보 + 실시간 날씨만으로 여행 시기 판단
const worldCityInput = ref('Tokyo')
const isSearchingWorld = ref(false)
const worldWeather = ref(null)
const worldCountry = ref(null)
const travelTip = ref('')

// [UI Library 적용] 검색된 도시가 더운지/선선한지 — 과제 2·3의 뱃지와 같은 25도 기준을
// 그대로 재사용해서, el-tag 색상(danger/info)으로 표시합니다.
const isHotDestination = computed(() => Boolean(worldWeather.value) && worldWeather.value.main.temp >= 25)

const buildTravelTip = (weatherData) => {
  const temp = weatherData.main.temp
  const condition = weatherData.weather[0].main

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

  // [UI Library 적용 — 입력값 검증 ①] Code Challenge의 userForm Validation과 동일한 패턴:
  // 조건 체크 → ElMessage 안내 → return. 빈 값이면 API를 아예 호출하지 않습니다.
  if (!cityName) {
    ElMessage.warning('🔍 검색할 도시명을 입력해주세요.')
    return
  }

  // [UI Library 적용 — 입력값 검증 ②] OpenWeatherMap은 영문 도시명만 정확히 인식하므로
  // 한글 등을 입력했을 때는 API를 호출하기 전에 미리 걸러서 안내합니다.
  if (!/^[a-zA-Z\s]+$/.test(cityName)) {
    ElMessage.warning('🔤 영문 도시명으로 입력해주세요. (예: Tokyo, Paris)')
    return
  }

  isSearchingWorld.value = true
  worldWeather.value = null
  worldCountry.value = null
  travelTip.value = ''

  try {
    const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: cityName, appid: API_KEY, units: 'metric', lang: 'kr' },
    })
    worldWeather.value = weatherRes.data
    travelTip.value = buildTravelTip(weatherRes.data)
    ElMessage.success(`${weatherRes.data.name} 날씨 정보를 불러왔어요.`)
  } catch (error) {
    console.error('🔴 날씨 조회 실패:', error)
    const status = error.response?.status
    if (status === 404) {
      ElMessage.error('❌ 도시를 찾을 수 없습니다. 영문 도시명으로 다시 시도해보세요. (예: Tokyo, Paris, Hanoi)')
    } else if (status === 401) {
      ElMessage.error('❌ OpenWeatherMap API 키 인증에 실패했습니다.')
    } else {
      ElMessage.error('❌ 날씨 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.')
    }
    isSearchingWorld.value = false
    return
  }

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
  <div class="dashboard-wrapper">
    <!-- [복구] 대시보드 ↔ 서비스 소개 탭(실제 라우터 이동) + 화씨/섭씨 토글 -->
    <nav class="view-tabs">
      <div class="view-tab-buttons">
        <RouterLink to="/library" class="view-tab" :class="{ 'view-tab--active': !isShowingSubRoute }">
          🌤️ 날씨 대시보드
        </RouterLink>
        <RouterLink
          to="/library/about"
          class="view-tab"
          :class="{ 'view-tab--active': route.path === '/library/about' }"
        >
          ℹ️ 서비스 소개
        </RouterLink>
      </div>
      <UnitToggler />
    </nav>

    <RouterView v-if="isShowingSubRoute" />

    <template v-else>
      <!-- [복구] 폭염 경고 기준 설정 -->
      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="card-header">⚠️ 폭염 경고 기준 설정</div>
        </template>
        <AlertBox
          :threshold="alertThreshold"
          :hot-cities="hotAlertCities"
          @update-threshold="handleUpdateThreshold"
        />
      </el-card>

      <!-- [복구] 즐겨찾기 도시 목록 — 이름만 나열하지 않고, 아래 실시간 날씨 카드와 동일한
           WeatherCard를 재사용해서 온도·세차지수·상세보기까지 바로 볼 수 있게 했습니다. -->
      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="card-header">⭐ 즐겨찾기 도시</div>
        </template>
        <p v-if="favoriteCities.length === 0" class="favorite-empty">
          아직 즐겨찾기한 도시가 없어요. 카드 왼쪽 위의 ☆ 버튼을 눌러보세요.
        </p>
        <div v-else class="weather-grid">
          <WeatherCard
            v-for="item in favoriteCities"
            :key="item.id"
            :city="item"
            @select-card="handleSelectCard"
            @click-detail="handleClickDetail"
          />
        </div>
      </el-card>

      <!-- [UI Library 적용 ①] el-card + #header 슬롯으로 기존 BaseDashboardCard를 대체
           [UI Library 적용 ②] v-loading 디렉티브로 기존 "로딩 중..." 문구를 대체 -->
      <el-card v-loading="isLoading" element-loading-text="실시간 기상 데이터를 불러오는 중입니다..." class="section-card" shadow="never">
        <template #header>
          <div class="card-header">🏙️ 지역별 실시간 날씨</div>
        </template>
        <p v-if="loadError" class="error-message">{{ loadError }}</p>
        <p v-else-if="!isLoading && nonFavoriteWeatherList.length === 0" class="favorite-empty">
          모든 도시를 즐겨찾기에 등록했어요. 위 ⭐ 즐겨찾기 도시에서 확인해보세요.
        </p>
        <div v-else class="weather-grid">
          <WeatherCard
            v-for="item in nonFavoriteWeatherList"
            :key="item.id"
            :city="item"
            @select-card="handleSelectCard"
            @click-detail="handleClickDetail"
          />
        </div>
      </el-card>

      <div class="status-bar">{{ selectedCityInfo }}</div>

      <el-card class="section-card" shadow="never">
        <template #header>
          <div class="card-header">🌍 세계 도시 날씨 검색 · 여행 준비물 안내</div>
        </template>

        <!-- [UI Library 적용 ③] el-input(clearable) + el-button(loading) — 검색 버튼을
             클릭하면 handleSearchWorldCity에서 먼저 입력값을 검증한 뒤에만 API를 호출합니다. -->
        <div class="world-search">
          <el-input
            v-model="worldCityInput"
            class="world-input"
            placeholder="영문 도시명 입력 (예: Tokyo, Paris, Hanoi)"
            clearable
            @keyup.enter="handleSearchWorldCity"
          />
          <el-button type="primary" :loading="isSearchingWorld" @click="handleSearchWorldCity">
            검색
          </el-button>
        </div>

        <div v-if="worldWeather" class="world-result">
          <img
            v-if="worldCountry?.flags?.png"
            :src="worldCountry.flags.png"
            :alt="`${worldCountry.name} 국기`"
            class="country-flag"
          />
          <div class="world-info">
            <h4>
              {{ worldWeather.name }}<span v-if="worldCountry">, {{ worldCountry.name }}</span>
              <!-- [UI Library 적용 ④] el-tag — 과제 2·3의 25도 기준 뱃지를 라이브러리 태그로 표시 -->
              <el-tag :type="isHotDestination ? 'danger' : 'info'" size="small" class="temp-tag" round>
                {{ isHotDestination ? '🔥 더움' : '❄️ 선선함' }}
              </el-tag>
            </h4>
            <p>🌡️ {{ Math.round(worldWeather.main.temp) }}°C · {{ worldWeather.weather[0].description }}</p>
            <template v-if="worldCountry">
              <p>🏛️ 수도: {{ worldCountry.capital || '정보 없음' }}</p>
              <p>💱 통화: {{ worldCountry.currencies?.[0]?.name || '정보 없음' }}</p>
            </template>
            <p v-else class="country-fallback">🌍 국가 정보를 불러오지 못했어요. (날씨 정보만 표시)</p>
            <p v-if="travelTip" class="travel-tip">{{ travelTip }}</p>
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

/* [복구] 대시보드 ↔ 서비스 소개 탭 바 */
.view-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-muted, #f1f5f9);
  padding: 8px;
  border-radius: var(--radius-pill, 999px);
  border: 1px solid var(--surface-border, #e2e8f0);
  margin-bottom: 16px;
}

.view-tab-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-tab {
  text-decoration: none;
  color: var(--ink-500, #64748b);
  font-weight: 600;
  font-size: 14px;
  padding: 9px 18px;
  border-radius: var(--radius-pill, 999px);
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.view-tab:hover {
  color: var(--ink-900, #2c3e50);
  background: rgba(15, 23, 42, 0.05);
}

.view-tab--active {
  color: #ffffff;
  background: var(--brand-600, #4f46e5);
}

.view-tab--active:hover {
  color: #ffffff;
  background: var(--brand-700, #4338ca);
}

/* [UI Library 적용] el-card 두 장 사이 기본 간격 */
.section-card {
  margin-bottom: 16px;
}

.section-card :deep(.el-card__header) {
  padding: 14px 20px;
  background: var(--surface-muted, #f8fafc);
}

.card-header {
  font-weight: 800;
  font-size: 15px;
  color: var(--ink-900, #2c3e50);
}

/* [복구] 즐겨찾기 도시 목록 문구 */
.favorite-empty {
  color: var(--ink-500, #7f8c8d);
  font-size: 14px;
  margin: 0;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 12px;
  min-height: 80px;
}

.weather-grid :deep(.weather-card) {
  margin-bottom: 0;
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
  margin-bottom: 16px;
}

.world-search {
  display: flex;
  gap: 8px;
}

.world-search :deep(.world-input) {
  flex: 1;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.temp-tag {
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
