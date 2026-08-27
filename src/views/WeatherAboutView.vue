<script setup>
// 서비스 소개용 정적 페이지 ('/about', 그리고 [복구] '/axios/about', '/library/about')
import { useRouter } from 'vue-router'

const props = defineProps({
  // true면 과제5 섹션처럼 실제 Vue Router와 분리된 "독립 모드"로 동작합니다.
  standalone: {
    type: Boolean,
    default: false,
  },
  // [복구] 라우터 모드에서 "대시보드 홈으로 이동" 버튼이 돌아갈 경로.
  // 과제 6·7에서는 '/axios', '/library'로 각자 다르게 지정합니다.
  homePath: {
    type: String,
    default: '/',
  },
})

const emit = defineEmits(['go-home'])

const router = useRouter()
const goHome = () => {
  if (props.standalone) {
    emit('go-home')
    return
  }
  router.push(props.homePath)
}
</script>

<template>
  <section class="about-box">
    <h3>ℹ️ 서비스 소개</h3>
    <hr />
    <p>실시간 기상 데이터를 기반으로, 관심 있는 도시의 날씨를 한눈에 확인할 수 있는 날씨 대시보드입니다.</p>
    <ul>
      <li>🏙️ 국내 8개 도시의 실시간 기온·습도·풍속·미세먼지 확인</li>
      <li>⭐ 자주 보는 도시를 즐겨찾기에 등록해서 따로 모아보기</li>
      <li>⚠️ 폭염 경고 기준 온도를 직접 설정해서 더운 날 미리 확인하기</li>
      <li>🌡️ 섭씨 · 화씨 온도 단위 전환</li>
      <li>🌍 해외 도시 날씨 검색과 여행 준비물 안내</li>
    </ul>
    <button class="btn-home" @click="goHome">대시보드 홈으로 이동</button>
  </section>
</template>

<style scoped>
.about-box {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background: var(--surface-muted, #f8f9fa);
  padding: 22px 24px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--surface-border, #e9ecef);
}

.about-box h3 {
  font-size: 1rem;
  color: var(--ink-900, #2c3e50);
}

.about-box hr {
  border: none;
  border-top: 1px solid var(--surface-border, #e9ecef);
  margin: 14px 0;
}

.about-box p {
  color: var(--ink-700, #334155);
}

.about-box ul {
  margin: 14px 0;
  padding-left: 20px;
  line-height: 1.9;
  color: var(--ink-700, #334155);
}

.btn-home {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: var(--brand-600, #3498db);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-home:hover {
  background: var(--brand-700, #2c80c2);
}
</style>
