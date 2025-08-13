// composables/useWordsPage.ts - 修正版
import { ref, computed, watch } from 'vue';
import { useWords } from './useWords';
import { useAuth } from './useAuth';
import { useWordFilters } from './useWordFilters';
import { usePagination } from './usePagination';
import type { Word } from '~/types/word';

export function useWordsPage() {
  const { words, loadWords, addWord, deleteWord, markMemorized } = useWords();
  const { user } = useAuth();
  
  // UI状態
  const isLoading = ref(false);
  const wordToDelete = ref<Word | null>(null);
  
  // フィルタリング機能
  const {
    searchQuery,
    filterStatus,
    filteredWords,
    clearFilters
  } = useWordFilters(words);
  
  // ページネーション機能
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedWords,
    resetPage
  } = usePagination(filteredWords, 10);
  
  // 統計計算
  const memorizedCount = computed(() => 
    words.value.filter(word => word.memorized).length
  );
  
  const studyingCount = computed(() => 
    words.value.filter(word => !word.memorized).length
  );
  
  // ユーザー変更時の処理
  watch(user, (newUser) => {
    if (newUser) {
      loadWords();
    } else {
      words.value = [];
    }
  });

  // フィルター変更時にページをリセット
  watch([searchQuery, filterStatus], () => {
    resetPage();
  });
  
  // イベントハンドラー
  const handleAddWord = async (text: string, meaning: string) => {
    isLoading.value = true;
    try {
      await addWord(text, meaning);
      await loadWords();
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleMarkMemorized = async (id: string) => {
    await markMemorized(id);
    await loadWords();
  };
  
  const handleDeleteWord = (word: Word) => {
    wordToDelete.value = word;
  };
  
  const executeDelete = async () => {
    if (wordToDelete.value) {
      await deleteWord(wordToDelete.value.id);
      await loadWords();
      wordToDelete.value = null;
    }
  };
  
  const handleBulkAction = async (action: string, wordIds: string[]) => {
    if (action === 'memorized') {
      for (const id of wordIds) {
        await markMemorized(id);
      }
    } else if (action === 'delete') {
      if (confirm(`選択した${wordIds.length}個の単語を削除しますか？`)) {
        for (const id of wordIds) {
          await deleteWord(id);
        }
      }
    }
    await loadWords();
  };
  
  return {
    // データ
    words,
    memorizedCount,
    studyingCount,
    filteredWords,
    paginatedWords,
    
    // UI状態
    isLoading,
    searchQuery,
    filterStatus,
    currentPage,
    totalPages,
    wordToDelete,
    
    // メソッド
    handleAddWord,
    handleMarkMemorized,
    handleDeleteWord,
    handleBulkAction,
    executeDelete,
    clearFilters
  };
}