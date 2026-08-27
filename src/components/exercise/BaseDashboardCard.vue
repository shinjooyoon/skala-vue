<script setup>
// 검색박스와 리스트박스가 공통으로 사용하는 카드 껍데기입니다.
// 제목만 prop으로 받고, 실제 내용(검색창 / 날씨 카드 목록)은
// 부모(WeatherParent)가 <slot>을 통해 주입합니다.
// exercise.css의 ".search-box, .list-box" 공통 규칙을 하나의 클래스로 통합했습니다.
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="dashboard-card">
    <h3>{{ title }}</h3>
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  background: var(--surface, #f8f9fa);
  padding: 20px;
  border-radius: var(--radius-md, 12px);
  margin-bottom: 16px;
  border: 1px solid var(--surface-border, #e9ecef);
  box-shadow: var(--shadow-sm, none);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.dashboard-card:hover {
  box-shadow: var(--shadow-md, none);
  border-color: var(--brand-100, #e9ecef);
}

.dashboard-card h3 {
  margin: 0 0 14px 0;
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--ink-900, #2c3e50);
  letter-spacing: -0.01em;
}
</style>
