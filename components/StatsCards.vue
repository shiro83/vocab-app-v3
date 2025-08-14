<template>
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-white rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-blue-600">{{ total }}</div>
      <div class="text-sm text-gray-600">総単語数</div>
    </div>
    <div class="bg-white rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-green-600">{{ memorized }}</div>
      <div class="text-sm text-gray-600">習得済み</div>
    </div>
    <div class="bg-white rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-orange-600">{{ studying }}</div>
      <div class="text-sm text-gray-600">学習中</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  total: number;
  memorized: number;
  studying: number;
}>();
</script>