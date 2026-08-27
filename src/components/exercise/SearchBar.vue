<script setup>
// 부모(WeatherParent)가 들고 있는 searchQuery 반응형 데이터를
// props로 전달받아 "보여주기"만 하고,
// 사용자가 타이핑하면 update-query 이벤트로 부모에게 새 검색어를 알립니다.
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

const onInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div>
    <input type="text" :value="searchQuery" @input="onInput" placeholder="검색할 도시 이름 입력" />
    <p class="search-status">
      검색 중인 도시: <strong>{{ searchQuery || '전체' }}</strong>
    </p>
  </div>
</template>

<style scoped>
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

input::placeholder {
  color: var(--ink-400, #9aa1a9);
}

input:focus {
  outline: none;
  border-color: var(--brand-500, #6366f1);
  box-shadow: 0 0 0 3px var(--brand-50, rgba(99, 102, 241, 0.15));
}

.search-status {
  margin-top: 10px;
  font-size: 13px;
  color: var(--ink-500, #7f8c8d);
}

.search-status strong {
  color: var(--brand-600, #4f46e5);
}
</style>
