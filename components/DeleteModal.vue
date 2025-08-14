<template>
  <div
    v-if="wordToDelete"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">削除確認</h3>
      <p class="text-gray-600 mb-6">
        「{{ wordToDelete.text }}」を削除しますか？<br />
        この操作は取り消せません。
      </p>
      <div class="flex space-x-4">
        <button
          @click="handleConfirmDelete"
          class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          削除
        </button>
        <button
          @click="handleCancel"
          class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          キャンセル
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Word {
  id: string;
  text: string;
  meaning: string;
  memorized: boolean;
}

interface Props {
  wordToDelete: Word | null;
}

interface Emits {
  (e: 'confirm-delete'): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleConfirmDelete = () => {
  emit('confirm-delete');
};

const handleCancel = () => {
  emit('cancel');
};
</script>