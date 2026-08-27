<script setup>
// 선택된 도시 객체(city)를 props로 전달받아 표시만 담당합니다.
// 카드를 클릭하면 select-card, 상세보기 버튼을 클릭하면 click-detail
// 이벤트를 부모(WeatherParent)에게 emit하여 실제 처리는 부모가 맡습니다.
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useFavoriteStore } from '@/stores/favoriteStore'

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  // 검색어와 매칭되지 않을 때 카드를 지우지 않고 흐리게(dim) 처리하기 위한 플래그
  dimmed: {
    type: Boolean,
    default: false,
  },
  // 검색 중이면서 이 카드가 검색어와 매칭됐을 때 강조색으로 표시하기 위한 플래그
  highlighted: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const onSelectCard = () => {
  emit('select-card', props.city)
}

const onClickDetail = () => {
  emit('click-detail', props.city)
}

// [본인 추가 Store] 즐겨찾기 등록/해제 — 카드 클릭(select-card)으로 번지지 않도록 .stop 처리
const onToggleFavorite = () => {
  favoriteStore.toggleFavorite(props.city.id)
}

// [WeatherMockup 참고] 본인만의 데이터 - 세차지수 계산
// 조건: 3일 안에 비 예보가 하나도 없고, 오늘 미세먼지가 '나쁨'이 아니면 세차하기 좋은 날
const washIndex = computed(() => {
  const noRainSoon = props.city.rainForecast.every((willRain) => !willRain)
  const dustOk = props.city.dustLevel !== '나쁨'

  if (noRainSoon && dustOk) {
    return { goodToWash: true, icon: '👍', text: '세차하기 좋아요' }
  }

  if (!noRainSoon) {
    return { goodToWash: false, icon: '☔', text: '곧 비 예보가 있어요' }
  }

  return { goodToWash: false, icon: '😷', text: '미세먼지가 나빠요' }
})

// configStore.unit 설정에 따라 화면에 보여줄 기온을 변환
// (원본 city.temp는 항상 섭씨 숫자 그대로 유지 — 더움/선선함 판정 등 로직은 원본 기준)
const displayTemp = computed(() => {
  const rawTemp = props.city.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})
</script>

<template>
  <div
    class="weather-card"
    :class="{ 'weather-card--dim': dimmed, 'weather-card--match': highlighted }"
    @click="onSelectCard"
  >
    <button
      class="btn-favorite"
      :class="{ 'btn-favorite--active': favoriteStore.isFavorite(city.id) }"
      @click.stop="onToggleFavorite"
    >
      {{ favoriteStore.isFavorite(city.id) ? '⭐' : '☆' }}
    </button>

    <button class="btn-detail" @click.stop="onClickDetail">상세보기</button>

    <h4>{{ city.name }} <span class="card-status">({{ city.status }})</span></h4>

    <div class="temp-row">
      <p class="card-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <span v-if="city.temp >= 25" class="badge hot">더움</span>
      <span v-else class="badge cool">선선함</span>
    </div>

    <!-- [WeatherMockup 참고] 세차지수 + 3일치 비 예보 — 박스 중첩 대신 한 줄로 펼친 정보 바 -->
    <div class="wash-index">
      <div class="wash-index-label">
        <span class="wash-index-icon">🚗</span>
        <span class="wash-index-title">세차지수</span>
      </div>

      <div class="wash-verdict">
        <span class="wash-dot" :class="washIndex.goodToWash ? 'wash-dot--good' : 'wash-dot--bad'"></span>
        <span class="wash-verdict-text">{{ washIndex.text }}</span>
      </div>

      <div class="forecast-strip">
        <div v-for="(willRain, dayIdx) in city.rainForecast" :key="dayIdx" class="forecast-tile">
          <span class="forecast-day-label">{{ dayIdx + 1 }}일</span>
          <span class="forecast-icon">{{ willRain ? '☔' : '☀️' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  background: var(--surface, #fff);
  border: 1px solid var(--surface-border, #dee2e6);
  padding: 16px 60px 16px 44px;
  margin-bottom: 12px;
  border-radius: var(--radius-md, 12px);
  cursor: pointer;
  position: relative;
  box-shadow: var(--shadow-sm, none);
  transition:
    opacity 0.2s ease,
    filter 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

.weather-card:hover {
  box-shadow: var(--shadow-md, none);
  transform: translateY(-1px);
  border-color: var(--brand-100, #dee2e6);
}

/* 검색어와 맞지 않는 카드를 지우는 대신 흐리게 처리 (레이아웃이 흔들리지 않도록) */
.weather-card--dim {
  opacity: 0.35;
  filter: grayscale(60%);
}

/* 검색 중이고 검색어와 매칭된 카드는 "이게 검색결과다"라는 느낌으로 색을 다르게 강조 */
.weather-card--match {
  background: var(--brand-50, #eaf6ff);
  border-color: var(--brand-500, #3498db);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
}

.weather-card h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink-900, #2c3e50);
}

.card-status {
  font-weight: 500;
  color: var(--ink-500, #64748b);
  font-size: 0.85em;
}

.temp-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.card-temp {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--ink-900, #2c3e50);
  letter-spacing: -0.02em;
}

.badge {
  display: inline-block;
  padding: 4px 11px;
  font-size: 12px;
  font-weight: 700;
  border-radius: var(--radius-pill, 999px);
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
  position: absolute;
  right: 14px;
  top: 14px;
  padding: 7px 14px;
  border: none;
  border-radius: var(--radius-pill, 999px);
  background: var(--brand-50, #eef2ff);
  color: var(--brand-600, #4f46e5);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.btn-detail:hover {
  background: var(--brand-600, #4f46e5);
  color: #fff;
}

/* [본인 추가 Store] 즐겨찾기 별 버튼 */
.btn-favorite {
  position: absolute;
  left: 14px;
  top: 16px;
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  color: var(--ink-400, #b2bec3);
  transition: transform 0.15s ease;
}

.btn-favorite:hover {
  transform: scale(1.12);
}

.btn-favorite--active {
  color: #f1c40f;
  filter: drop-shadow(0 0 2px rgba(241, 196, 15, 0.6));
}

/* [WeatherMockup 참고] 세차지수 + 3일 예보 — 박스 중첩 대신 한 줄로 펼친 정보 바
   (색칠된 박스를 여러 겹 쌓지 않고, 얇은 구분선 + 작은 점 색상 하나로만 상태를 표현) */
.wash-index {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--surface-border, #e6e9f2);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.wash-index-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-500, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.wash-index-icon {
  font-size: 14px;
}

.wash-verdict {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 14px;
  border-left: 1px solid var(--surface-border, #e6e9f2);
}

.wash-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.wash-dot--good {
  background: var(--success-500, #22c55e);
}

.wash-dot--bad {
  background: var(--warning-500, #f59e0b);
}

.wash-verdict-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-900, #2c3e50);
  white-space: nowrap;
}

/* 3일치 예보 — 남는 가로 공간 오른쪽으로 붙여서 카드 전체 너비를 활용 */
.forecast-strip {
  display: flex;
  gap: 14px;
  margin-left: auto;
  padding-left: 14px;
  border-left: 1px solid var(--surface-border, #e6e9f2);
}

.forecast-tile {
  display: flex;
  align-items: center;
  gap: 5px;
}

.forecast-day-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-500, #64748b);
}

.forecast-icon {
  font-size: 15px;
}
</style>
