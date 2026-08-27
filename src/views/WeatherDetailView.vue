<script setup>
// 지역별 상세 기상관측 정보 페이지 ('/weather/:cityId')
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 도시 코드별 상세 기상관측 Mock Data (임시로 활용)
const detailMockData = {
  city_01: {
    region: '대한민국 서울특별시',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 55,
    windSpeed: 2.5,
  },
  city_02: {
    region: '대한민국 경기도 수원시',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 78,
    windSpeed: 3.2,
  },
  city_03: {
    region: '대한민국 부산광역시',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 61,
    windSpeed: 4.1,
  },
  city_04: {
    region: '대한민국 인천광역시',
    name: '인천',
    temp: 27,
    status: '비',
    humidity: 80,
    windSpeed: 3.5,
  },
  city_05: {
    region: '대한민국 대전광역시',
    name: '대전',
    temp: 22,
    status: '맑음',
    humidity: 50,
    windSpeed: 1.8,
  },
  city_06: {
    region: '대한민국 대구광역시',
    name: '대구',
    temp: 31,
    status: '맑음',
    humidity: 40,
    windSpeed: 2.0,
  },
  city_07: {
    region: '대한민국 광주광역시',
    name: '광주',
    temp: 23,
    status: '비',
    humidity: 75,
    windSpeed: 2.9,
  },
  city_08: {
    region: '대한민국 제주특별자치도',
    name: '제주',
    temp: 29,
    status: '비',
    humidity: 70,
    windSpeed: 5.2,
  },
}

const cityDetail = ref(null)

// Router 동적 경로 매핑(cityId)을 기반으로 Mount 시점에 Mock Data에서 선택
onMounted(() => {
  cityDetail.value = detailMockData[route.params.cityId] ?? null
})

// [WeatherMockup 참고] 날씨/기온에 따른 한 줄 추천 문구
const recommendation = computed(() => {
  if (!cityDetail.value) return ''
  const { status, temp } = cityDetail.value

  if (status === '비' && temp >= 25) {
    return '☔ 비도 오고 더워요! 우산과 물병을 모두 챙기세요.'
  }
  if (status === '비') {
    return '☔ 비가 오고 있어요! 우산을 꼭 챙기세요.'
  }
  if (temp >= 25) {
    return '💧 날씨가 더워요! 물병을 챙기는 것을 추천해요.'
  }
  return '😊 외출하기 괜찮은 날씨예요!'
})

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <section class="detail-box" v-if="cityDetail">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />
    <div class="detail-grid">
      <p>📍 지정 지역 <strong>{{ cityDetail.region }}</strong></p>
      <p>🌡️ 실시간 기온 <strong>{{ cityDetail.temp }}°C</strong></p>
      <p>🌤️ 기상 현황 <strong>{{ cityDetail.status }}</strong></p>
      <p>💧 대기 습도 <strong>{{ cityDetail.humidity }}%</strong></p>
      <p>💨 현재 풍속 <strong>{{ cityDetail.windSpeed }}m/s</strong></p>
    </div>
    <p class="recommendation">{{ recommendation }}</p>
    <button class="btn-back" @click="goHome">← 메인 대시보드로 돌아가기</button>
  </section>

  <section class="detail-box" v-else>
    <p class="empty-message">😭 '{{ route.params.cityId }}' 도시 정보를 찾을 수 없습니다.</p>
    <button class="btn-back" @click="goHome">← 메인 대시보드로 돌아가기</button>
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
