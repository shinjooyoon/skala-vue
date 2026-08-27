<script setup>
//  Catch-all Route가 연결하는 404 페이지
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <section class="not-found-box">
    <p class="not-found-emoji">🌻❓</p>
    <h3>페이지를 찾을 수 없습니다.</h3>
    <p class="not-found-desc">
      요청하신 주소가 존재하지 않거나,<br />
      아직 개발되지 않았습니다.
    </p>
    <button class="btn-home" @click="goHome">날씨 메인으로 이동</button>
  </section>
</template>

<style scoped>
.not-found-box {
  width: 100%;
  max-width: 400px;
  margin: 60px auto;
  text-align: center;
  background: var(--surface, #fff);
  padding: 32px;
  border-radius: var(--radius-lg, 16px);
  box-shadow: var(--shadow-md, 0 4px 20px rgba(0, 0, 0, 0.08));
  border: 1px solid var(--surface-border, transparent);
}

.not-found-emoji {
  font-size: 48px;
  margin-bottom: 8px;
}

.not-found-box h3 {
  color: var(--ink-900, #2c3e50);
}

.not-found-desc {
  color: var(--ink-500, #64748b);
  margin-top: 6px;
}

.btn-home {
  margin-top: 22px;
  padding: 11px 22px;
  border: none;
  border-radius: var(--radius-pill, 999px);
  background: var(--brand-600, #1a252f);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-home:hover {
  background: var(--brand-700, #0f172a);
}
</style>
