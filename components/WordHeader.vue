
<!-- components/WordHeader.vue -->
<template>
  <header class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 shadow">
    <div class="max-w-2xl mx-auto px-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold">📘 単語暗記帳</h1>
      <div class="text-sm">📊 {{ wordCount }}語登録済み</div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  wordCount: number;
}

defineProps<Props>();
</script>