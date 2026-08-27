<script setup>
// WeatherParent를 대체하는 메인 대시보드 화면 ('/' 경로)
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import AlertBox from '../components/exercise/AlertBox.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const props = defineProps({
  // true면 과제5 섹션처럼 실제 Vue Router와 완전히 분리된 "독립 모드"로 동작합니다.
  // (URL 쿼리스트링 동기화를 하지 않고, 상세보기도 router.push 대신 alert로 대체)
  standalone: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const route = useRoute()
const favoriteStore = useFavoriteStore()

// 1. [WeatherMockup 참고] 가상의 백엔드 데이터 배열
// rainForecast: 오늘 이후 3일간 비 예보 여부 (true = 비, false = 비 없음)
// dustLevel: 오늘 미세먼지 등급 ('좋음' | '보통' | '나쁨')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', rainForecast: [false, false, false], dustLevel: '좋음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', rainForecast: [true, false, false], dustLevel: '보통' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', rainForecast: [false, false, true], dustLevel: '좋음' },
  { id: 'city_04', name: '인천', temp: 27, status: '비', rainForecast: [true, true, false], dustLevel: '나쁨' },
  { id: 'city_05', name: '대전', temp: 22, status: '맑음', rainForecast: [false, false, false], dustLevel: '나쁨' },
  { id: 'city_06', name: '대구', temp: 31, status: '맑음', rainForecast: [false, false, false], dustLevel: '보통' },
  { id: 'city_07', name: '광주', temp: 23, status: '비', rainForecast: [false, true, false], dustLevel: '좋음' },
  { id: 'city_08', name: '제주', temp: 29, status: '비', rainForecast: [false, false, false], dustLevel: '좋음' },
])

// 2. 검색어 — URL 쿼리스트링(?q=)과 실시간 동기화 (about 페이지에 소개된 기능)
//    최초 진입 시 주소창에 ?q=서울 같은 값이 있으면 검색창에도 반영합니다.
const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// [WeatherMockup 참고] 검색어와 도시 이름이 매칭되는지 판별
// 목록에서 지우지 않고 카드를 흐리게(dim) 처리할 때 사용합니다.
const isMatched = (item) => {
  const query = searchQuery.value.trim()
  if (!query) {
    return true
  }
  return item.name.includes(query)
}

const matchCount = computed(() => weatherList.value.filter(isMatched).length)

// 검색 중(검색어가 있음)일 때만 매칭된 카드를 강조색으로 표시하기 위한 플래그
const isSearching = computed(() => searchQuery.value.trim().length > 0)

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

// 검색어가 바뀔 때마다 새로고침 없이 URL 쿼리스트링에 반영 (router.replace)
// standalone 모드(과제5 섹션)에서는 실제 라우터의 주소창을 건드리지 않도록 건너뜁니다.
watch(searchQuery, (newQuery) => {
  if (props.standalone) {
    return
  }
  router.replace({ query: { ...route.query, q: newQuery || undefined } })
})

// 3. [WeatherParent 유지] 폭염 경고 기준 온도 ("기준 날씨")
const alertThreshold = ref(30)

const hotAlertCities = computed(() => {
  return weatherList.value.filter((item) => item.temp > alertThreshold.value)
})

watch(alertThreshold, (newValue, oldValue) => {
  console.log(`⚠️ [watch 감지] 폭염 경고 기준 온도가 ${oldValue}°C → ${newValue}°C로 변경되었습니다.`)
})

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

const handleUpdateThreshold = (newValue) => {
  alertThreshold.value = newValue
}

const handleSelectCard = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// [변경] window.alert() 제거 → /weather/:cityId 로 Programmatic Navigation
// standalone 모드(과제5 섹션)는 실제 라우터의 화면 전환에 관여하지 않으므로
// 대신 WeatherParent와 동일한 추천 문구 alert로 상세 정보를 보여줍니다.
const handleClickDetail = (city) => {
  if (props.standalone) {
    let recommendation

    if (city.status === '비' && city.temp >= 25) {
      recommendation = '☔ 비도 오고 더워요! 우산과 물병을 모두 챙기세요.'
    } else if (city.status === '비') {
      recommendation = '☔ 비가 오고 있어요! 우산을 꼭 챙기세요.'
    } else if (city.temp >= 25) {
      recommendation = '💧 날씨가 더워요! 물병을 챙기는 것을 추천해요.'
    } else {
      recommendation = '😊 외출하기 괜찮은 날씨예요!'
    }

    window.alert(
      `📍 ${city.name} 날씨 안내\n\n🌡️ 현재 온도: ${city.temp}°C\n🌤️ 날씨: ${city.status}\n\n${recommendation}`,
    )
    return
  }

  router.push('/weather/' + city.id)
}

// [본인 추가 Store] 즐겨찾기한 도시 이름 목록 (favoriteStore 활용)
const favoriteCityNames = computed(() =>
  weatherList.value.filter((item) => favoriteStore.isFavorite(item.id)).map((item) => item.name),
)
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard title="⚠️ 폭염 경고 기준 설정">
      <AlertBox
        :threshold="alertThreshold"
        :hot-cities="hotAlertCities"
        @update-threshold="handleUpdateThreshold"
      />
    </BaseDashboardCard>

    <BaseDashboardCard title="⭐ 즐겨찾기 도시">
      <p v-if="favoriteCityNames.length === 0" class="favorite-empty">
        아직 즐겨찾기한 도시가 없어요. 카드 왼쪽 위의 ☆ 버튼을 눌러보세요.
      </p>
      <p v-else class="favorite-list">{{ favoriteCityNames.join(', ') }}</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="🏙️ 지역별 날씨 현황">
      <div class="weather-grid">
        <WeatherCard
          v-for="item in weatherList"
          :key="item.id"
          :city="item"
          :dimmed="!isMatched(item)"
          :highlighted="isSearching && isMatched(item)"
          @select-card="handleSelectCard"
          @click-detail="handleClickDetail"
        />
      </div>

      <p v-if="matchCount === 0" class="empty-message">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
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

.empty-message {
  text-align: center;
  color: var(--danger-500, #e74c3c);
  padding: 10px 0;
  margin: 0;
}

.favorite-empty {
  color: var(--ink-500, #7f8c8d);
  font-size: 14px;
  margin: 0;
}

.favorite-list {
  color: #b8860b;
  font-weight: bold;
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
</style>
