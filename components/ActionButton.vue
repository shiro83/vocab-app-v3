<!-- ~/components/ActionButton.vue -->
<template>
  <button @click="$emit('click')" :class="buttonClasses" :title="title">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type: "memorized" | "studying" | "delete";
  title?: string;
}

const props = defineProps<Props>();

defineEmits<{
  click: [];
}>();

const buttonClasses = computed(() => {
  const baseClasses = "px-3 py-1 rounded-full text-sm transition text-white";

  switch (props.type) {
    case "memorized":
      return `${baseClasses} bg-green-500 hover:bg-green-600`;
    case "studying":
      return `${baseClasses} bg-orange-500 hover:bg-orange-600`;
    case "delete":
      return `${baseClasses} bg-red-500 hover:bg-red-600`;
    default:
      return `${baseClasses} bg-gray-500 hover:bg-gray-600`;
  }
});
</script>
