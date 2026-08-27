import { createRouter, createWebHistory } from 'vue-router'

//  라우터 지연 로딩(Lazy Loading) + Catch-all Route
const routes = [
  {
    path: '/',
    name: 'weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/about',
    name: 'weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  // 동적 경로 매핑: :cityId 로 전달된 값은 WeatherDetailView에서
  // useRoute().params.cityId 로 꺼내 쓴다.
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  // [복구] 과제 6(Axios) — 과제 4·5에서 쓰던 라우터를 그대로 이어받아
  // "상세보기"와 "서비스 소개"를 실제 라우팅으로 처리합니다.
  {
    path: '/axios',
    name: 'axios-home',
    component: () => import('../views/WeatherAxiosView.vue'),
  },
  {
    path: '/axios/about',
    name: 'axios-about',
    component: () => import('../views/WeatherAboutView.vue'),
    props: { homePath: '/axios' },
  },
  {
    path: '/axios/weather/:cityId',
    name: 'axios-weather-detail',
    component: () => import('../views/WeatherRealDetailView.vue'),
    meta: { homePath: '/axios' },
  },
  // [복구] 과제 7(UI Library) — 과제 6과 동일하게 실제 라우팅으로 처리합니다.
  {
    path: '/library',
    name: 'library-home',
    component: () => import('../views/WeatherUiLibraryView.vue'),
  },
  {
    path: '/library/about',
    name: 'library-about',
    component: () => import('../views/WeatherAboutView.vue'),
    props: { homePath: '/library' },
  },
  {
    path: '/library/weather/:cityId',
    name: 'library-weather-detail',
    component: () => import('../views/WeatherRealDetailView.vue'),
    meta: { homePath: '/library' },
  },
  // Catch-all Route: 위에서 정의되지 않은 모든 경로
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
