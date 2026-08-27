<script setup>
// 과제 2: 날씨 Mockup — v-for / v-if / 양방향 바인딩 / 이벤트 수식어 연습용 초기 버전
// (이 화면이 과제 3에서 computed·watch/watchEffect가 더해지고, 과제 4~6에서
//  router → store → axios 순서로 점점 발전해 나갑니다.)
import { ref } from 'vue'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'

// 배열 렌더링(v-for)용 mock 데이터
// 본인만의 데이터 추가 — 슬라이드 예시(3개 도시)를 이후 과제와 동일한
// 8개 도시로 확장했습니다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 27, status: '비' },
  { id: 'city_05', name: '대전', temp: 22, status: '맑음' },
  { id: 'city_06', name: '대구', temp: 31, status: '맑음' },
  { id: 'city_07', name: '광주', temp: 23, status: '비' },
  { id: 'city_08', name: '제주', temp: 29, status: '비' },
])

// 양방향 바인딩 + 한글 처리 — 입력한 도시명을 그대로 출력만 합니다.
// (실제로 목록을 걸러내는 필터링은 computed를 배우는 과제 3에서 이어집니다.)
const searchQuery = ref('')
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// 카드를 클릭하면 상태바에 "{도시}이 선택되었습니다." 표기
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectCard = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

// 카드 내부 [상세보기] 버튼은 @click.stop으로 버블링을 막아,
// 카드 클릭(selectCard)과는 무관하게 alert만 띄웁니다.
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard title="🗺️ 지역별 날씨 현황">
      <div
        v-for="city in weatherList"
        :key="city.id"
        class="weather-row"
        @click="selectCard(city.name)"
      >
        <div class="weather-row-info">
          <p class="weather-row-name">{{ city.name }} ({{ city.status }})</p>
          <p class="weather-row-temp">현재 기온: {{ city.temp }}°C</p>
        </div>
        <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
        <button class="btn-detail" @click.stop="showDetail(city.name, city.status)">상세보기</button>
      </div>
    </BaseDashboardCard>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.weather-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  background: var(--surface, #fff);
  border: 1px solid var(--surface-border, #e6e9f2);
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.weather-row:hover {
  border-color: var(--brand-100, #c7d2fe);
  box-shadow: var(--shadow-sm, none);
}

.weather-row:last-child {
  margin-bottom: 0;
}

.weather-row-info {
  flex: 1;
  min-width: 0;
}

.weather-row-name {
  margin: 0;
  font-weight: 700;
  color: var(--ink-900, #2c3e50);
  font-size: 14px;
}

.weather-row-temp {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: var(--ink-500, #64748b);
}

.badge {
  flex-shrink: 0;
  display: inline-block;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-pill, 999px);
  white-space: nowrap;
}

.hot {
  background-color: var(--danger-50, #fef2f2);
  color: var(--danger-500, #ef4444);
}

.cool {
  background-color: var(--brand-50, #eef2ff);
  color: var(--brand-600, #4f46e5);
}

.btn-detail {
  flex-shrink: 0;
  padding: 6px 12px;
  border: none;
  border-radius: var(--radius-pill, 999px);
  background: var(--surface-muted, #f1f5f9);
  color: var(--ink-700, #334155);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-detail:hover {
  background: var(--brand-100, #e0e7ff);
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
