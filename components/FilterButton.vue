<!-- ~/components/FilterButton.vue -->
<template>
  <button @click="$emit('click')" :class="buttonClasses">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  active: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  click: [];
}>();

const buttonClasses = computed(() => [
  "px-3 py-2 rounded-lg text-sm transition",
  props.active ? "text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
]);
</script>
