<!-- ~/components/DataManagement.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">📂 データ管理</h2>
    <div class="flex gap-4">
      <CSVImport @words-imported="$emit('words-imported', $event)" />
      <!-- 他のデータ管理機能（エクスポート、バックアップなど）を追加可能 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import CSVImport from "~/components/CSVImport.vue";

defineEmits<{
  "words-imported": [words: any[]];
}>();
</script>
