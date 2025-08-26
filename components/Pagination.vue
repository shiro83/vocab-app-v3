<!-- ~/components/Pagination.vue -->
<template>
  <div class="flex justify-center items-center space-x-2 mt-6">
    <!-- 前のページボタン -->
    <button
      @click="$emit('update-page', currentPage - 1)"
      :disabled="currentPage <= 1"
      :class="[
        'px-3 py-2 rounded-lg text-sm transition flex items-center',
        currentPage <= 1
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
    >
      <span class="mr-1">←</span>
      前へ
    </button>

    <!-- ページ番号 -->
    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="typeof page === 'number'"
        @click="$emit('update-page', page)"
        :class="[
          'px-3 py-2 rounded-lg text-sm transition min-w-[2.5rem]',
          currentPage === page
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        {{ page }}
      </button>
      <span
        v-else
        class="px-2 py-2 text-gray-500 text-sm"
      >
        {{ page }}
      </span>
    </template>

    <!-- 次のページボタン -->
    <button
      @click="$emit('update-page', currentPage + 1)"
      :disabled="currentPage >= totalPages"
      :class="[
        'px-3 py-2 rounded-lg text-sm transition flex items-center',
        currentPage >= totalPages
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
    >
      次へ
      <span class="ml-1">→</span>
    </button>
  </div>

  <!-- ページ情報 -->
  <div class="text-center text-sm text-gray-500 mt-2">
    {{ currentPage }} / {{ totalPages }} ページ
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  currentPage: number;
  totalPages: number;
}

const props = defineProps<Props>();

defineEmits<{
  'update-page': [page: number];
}>();

// 表示するページ番号を計算
const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 7) {
    // 7ページ以下の場合はすべて表示
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 7ページを超える場合は省略表示
    if (current <= 4) {
      // 現在のページが前半の場合
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      // 現在のページが後半の場合
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // 現在のページが中間の場合
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
});
</script>s