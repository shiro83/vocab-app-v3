<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
    <!-- ヘッダー -->
    <WordHeader :word-count="words.length" />

    <main class="max-w-2xl mx-auto p-6">
      <!-- 統計情報 -->
      <WordStats
        :total-count="words.length"
        :memorized-count="statistics.memorizedCount"
        :studying-count="statistics.studyingCount"
      />

      <!-- 学習モード -->
      <StudyModeSection
        :studying-words-count="statistics.studyingCount"
        @start-study="handleStartStudy"
      />

      <!-- データ管理 -->
      <DataManagement @words-imported="handleWordsImported" />

      <!-- 検索・フィルター -->
      <SearchAndFilter
        v-model:search-query="searchQuery"
        v-model:filter-status="filterStatus"
      />

      <!-- デバッグ情報（一時的）
      <div
        class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-sm"
      >
        <p><strong>Debug Info:</strong></p>
        <p>Total words: {{ words.length }}</p>
        <p>Display words: {{ displayWords.length }}</p>
        <p>Paginated words: {{ paginatedWords.length }}</p>
        <p>Current page: {{ currentPage }}</p>
        <p>Total pages: {{ totalPages }}</p>
        <p>Search query: "{{ searchQuery }}"</p>
        <p>Filter status: {{ filterStatus }}</p>
      </div> -->

      <!-- 単語リスト -->
      <WordList
        :words="paginatedWords"
        :total-words="words.length"
        :displayed-count="displayWords.length"
        :show-bulk-actions="showBulkActions"
        :selected-words="selectedWords"
        :current-page="currentPage"
        :total-pages="totalPages"
        @toggle-bulk-actions="showBulkActions = !showBulkActions"
        @update-selection="handleUpdateSelection"
        @update-page="currentPage = $event"
        @toggle-memorized="handleToggleMemorized"
        @confirm-delete="handleConfirmDelete"
        @bulk-mark-memorized="handleBulkMarkMemorized"
        @bulk-delete="handleBulkDelete"
        @clear-filters="handleClearFilters"
      />

      <!-- 単語追加フォーム -->
      <WordForm :existing-words="words" @add-word="handleAddWord" />
    </main>

    <!-- 削除確認モーダル -->
    <DeleteModal
      :word-to-delete="wordToDelete"
      @confirm-delete="handleExecuteDelete"
      @cancel="wordToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import WordHeader from "~/components/WordHeader.vue";
import WordStats from "~/components/WordStats.vue";
import WordForm from "~/components/WordForm.vue";
import DeleteModal from "~/components/DeleteModal.vue";
import StudyModeSection from "~/components/StudyModeSection.vue";
import DataManagement from "~/components/DataManagement.vue";
import SearchAndFilter from "~/components/SearchAndFilter.vue";
import WordList from "~/components/WordList.vue";

import { useWords } from "~/composables/useWords";
import { useAuth } from "~/composables/useAuth";
import { useWordFiltering } from "~/composables/useWordFiltering";
import { usePagination } from "~/composables/usePagination";
import { useWordOperations } from "~/composables/useWordOperations";

const { words, loadWords, addWord, deleteWord, markMemorized } = useWords();
const { user } = useAuth();

// フィルタリングとページネーション
const {
  searchQuery,
  filterStatus,
  displayWords,
  clearFilters: handleClearFilters,
} = useWordFiltering(words);

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedWords,
  resetPage,
} = usePagination(displayWords, 10);

// 検索・フィルター変更時にページリセット
watch([searchQuery, filterStatus], () => {
  resetPage();
});

// 選択された単語のstate
const selectedWords = ref<string[]>([]);

// 単語操作
const {
  showBulkActions,
  wordToDelete,
  handleToggleMemorized,
  handleConfirmDelete,
  handleExecuteDelete,
  handleBulkMarkMemorized,
  handleBulkDelete,
} = useWordOperations({
  markMemorized,
  deleteWord,
  loadWords,
  selectedWords,
});

// 統計情報
const statistics = computed(() => ({
  memorizedCount: words.value.filter((word) => word.memorized).length,
  studyingCount: words.value.filter((word) => !word.memorized).length,
}));

// イベントハンドラー
const handleAddWord = async (text: string, meaning: string) => {
  console.log("handleAddWord called:", { text, meaning });
  try {
    await addWord(text, meaning);
    await loadWords();
    console.log("Word added successfully");
  } catch (error) {
    console.error("Error adding word:", error);
    alert("単語の追加に失敗しました");
  }
};

const handleUpdateSelection = (newSelection: string[]) => {
  selectedWords.value = newSelection;
};

const handleWordsImported = async (importedWords: any[]) => {
  console.log("インポート開始:", importedWords);

  try {
    let successCount = 0;
    let errorCount = 0;
    const existingTexts = words.value.map((w) => w.text.toLowerCase());

    for (const word of importedWords) {
      try {
        if (existingTexts.includes(word.text.toLowerCase())) {
          console.log(`重複スキップ: ${word.text}`);
          continue;
        }

        console.log(`単語追加中: ${word.text} - ${word.meaning}`);
        await addWord(word.text, word.meaning);
        successCount++;
        existingTexts.push(word.text.toLowerCase());
      } catch (error) {
        console.error(`単語「${word.text}」の追加に失敗:`, error);
        errorCount++;
      }
    }

    await loadWords();

    if (errorCount === 0) {
      console.log(`成功: ${successCount}個の単語をインポート`);
      alert(`${successCount}個の単語をインポートしました！`);
    } else {
      alert(
        `${successCount}個の単語をインポートしました。${errorCount}個の単語でエラーが発生しました。`
      );
    }
  } catch (error) {
    console.error("インポート処理でエラーが発生:", error);
    alert("インポート処理でエラーが発生しました: " + error.message);
  }
};

const handleStartStudy = (mode: "flashcard") => {
  const wordsToStudy = words.value.filter((word) => !word.memorized);

  if (wordsToStudy.length === 0) {
    alert("学習する単語がありません");
    return;
  }

  navigateTo("/study/flashcard");
};

// 初期化
onMounted(async () => {
  console.log("Component mounted, user:", user.value);
  if (user.value) {
    await loadWords();
    console.log("Words loaded:", words.value);
  }
});

watch(user, async (newUser) => {
  console.log("User changed:", newUser);
  if (newUser) {
    await loadWords();
    console.log("Words loaded after user change:", words.value);
  } else {
    words.value = [];
  }
});
</script>
