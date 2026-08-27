<script setup>
// 과제 3: 날씨 Composition API — 과제 2(Mockup)에 computed(검색 필터링)와
// watch/watchEffect(반응형 변수 감시)를 더한 버전입니다.
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'

// 반응형 상태 관리 (과제 2와 동일한 8개 도시 데이터)
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
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// computed로 검색어에 포함되는 도시만 걸러낸 배열
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) {
    return weatherList.value // 검색어가 비었을 때는 원본 데이터 그대로
  }
  return weatherList.value.filter((city) => city.name.includes(query))
})

// selectedCityInfo가 바뀔 때마다 콘솔로그 (watch)
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// searchQuery를 타이핑할 때마다 콘솔로그 (watchEffect — 내부에서
// 읽은 반응형 값을 자동으로 추적하므로, 감시 대상을 따로 지정할 필요가 없습니다.)
watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 도시를 필터링합니다.`)
})

const selectCard = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 본인만의 반응형 상태 + computed + watcher
// 폭염 경고 기준 온도를 직접 입력받아, 기준을 넘는 도시를 computed로 뽑아내고
// 기준값이 바뀔 때마다 watch로 변경 이력을 로그로 남깁니다.
const alertThreshold = ref(30)
const hotAlertCities = computed(() =>
  weatherList.value.filter((city) => city.temp > alertThreshold.value).map((city) => city.name),
)
watch(alertThreshold, (newValue, oldValue) => {
  console.log(`[watch 감지] 폭염 경고 기준 온도가 ${oldValue}°C → ${newValue}°C로 변경되었습니다.`)
})
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard title="⚠️ 폭염 경고 기준 설정 (본인 추가)">
      <div class="threshold-row">
        <label for="threshold-input-c3">기준 온도</label>
        <input id="threshold-input-c3" v-model.number="alertThreshold" type="number" />
        <span>°C 이상</span>
      </div>
      <p v-if="hotAlertCities.length > 0" class="threshold-alert">
        🔥 경고 대상: {{ hotAlertCities.join(', ') }}
      </p>
      <p v-else class="threshold-ok">현재 기준을 넘는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="🗺️ 지역별 날씨 현황 (검색 결과)">
      <template v-if="filteredWeatherList.length > 0">
        <div
          v-for="city in filteredWeatherList"
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
      </template>
      <p v-else class="empty-message">😭 검색 결과와 일치하는 도시가 없습니다.</p>
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

.threshold-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.threshold-row label {
  font-size: 13px;
  color: var(--ink-700, #334155);
  font-weight: 600;
}

.threshold-row input {
  width: 70px;
  padding: 8px 10px;
  border: 1px solid var(--surface-border, #dee2e6);
  border-radius: var(--radius-sm, 8px);
  background: var(--surface, #fff);
  color: var(--ink-900, #2c3e50);
}

.threshold-row input:focus {
  outline: none;
  border-color: var(--brand-500, #6366f1);
  box-shadow: 0 0 0 3px var(--brand-50, rgba(99, 102, 241, 0.15));
}

.threshold-row span {
  font-size: 13px;
  color: var(--ink-500, #64748b);
}

.threshold-alert {
  margin: 10px 0 0 0;
  font-size: 13px;
  color: var(--danger-500, #ef4444);
  font-weight: 600;
}

.threshold-ok {
  margin: 10px 0 0 0;
  font-size: 13px;
  color: var(--ink-500, #64748b);
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

.empty-message {
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
</style>
