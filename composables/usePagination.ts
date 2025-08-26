// ~/composables/usePagination.ts
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

  // アイテム数が変更された時にページをリセット
  watch(
    () => items.value.length,
    () => {
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = 1;
      }
    }
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const resetPage = () => {
    currentPage.value = 1;
  };

  return {
    currentPage,
    totalPages,
    paginatedItems: paginatedItems as Ref<T[]>,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
  };
}
