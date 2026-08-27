import { defineStore } from 'pinia'

// 날씨 단위(섭씨/화씨)를 앱 전역에서 공유하기 위한 Store
export const useConfigStore = defineStore('config', {
  state: () => ({
    // 단위를 저장하는 변수 (초기값: celsius)
    unit: 'celsius', // 'celsius' | 'fahrenheit'
  }),

  getters: {
    // 현재 단위 상태에 맞는 기호 (°C / °F)
    unitSymbol: (state) => (state.unit === 'fahrenheit' ? '°F' : '°C'),
  },

  actions: {
    // 'celsius'와 'fahrenheit'를 토글(스위칭)하는 함수
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
