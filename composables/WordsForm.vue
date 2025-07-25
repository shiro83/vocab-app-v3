<!-- components/WordsForm.vue -->
<template>
  <form>
    <input v-model="word" placeholder="単語を入力" />
    <button type="submit">追加</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
const word = ref("");
</script>
