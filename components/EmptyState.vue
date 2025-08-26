<!-- ~/components/EmptyState.vue -->
<template>
  <div class="text-center text-gray-500 mt-10">
    <div class="text-6xl mb-4">{{ icon }}</div>
    <p class="text-lg font-medium">{{ title }}</p>
    <p v-if="description" class="text-sm mt-2 text-gray-400">
      {{ description }}
    </p>
    <button
      v-if="showClearButton"
      @click="$emit('clear-filters')"
      class="mt-4 text-blue-600 hover:text-blue-800 underline transition"
    >
      フィルターをクリア
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  description?: string;
  showClearButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  description: "",
  showClearButton: false,
});

defineEmits<{
  "clear-filters": [];
}>();
</script>
