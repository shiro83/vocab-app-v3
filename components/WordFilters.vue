<!-- components/WordFilters.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          :value="search"
          @input="$emit('update:search', $event.target.value)"
          type="text"
          placeholder="🔍 単語を検索..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div class="flex gap-2">
        <FilterButton
          label="すべて"
          :active="filter === 'all'"
          @click="$emit('update:filter', 'all')"
        />
        <FilterButton
          label="学習中"
          color="orange"
          :active="filter === 'studying'"
          @click="$emit('update:filter', 'studying')"
        />
        <FilterButton
          label="習得済み"
          color="green"
          :active="filter === 'memorized'"
          @click="$emit('update:filter', 'memorized')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  search: string;
  filter: "all" | "studying" | "memorized";
}>();

defineEmits<{
  "update:search": [value: string];
  "update:filter": [value: "all" | "studying" | "memorized"];
  clear: [];
}>();
</script>
