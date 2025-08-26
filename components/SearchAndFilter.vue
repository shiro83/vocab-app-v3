<!-- ~/components/SearchAndFilter.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          :value="searchQuery"
          @input="updateSearchQuery"
          type="text"
          placeholder="🔍 単語を検索..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div class="flex gap-2">
        <FilterButton
          :active="filterStatus === 'all'"
          @click="updateFilterStatus('all')"
          class="bg-blue-500"
        >
          すべて
        </FilterButton>
        <FilterButton
          :active="filterStatus === 'studying'"
          @click="updateFilterStatus('studying')"
          class="bg-orange-500"
        >
          学習中
        </FilterButton>
        <FilterButton
          :active="filterStatus === 'memorized'"
          @click="updateFilterStatus('memorized')"
          class="bg-green-500"
        >
          習得済み
        </FilterButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string;
  filterStatus: "all" | "studying" | "memorized";
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:filterStatus": [value: "all" | "studying" | "memorized"];
}>();

const updateSearchQuery = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:searchQuery", target.value);
};

const updateFilterStatus = (status: "all" | "studying" | "memorized") => {
  emit("update:filterStatus", status);
};
</script>
