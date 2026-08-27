<script setup>
// [본인 추가 Mockup] 폭염 경고 기준 온도 설정 컴포넌트("기준 날씨").
// alertThreshold(기준 온도)와 hotAlertCities(기준 초과 도시 목록)는
// 모두 부모(WeatherParent)의 반응형 데이터이므로, 여기서는 props로 받아
// "보여주기"만 하고, 값이 바뀌면 update-threshold 이벤트로 부모에게 알립니다.
defineProps({
  threshold: {
    type: Number,
    required: true,
  },
  hotCities: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update-threshold'])

const onInput = (event) => {
  emit('update-threshold', Number(event.target.value))
}
</script>

<template>
  <div>
    <label class="threshold-label">
      경고 기준 온도(°C)
      <input type="number" :value="threshold" @input="onInput" />
    </label>

    <div v-if="hotCities.length > 0" class="alert-list">
      <p class="alert-headline">🔥 {{ threshold }}°C를 초과하는 폭염 주의 도시</p>
      <ul>
        <li v-for="item in hotCities" :key="item.id" class="alert-chip">
          {{ item.name }} <span class="alert-chip-temp">{{ item.temp }}°C</span>
        </li>
      </ul>
    </div>
    <p v-else class="alert-empty">현재 기준 온도를 초과하는 도시가 없습니다.</p>
  </div>
</template>

<style scoped>
/* exercise.css의 전역 input 규칙과 동일 (기준 온도 입력창도 같은 모양이어야 함) */
input {
  padding: 10px 14px;
  width: 90%;
  font-size: 14px;
  border: 1px solid var(--surface-border, #dee2e6);
  border-radius: var(--radius-sm, 8px);
  background: var(--surface, #fff);
  color: var(--ink-900, #2c3e50);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input:focus {
  outline: none;
  border-color: var(--brand-500, #6366f1);
  box-shadow: 0 0 0 3px var(--brand-50, rgba(99, 102, 241, 0.15));
}

.threshold-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-700, #334155);
  margin-bottom: 8px;
}

.alert-list {
  margin-top: 14px;
}

.alert-headline {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--danger-500, #e74c3c);
}

.alert-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.alert-chip {
  background: var(--danger-50, #fdecea);
  color: var(--danger-500, #c0392b);
  padding: 6px 12px;
  border-radius: var(--radius-pill, 999px);
  font-size: 13px;
  font-weight: 600;
}

.alert-chip-temp {
  font-weight: 700;
}

.alert-empty {
  margin-top: 14px;
  font-size: 13px;
  color: var(--ink-500, #7f8c8d);
}
</style>
