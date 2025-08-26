// ~/composables/useWordOperations.ts
import { ref, type Ref } from "vue";
import type { Word } from "./useWordFiltering";

interface WordOperationsConfig {
  markMemorized: (wordId: string) => Promise<void>;
  deleteWord: (wordId: string) => Promise<void>;
  loadWords: () => Promise<void>;
  selectedWords: Ref<string[]>;
}

export function useWordOperations({
  markMemorized,
  deleteWord,
  loadWords,
  selectedWords,
}: WordOperationsConfig) {
  const showBulkActions = ref(false);
  const wordToDelete = ref<Word | null>(null);

  const handleToggleMemorized = async (word: Word) => {
    try {
      await markMemorized(word.id);
      await loadWords();
    } catch (error) {
      console.error("Error marking word:", error);
      alert("更新に失敗しました");
    }
  };

  const handleConfirmDelete = (word: Word) => {
    wordToDelete.value = word;
  };

  const handleExecuteDelete = async () => {
    if (wordToDelete.value) {
      try {
        await deleteWord(wordToDelete.value.id);
        await loadWords();
        wordToDelete.value = null;
      } catch (error) {
        console.error("Error deleting word:", error);
        alert("削除に失敗しました");
      }
    }
  };

  const handleBulkMarkMemorized = async () => {
    if (selectedWords.value.length === 0) {
      alert("操作する単語を選択してください");
      return;
    }

    try {
      const promises = selectedWords.value.map((wordId) =>
        markMemorized(wordId)
      );
      await Promise.all(promises);
      selectedWords.value = [];
      await loadWords();
    } catch (error) {
      console.error("Error in bulk operation:", error);
      alert("一括操作に失敗しました");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedWords.value.length === 0) {
      alert("削除する単語を選択してください");
      return;
    }

    const confirmMessage = `選択した${selectedWords.value.length}個の単語を削除しますか？`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const promises = selectedWords.value.map((wordId) => deleteWord(wordId));
      await Promise.all(promises);
      selectedWords.value = [];
      await loadWords();
    } catch (error) {
      console.error("Error in bulk delete:", error);
      alert("一括削除に失敗しました");
    }
  };

  return {
    showBulkActions,
    wordToDelete,
    handleToggleMemorized,
    handleConfirmDelete,
    handleExecuteDelete,
    handleBulkMarkMemorized,
    handleBulkDelete,
  };
}
