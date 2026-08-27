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
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}
</style>
