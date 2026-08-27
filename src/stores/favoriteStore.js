import { defineStore } from 'pinia'

// [본인 추가 Store] 즐겨찾기(관심) 도시 목록을 앱 전역에서 관리하는 Store
export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favoriteCityIds: [], // 즐겨찾기한 도시의 id 배열
  }),

  getters: {
    // 특정 도시가 즐겨찾기 되어 있는지 판별
    isFavorite: (state) => (cityId) => state.favoriteCityIds.includes(cityId),
    // 즐겨찾기한 도시 수
    favoriteCount: (state) => state.favoriteCityIds.length,
  },

  actions: {
    // 즐겨찾기 등록/해제를 토글
    toggleFavorite(cityId) {
      if (this.favoriteCityIds.includes(cityId)) {
        this.favoriteCityIds = this.favoriteCityIds.filter((id) => id !== cityId)
      } else {
        this.favoriteCityIds.push(cityId)
      }
    },
  },
})
