<script setup>
import { ref, computed } from 'vue'

// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
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

  // 추가 데이터
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

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 검색어와 도시 이름이 매칭되는지 판별 (목록에서 지우지 않고 흐리게 처리할 때 사용)
const isMatched = (item) => {
  const query = searchQuery.value.trim()

  // 검색어가 없으면 전부 매칭된 것으로 취급 (전체 목록 그대로 표시)
  if (!query) {
    return true
  }

  return item.name.includes(query)
}

// 검색어와 일치하는 도시 수 (0개일 때 안내 문구를 보여주기 위한 용도)
const matchCount = computed(() => weatherList.value.filter(isMatched).length)

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status, temperature) => {
  let recommendation

  if (status === '비' && temperature >= 25) {
    recommendation = '☔ 비도 오고 더워요! 우산과 물병을 모두 챙기세요.'
  } else if (status === '비') {
    recommendation = '☔ 비가 오고 있어요! 우산을 꼭 챙기세요.'
  } else if (temperature >= 25) {
    recommendation = '💧 날씨가 더워요! 물병을 챙기는 것을 추천해요.'
  } else {
    recommendation = '😊 외출하기 괜찮은 날씨예요!'
  }

  window.alert(
    `📍 ${cityName} 날씨 안내\n\n🌡️ 현재 온도: ${temperature}°C\n🌤️ 날씨: ${status}\n\n${recommendation}`,
  )
}

// 본인만의 데이터 - 세차지수 계산
// 조건: 3일 안에 비 예보가 하나도 없고, 오늘 미세먼지가 '나쁨'이 아니면 세차하기 좋은 날
const getWashIndex = (item) => {
  const noRainSoon = item.rainForecast.every((willRain) => !willRain)
  const dustOk = item.dustLevel !== '나쁨'

  if (noRainSoon && dustOk) {
    return { goodToWash: true, label: '👍 세차하기 좋아요' }
  }

  if (!noRainSoon) {
    return { goodToWash: false, label: '☔ 곧 비 예보가 있어요' }
  }

  return { goodToWash: false, label: '😷 미세먼지가 나빠요' }
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!--v-model은 한글 입력 시 문자 조합 과정에서는 값을 즉시 갱신하지 않고, 문자가 조합 완료된 후
      모델에 반영한다.-->
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <!-- 한글 조합 중에도 입력값을 즉시 반영하기 위해 v-model 대신 :value와 @input을 사용하여 직접
      값을 갱신한다. -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        :class="{ 'weather-card--dim': !isMatched(item) }"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <!-- 본인만의 데이터2를 활용한 세차지수 Mockup -->
        <div class="wash-index">
          <h4>🚗 세차지수</h4>
          <span class="badge" :class="getWashIndex(item).goodToWash ? 'wash-good' : 'wash-bad'">
            {{ getWashIndex(item).label }}
          </span>

          <!-- 3일치 예보를 v-for로 반복 출력 (중첩 v-for 연습) -->
          <div class="forecast-days">
            <span
              v-for="(willRain, dayIdx) in item.rainForecast"
              :key="dayIdx"
              class="forecast-day"
            >
              {{ dayIdx + 1 }}일 후
              <span v-if="willRain">☔</span>
              <span v-else>☀️</span>
            </span>
          </div>
        </div>
        <!--이벤트 버블링으로 부모 div의 click 이벤트가 실행되지 않도록 .stop 이벤트 modifier를 사용한다. -->
        <!-- item.name과 item.status 두 개의 인자를 함수에 전달한다.
     @click="함수명"처럼 함수명만 지정하면 Vue가 이벤트 객체를 첫 번째 인자로 자동 전달한다. -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status, item.temp)">
          상세보기
        </button>
      </div>

      <!-- 검색 결과가 하나도 없을 때 안내 문구 -->
      <p v-if="matchCount === 0" style="text-align: center; color: #e74c3c; padding: 10px 0">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
<style>
@import '@/assets/exercise.css';

/* 검색어와 맞지 않는 카드를 지우는 대신 흐리게 처리 (레이아웃이 흔들리지 않도록) */
.weather-card {
  transition:
    opacity 0.2s ease,
    filter 0.2s ease;
}
.weather-card--dim {
  opacity: 0.35;
  filter: grayscale(60%);
}

/* 세차지수 뱃지 색상 */
.wash-index {
  margin-top: 8px;
}
.wash-good {
  background-color: #00b894;
}
.wash-bad {
  background-color: #b2bec3;
}
.forecast-days {
  display: flex;
  gap: 10px;
  margin-top: 6px;
  font-size: 13px;
  color: #636e72;
}
</style>
