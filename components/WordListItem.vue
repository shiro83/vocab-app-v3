<!-- ~/components/WordListItem.vue -->
<template>
  <li
    :class="[
      'bg-white rounded-xl shadow-md p-4 flex justify-between items-center transition-all hover:shadow-lg',
      word.memorized ? 'bg-green-50 border-l-4 border-green-500' : '',
    ]"
  >
    <div class="flex items-center space-x-3 flex-1">
      <input
        v-if="showCheckbox"
        type="checkbox"
        :checked="isSelected"
        @change="handleToggleSelection"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      <div class="flex-1">
        <p class="text-gray-800 font-medium text-base">
          {{ word.text }}
          <span v-if="word.memorized" class="text-green-600 ml-2">✓</span>
        </p>
        <p class="text-gray-500 text-sm">{{ word.meaning }}</p>
        <p v-if="word.createdAt" class="text-gray-400 text-xs mt-1">
          {{ formatDate(word.createdAt) }}
        </p>
      </div>
    </div>

    <div class="flex space-x-2">
      <ActionButton
        @click="$emit('toggle-memorized')"
        :type="word.memorized ? 'studying' : 'memorized'"
        :title="word.memorized ? '学習中に戻す' : '覚えた'"
      >
        {{ word.memorized ? "↩️" : "✅" }}
      </ActionButton>

      <ActionButton @click="$emit('confirm-delete')" type="delete" title="削除">
        🗑
      </ActionButton>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Word } from "~/composables/useWordFiltering";
import ActionButton from "~/components/ActionButton.vue";

interface Props {
  word: Word;
  showCheckbox: boolean;
  isSelected: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "toggle-selection": [wordId: string, isSelected: boolean];
  "toggle-memorized": [];
  "confirm-delete": [];
}>();

const handleToggleSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("toggle-selection", props.word.id, target.checked);
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("ja-JP");
};
</script>
