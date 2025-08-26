// ~/composables/useWordFiltering.ts
import { ref, computed, type Ref } from "vue";

export interface Word {
  id: string;
  text: string;
  meaning: string;
  memorized: boolean;
  createdAt?: string | Date;
}

export function useWordFiltering(words: Ref<Word[]>) {
  const searchQuery = ref("");
  const filterStatus = ref<"all" | "studying" | "memorized">("all");

  const displayWords = computed(() => {
    let filtered = words.value;

    // 検索フィルター
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim();
      filtered = filtered.filter(
        (word) =>
          word.text.toLowerCase().includes(query) ||
          word.meaning.toLowerCase().includes(query)
      );
    }

    // ステータスフィルター
    switch (filterStatus.value) {
      case "studying":
        filtered = filtered.filter((word) => !word.memorized);
        break;
      case "memorized":
        filtered = filtered.filter((word) => word.memorized);
        break;
      // "all" の場合は何もしない
    }

    return filtered;
  });

  const clearFilters = () => {
    searchQuery.value = "";
    filterStatus.value = "all";
  };

  return {
    searchQuery,
    filterStatus,
    displayWords,
    clearFilters,
  };
}
