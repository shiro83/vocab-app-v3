<!-- ~/components/WordList.vue -->
<template>
  <div v-if="displayedCount > 0" class="space-y-6">
    <!-- ヘッダー -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-700">
        📋 登録済み単語 ({{ displayedCount }}件表示 / 全{{ totalWords }}件)
      </h2>
      <button
        @click="$emit('toggle-bulk-actions')"
        class="text-sm text-blue-600 hover:text-blue-800 transition"
      >
        一括操作
      </button>
    </div>

    <!-- 一括操作 -->
    <BulkActions
      v-if="showBulkActions"
      :selected-count="selectedWords.length"
      @bulk-mark-memorized="$emit('bulk-mark-memorized')"
      @bulk-delete="$emit('bulk-delete')"
    />

    <!-- 単語リスト -->
    <ul class="space-y-4">
      <WordListItem
        v-for="word in words"
        :key="word.id"
        :word="word"
        :show-checkbox="showBulkActions"
        :is-selected="selectedWords.includes(word.id)"
        @toggle-selection="handleToggleSelection"
        @toggle-memorized="$emit('toggle-memorized', word)"
        @confirm-delete="$emit('confirm-delete', word)"
      />
    </ul>

    <!-- ページネーション -->
    <Pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update-page="$emit('update-page', $event)"
    />
  </div>

  <!-- 空の状態 -->
  <EmptyState
    v-else-if="totalWords === 0"
    icon="😴"
    title="まだ単語が登録されていません"
    description="上のフォームから最初の単語を追加してみましょう！"
  />

  <!-- 検索結果なし -->
  <EmptyState
    v-else
    icon="🔍"
    title="検索条件に一致する単語が見つかりません"
    :show-clear-button="true"
    @clear-filters="$emit('clear-filters')"
  />
</template>

<script setup lang="ts">
import type { Word } from "~/composables/useWordFiltering";
import BulkActions from "~/components/BulkActions.vue";
import WordListItem from "~/components/WordListItem.vue";
import Pagination from "~/components/Pagination.vue";
import EmptyState from "~/components/EmptyState.vue";

interface Props {
  words: Word[];
  totalWords: number;
  displayedCount: number;
  showBulkActions: boolean;
  selectedWords: string[];
  currentPage: number;
  totalPages: number;
}

defineProps<Props>();

const emit = defineEmits<{
  "toggle-bulk-actions": [];
  "update-selection": [selectedWords: string[]];
  "update-page": [page: number];
  "toggle-memorized": [word: Word];
  "confirm-delete": [word: Word];
  "bulk-mark-memorized": [];
  "bulk-delete": [];
  "clear-filters": [];
}>();

const handleToggleSelection = (wordId: string, isSelected: boolean) => {
  const currentSelection = [...props.selectedWords];

  if (isSelected) {
    if (!currentSelection.includes(wordId)) {
      currentSelection.push(wordId);
    }
  } else {
    const index = currentSelection.indexOf(wordId);
    if (index > -1) {
      currentSelection.splice(index, 1);
    }
  }

  emit("update-selection", currentSelection);
};
</script>
