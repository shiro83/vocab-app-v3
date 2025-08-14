<template>
  <div class="bg-white rounded-xl shadow-md p-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 単語を検索..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div class="flex gap-2">
        <button
          @click="filterStatus = 'all'"
          :class="[
            'px-3 py-2 rounded-lg text-sm transition',
            filterStatus === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          すべて
        </button>
        <button
          @click="filterStatus = 'studying'"
          :class="[
            'px-3 py-2 rounded-lg text-sm transition',
            filterStatus === 'studying'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          学習中
        </button>
        <button
          @click="filterStatus = 'memorized'"
          :class="[
            'px-3 py-2 rounded-lg text-sm transition',
            filterStatus === 'memorized'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          習得済み
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Emits {
  (e: "update:searchQuery", value: string): void;
  (e: "update:filterStatus", value: "all" | "studying" | "memorized"): void;
}

interface Props {
  searchQuery: string;
  filterStatus: "all" | "studying" | "memorized";
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const searchQuery = computed({
  get: () => props.searchQuery,
  set: (value: string) => emit("update:searchQuery", value),
});

const filterStatus = computed({
  get: () => props.filterStatus,
  set: (value: "all" | "studying" | "memorized") =>
    emit("update:filterStatus", value),
});
</script>
