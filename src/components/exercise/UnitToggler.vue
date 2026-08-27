<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</span>
    <button @click="configStore.toggleUnit" class="toggle-btn">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.unit-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-700, #334155);
  background: var(--surface, #fff);
  border: 1px solid var(--surface-border, #e2e8f0);
  padding: 6px 12px;
  border-radius: var(--radius-pill, 999px);
}

.toggle-btn {
  padding: 8px 14px;
  background-color: var(--brand-600, #4b6584);
  color: white;
  border: none;
  border-radius: var(--radius-pill, 999px);
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  transition: background-color 0.2s ease;
}

.toggle-btn:hover {
  background-color: var(--brand-700, #3d5166);
}
</style>
