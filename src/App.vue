<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
import WeatherHomeView from './views/WeatherHomeView.vue'
import WeatherAboutView from './views/WeatherAboutView.vue'
import WeatherAxiosView from './views/WeatherAxiosView.vue'
import WeatherUiLibraryView from './views/WeatherUiLibraryView.vue'
import WeatherMockupView from './views/WeatherMockupView.vue'
import WeatherCompositionView from './views/WeatherCompositionView.vue'

// 메인(최신 과제) ↔ 지난 과제 보관함 전환 — 과제 2~7이 순차적으로 발전해온 구조이므로,
// 화면에는 가장 최신인 과제 7만 기본으로 보여주고 이전 단계는 보관함 탭에 따로 모아둡니다.
const mainTab = ref('main')

// 과제 5 섹션 전용 탭 상태 (과제 4의 Vue Router와는 완전히 무관한 로컬 상태).
const storeActiveTab = ref('dashboard')

const route = useRoute()

// [복구] 이 RouterView는 과제 4(라우터적용) 섹션 전용입니다. WeatherAxiosView·
// WeatherUiLibraryView도 각자 /axios/*, /library/* 전용 RouterView를 갖고 있는데,
// v-show는 컴포넌트를 언마운트하지 않으므로 세 RouterView가 항상 동시에 살아있습니다.
// 이름 없는 RouterView는 경로 접두사와 무관하게 "현재 매칭된 라우트"를 그대로 보여주므로,
// 가드 없이 두면 /axios, /library 경로로 이동했을 때 이 RouterView까지 같은 화면을
// 중복으로 그려버립니다. 그래서 이 RouterView는 /axios, /library가 아닌 기본 경로
// ('/', '/about', '/weather/:cityId')일 때만 보여줍니다.
const isBaseRoute = computed(() => !route.path.startsWith('/axios') && !route.path.startsWith('/library'))
</script>

<template>
  <div class="app-container">
    <!-- 상용 웹처럼 보이도록 추가한 최상단 브랜드 헤더 -->
    <header class="app-masthead">
      <span class="app-badge">🌤️</span>
      <div>
        <p class="app-title">Weather Dashboard</p>
        <p class="app-subtitle">Vue 3 · Vue Router · Pinia · Axios · UI Library 통합 실습</p>
      </div>
    </header>

    <!-- 메인 ↔ 지난 과제 보관함 전환 탭 -->
    <nav class="navigation-bar top-tabs">
      <div class="nav-links">
        <button
          type="button"
          class="nav-item nav-item--button"
          :class="{ 'router-link-exact-active': mainTab === 'main' }"
          @click="mainTab = 'main'"
        >
          🏠 메인
        </button>
        <span class="divider">|</span>
        <button
          type="button"
          class="nav-item nav-item--button"
          :class="{ 'router-link-exact-active': mainTab === 'archive' }"
          @click="mainTab = 'archive'"
        >
          📦 지난 과제 보관함
        </button>
      </div>
    </nav>

    <!-- 메인: 과제 2 → 3 → 4 → 5 → 6 → 7 순서로 발전해온 것 중 가장 최신 버전(Axios + UI Library)입니다 -->
    <section v-show="mainTab === 'main'">
      <h1>🌤️ 실시간 날씨 대시보드</h1>
      <hr />
      <WeatherUiLibraryView />
    </section>

    <!-- 지난 과제 보관함: 과제 2(Mockup) → 3(Composition) → 4(라우터) → 5(스토어) → 6(Axios) 구현을
         그대로 보존해서 모아둔 공간 -->
    <section v-show="mainTab === 'archive'">
      <h2>🌈 과제 2: 날씨 Mockup</h2>
      <hr />

      <WeatherMockupView />

      <h2>🧩 과제 3: 날씨 Composition API</h2>
      <hr />

      <WeatherCompositionView />

      <h2>🌦️ 과제 4: 라우터적용</h2>
      <hr />

      <nav class="navigation-bar">
        <div class="nav-links">
          <RouterLink to="/" class="nav-item">🌤️ 날씨 대시보드</RouterLink>
          <span class="divider">|</span>
          <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
        </div>
      </nav>

      <RouterView v-if="isBaseRoute" />

      <h2>🗃️ 과제 5: 스토어 적용</h2>
      <hr />

      <nav class="navigation-bar">
        <div class="nav-links">
          <button
            type="button"
            class="nav-item nav-item--button"
            :class="{ 'router-link-exact-active': storeActiveTab === 'dashboard' }"
            @click="storeActiveTab = 'dashboard'"
          >
            🌤️ 날씨 대시보드
          </button>
          <span class="divider">|</span>
          <button
            type="button"
            class="nav-item nav-item--button"
            :class="{ 'router-link-exact-active': storeActiveTab === 'about' }"
            @click="storeActiveTab = 'about'"
          >
            ℹ️ 서비스 소개
          </button>
        </div>
        <UnitToggler />
      </nav>

      <WeatherHomeView v-if="storeActiveTab === 'dashboard'" standalone />
      <WeatherAboutView v-else standalone @go-home="storeActiveTab = 'dashboard'" />

      <h2>⚡ 과제 6: Axios 활용 (UI Library 적용 전)</h2>
      <hr />

      <WeatherAxiosView />
    </section>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 900px;
  margin: 40px auto 64px;
  padding: 32px 40px 48px;
  background-color: var(--surface);
  border-radius: var(--radius-lg);
  border-top: 4px solid var(--brand-600);
  box-shadow: var(--shadow-lg);
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;
  color: var(--ink-900);
}

/* 상용 웹처럼 보이도록 추가한 최상단 브랜드 헤더 */
.app-masthead {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 20px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--surface-border);
}

.app-badge {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: var(--brand-50);
  border-radius: var(--radius-md);
}

.app-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--ink-900);
  letter-spacing: -0.01em;
}

.app-subtitle {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  color: var(--ink-500);
}

.app-container h1 {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--ink-900);
  margin-top: 20px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
}

/* 지난 과제 보관함 안의 과제 2~6 소제목 — 메인 h1보다 한 단계 작게 */
.app-container h2 {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--ink-900);
  margin-top: 36px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
}

.app-container hr {
  border: none;
  border-top: 1px solid var(--surface-border);
  margin: 10px 0 24px 0;
}

.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-muted);
  padding: 8px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--surface-border);
  margin-bottom: 22px;
}

/* 메인/보관함 전환 탭은 브랜드 헤더 바로 아래에 위치 */
.top-tabs {
  margin-top: 20px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.nav-item {
  text-decoration: none;
  color: var(--ink-500);
  font-weight: 600;
  font-size: 14px;
  padding: 9px 18px;
  border-radius: var(--radius-pill);
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.nav-item:hover {
  color: var(--ink-900);
  background: rgba(15, 23, 42, 0.05);
}

/* 탭 전환용 버튼을 RouterLink(.nav-item)와 똑같이 보이도록 기본 버튼 스타일 초기화 */
.nav-item--button {
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
}

.divider {
  display: none;
}

/* 활성화된 링크/탭 버튼에 공통으로 부여되는 클래스 */
.navigation-bar .router-link-exact-active {
  color: #ffffff;
  background: var(--brand-600);
  padding: 9px 18px;
}

.navigation-bar .router-link-exact-active:hover {
  color: #ffffff;
  background: var(--brand-700);
}
</style>
