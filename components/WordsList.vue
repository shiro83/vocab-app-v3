<!-- components/WordsList.vue -->
<template>
  <div v-if="words.length" class="space-y-6">
    <WordsListHeader 
      :count="words.length"
      @toggle-bulk="showBulkActions = !showBulkActions"
    />
    
    <BulkActions
      v-if="showBulkActions"
      v-model:selected="selectedWords"
      @bulk-memorized="$emit('bulk-action', 'memorized', selectedWords)"
      @bulk-delete="$emit('bulk-action', 'delete', selectedWords)"
    />
    
    <ul class="space-y-4">
      <WordItem
        v-for="word in words"
        :key="word.id"
        :word="word"
        :show-checkbox="showBulkActions"
        v-model:selected="selectedWords"
        @mark-memorized="$emit('mark-memorized', word.id)"
        @delete="$emit('delete-word', word)"
      />
    </ul>
    
    <Pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:current-page="$emit('update:current-page', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Word } from '~/types/word';

defineProps<{
  words: Word[];
  totalPages: number;
  currentPage: number;
}>();

defineEmits<{
  'update:current-page': [page: number];
  'mark-memorized': [id: string];
  'delete-word': [word: Word];
  'bulk-action': [action: string, wordIds: string[]];
}>();

const showBulkActions = ref(false);
const selectedWords = ref<string[]>([]);
</script>
  