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
    <p>
      검색 중인 도시: <strong>{{ searchQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
input {
  padding: 8px;
  width: 90%;
  font-size: 14px;
}
</style>
