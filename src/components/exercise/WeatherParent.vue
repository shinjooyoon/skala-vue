<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import AlertBox from './AlertBox.vue'
import WeatherCard from './WeatherCard.vue'

const favoriteStore = useFavoriteStore()

// 1. [WeatherMockup 참고] 가상의 백엔드 데이터 배열 — 모든 반응형 데이터는
//    자식 컴포넌트로 옮기지 않고 이 최상위(WeatherParent)에서만 관리합니다.
// rainForecast: 오늘 이후 3일간 비 예보 여부 (true = 비, false = 비 없음)
// dustLevel: 오늘 미세먼지 등급 ('좋음' | '보통' | '나쁨')
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    rainForecast: [false, false, false],
    dustLevel: '좋음',
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    rainForecast: [true, false, false],
    dustLevel: '보통',
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    rainForecast: [false, false, true],
    dustLevel: '좋음',
  },
  {
    id: 'city_04',
    name: '인천',
    temp: 27,
    status: '비',
    rainForecast: [true, true, false],
    dustLevel: '나쁨',
  },
  {
    id: 'city_05',
    name: '대전',
    temp: 22,
    status: '맑음',
    rainForecast: [false, false, false],
    dustLevel: '나쁨',
  },
  {
    id: 'city_06',
    name: '대구',
    temp: 31,
    status: '맑음',
    rainForecast: [false, false, false],
    dustLevel: '보통',
  },
  {
    id: 'city_07',
    name: '광주',
    temp: 23,
    status: '비',
    rainForecast: [false, true, false],
    dustLevel: '좋음',
  },
  {
    id: 'city_08',
    name: '제주',
    temp: 29,
    status: '비',
    rainForecast: [false, false, false],
    dustLevel: '좋음',
  },
])

// 2. [원본 유지] 검색어 및 알림창 제어용 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 3. [WeatherMockup 참고] 검색어와 도시 이름이 매칭되는지 판별
//    목록에서 지우지 않고 카드를 흐리게(dim) 처리할 때 사용합니다.
const isMatched = (item) => {
  const query = searchQuery.value.trim()

  if (!query) {
    return true
  }

  return item.name.includes(query)
}

// 검색어와 일치하는 도시 수 (0개일 때 안내 문구를 보여주기 위한 용도)
const matchCount = computed(() => weatherList.value.filter(isMatched).length)

// 검색 중(검색어가 있음)일 때만 매칭된 카드를 강조색으로 표시하기 위한 플래그
const isSearching = computed(() => searchQuery.value.trim().length > 0)

// 4. [원본 유지] watch를 활용한 선택 도시 추적 센서
watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// 5. [원본 유지] watchEffect를 활용한 자동 의존성 API 로그 시뮬레이션
watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

// 6. [원본 유지] 폭염 경고 기준 온도 ("기준 날씨")
const alertThreshold = ref(30)

// 7. [원본 유지] 기준 온도(alertThreshold)를 초과하는 '폭염 주의' 도시 목록
const hotAlertCities = computed(() => {
  return weatherList.value.filter((item) => item.temp > alertThreshold.value)
})

// 8. [원본 유지] 기준 온도가 바뀔 때마다 이전/이후 값을 로그로 남깁니다.
watch(alertThreshold, (newValue, oldValue) => {
  console.log(
    `⚠️ [watch 감지] 폭염 경고 기준 온도가 ${oldValue}°C → ${newValue}°C로 변경되었습니다.`,
  )
})

// 9. 자식 컴포넌트가 emit하는 이벤트를 받아 처리하는 핸들러들
//    (SearchBar → update-query / AlertBox → update-threshold /
//     WeatherCard → select-card, click-detail)
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

const handleUpdateThreshold = (newValue) => {
  alertThreshold.value = newValue
}

const handleSelectCard = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// [WeatherMockup 참고] 날씨/기온에 따른 한 줄 추천 문구를 곁들인 알림창
const handleClickDetail = (city) => {
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
      <WeatherCard
        v-for="item in weatherList"
        :key="item.id"
        :city="item"
        :dimmed="!isMatched(item)"
        :highlighted="isSearching && isMatched(item)"
        @select-card="handleSelectCard"
        @click-detail="handleClickDetail"
      />

      <p v-if="matchCount === 0" class="empty-message">😭 검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}

.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
  margin: 0;
}

.favorite-empty {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

.favorite-list {
  color: #b8860b;
  font-weight: bold;
  margin: 0;
}

.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
