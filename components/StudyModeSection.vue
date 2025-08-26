<!-- ~/components/StudyModeSection.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">📚 学習モード</h2>
    <div class="flex justify-center">
      <button
        @click="$emit('start-study', 'flashcard')"
        :disabled="studyingWordsCount === 0"
        :class="buttonClasses"
      >
        <span class="text-2xl">🃏</span>
        <div class="text-left">
          <div class="font-semibold">フラッシュカード</div>
          <div class="text-xs opacity-90">{{ studyingWordsCount }}個の単語</div>
        </div>
      </button>
    </div>

    <div
      v-if="studyingWordsCount === 0"
      class="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg"
    >
      💡
      学習中の単語がありません。単語を「学習中に戻す」ボタンで戻してから学習を始めましょう。
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  studyingWordsCount: number;
}

const props = defineProps<Props>();

defineEmits<{
  "start-study": [mode: "flashcard"];
}>();

const buttonClasses = computed(() => [
  "flex items-center justify-center space-x-3 py-4 px-8 rounded-xl transition text-base font-medium min-w-64",
  props.studyingWordsCount === 0
    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1",
]);
</script>
