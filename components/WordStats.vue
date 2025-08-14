<template>
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-white rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-blue-600">{{ totalCount }}</div>
      <div class="text-sm text-gray-600">総単語数</div>
    </div>
    <div class="bg-white rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-green-600">{{ memorizedCount }}</div>
      <div class="text-sm text-gray-600">習得済み</div>
    </div>
    <div class="bg-white rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-orange-600">{{ studyingCount }}</div>
      <div class="text-sm text-gray-600">学習中</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalCount: number;
  memorizedCount: number;
  studyingCount: number;
}

defineProps<Props>();
</script>
