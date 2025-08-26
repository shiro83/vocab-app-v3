<!-- ~/components/BulkActions.vue -->
<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <div class="flex flex-wrap gap-2 items-center">
      <span class="text-sm text-gray-600 mr-4">
        {{ selectedCount }}個の単語を選択中
      </span>

      <button
        @click="$emit('bulk-mark-memorized')"
        :disabled="selectedCount === 0"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          selectedCount === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md',
        ]"
      >
        ✅ 習得済みにする
      </button>

      <button
        @click="$emit('bulk-delete')"
        :disabled="selectedCount === 0"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          selectedCount === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md',
        ]"
      >
        🗑️ 削除する
      </button>
    </div>

    <div v-if="selectedCount === 0" class="mt-2 text-xs text-gray-500">
      💡 チェックボックスを選択して一括操作を実行できます
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedCount: number;
}

defineProps<Props>();

defineEmits<{
  "bulk-mark-memorized": [];
  "bulk-delete": [];
}>();
</script>
