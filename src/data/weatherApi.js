// 과제 6(Axios), 과제 7(UI Library), 그리고 이 둘의 "상세보기" 라우트가 함께 쓰는
// 실시간 날씨 API 상수/헬퍼 — 세 화면에서 각자 따로 선언하던 것을 하나로 모았습니다.
// [품질관리] API 키는 소스코드에 직접 넣지 않고 .env의 환경 변수(VITE_OPENWEATHER_API_KEY)로 관리합니다.
export const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// [본인 도시 목록] 과제 2부터 계속 이어져 온 8개 도시
export const cityDefs = [
  { id: 'city_01', name: '서울', englishName: 'Seoul' },
  { id: 'city_02', name: '수원', englishName: 'Suwon' },
  { id: 'city_03', name: '부산', englishName: 'Busan' },
  { id: 'city_04', name: '인천', englishName: 'Incheon' },
  { id: 'city_05', name: '대전', englishName: 'Daejeon' },
  { id: 'city_06', name: '대구', englishName: 'Daegu' },
  { id: 'city_07', name: '광주', englishName: 'Gwangju' },
  { id: 'city_08', name: '제주', englishName: 'Jeju' },
]

// 대기오염 지수(1~5)를 카드가 쓰는 dustLevel 문구로 환산
export const aqiToDustLevel = (aqi) => {
  if (aqi <= 2) return '좋음'
  if (aqi === 3) return '보통'
  return '나쁨'
}

// 세차지수용 3일 예보 — 5일/3시간 예보 API의 list를 날짜별로 묶어서
// 오늘(부분 데이터)을 제외한 앞으로 3일 동안 비 예보(main === 'Rain')가 있는지 반환
export const buildRainForecast = (list) => {
  if (!list || list.length === 0) {
    return [false, false, false]
  }

  const byDate = new Map()
  list.forEach((entry) => {
    const dateKey = entry.dt_txt.slice(0, 10) // 'YYYY-MM-DD'
    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, [])
    }
    byDate.get(dateKey).push(entry)
  })

  const futureDays = Array.from(byDate.keys()).slice(1, 4)
  const rainForecast = futureDays.map((dateKey) =>
    byDate.get(dateKey).some((entry) => entry.weather[0].main === 'Rain'),
  )

  while (rainForecast.length < 3) {
    rainForecast.push(false)
  }

  return rainForecast
}
