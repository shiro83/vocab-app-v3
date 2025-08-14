// composables/usePagination.ts
import { ref, computed, watch, type Ref } from "vue";

export function usePagination<T>(items: Ref<T[]>, itemsPerPage: number = 10) {
  const currentPage = ref(1);

  const totalPages = computed(() =>
    Math.ceil(items.value.length / itemsPerPage)
  );

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.value.slice(start, end);
  });

  // アイテムが変更されたときに現在のページを調整
  watch(items, () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    }
  });

  // ページを最初にリセットする関数
  const resetPage = () => {
    currentPage.value = 1;
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    resetPage,
  };
}
