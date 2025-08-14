// composables/useWordFilters.ts
import { ref, computed, type Ref } from "vue";
import type { Word } from "~/types/word";

export function useWordFilters(words: Ref<Word[]>) {
  const searchQuery = ref("");
  const filterStatus = ref<"all" | "studying" | "memorized">("all");

  const filteredWords = computed(() => {
    let filtered = words.value;

    // 検索フィルター
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (word) =>
          word.text.toLowerCase().includes(query) ||
          word.meaning.toLowerCase().includes(query)
      );
    }

    // ステータスフィルター
    if (filterStatus.value === "studying") {
      filtered = filtered.filter((word) => !word.memorized);
    } else if (filterStatus.value === "memorized") {
      filtered = filtered.filter((word) => word.memorized);
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
    filteredWords,
    clearFilters,
  };
}
