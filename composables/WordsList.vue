<template>
  <ul>
    <li v-for="word in words" :key="word.id">
      {{ word.text }} - {{ word.meaning }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useWords } from "~/composables/useWords";
const { words } = useWords();
</script>
