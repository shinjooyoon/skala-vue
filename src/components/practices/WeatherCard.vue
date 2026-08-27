<script setup>
// 선택된 도시 객체(city)를 props로 전달받아 표시만 담당합니다.
// 카드를 클릭하면 select-card, 상세보기 버튼을 클릭하면 click-detail
// 이벤트를 부모(WeatherParent)에게 emit하여 실제 처리는 부모가 맡습니다.
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const onSelectCard = () => {
  emit('select-card', props.city)
}

const onClickDetail = () => {
  emit('click-detail', props.city)
}
</script>

<template>
  <div class="weather-card" @click="onSelectCard">
    <h4>{{ city.name }} ({{ city.status }})</h4>
    <p>현재 기온: {{ city.temp }}°C</p>

    <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

    <button class="btn-detail" @click.stop="onClickDetail">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
}

.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
