<!-- components/WordForm.vue -->
<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
    <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
      <span class="mr-2">➕</span>新しい単語を追加
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <FormInput
        v-model="text"
        placeholder="英単語"
        :error="textError"
        :disabled="isLoading"
        @input="validateText"
        required
      />
      <FormInput
        v-model="meaning"
        placeholder="意味"
        :disabled="isLoading"
        required
      />
      <FormButton type="submit" :disabled="!canSubmit" :loading="isLoading">
        💾 保存
      </FormButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Word } from "~/types/word";

const props = defineProps<{
  isLoading: boolean;
  existingWords: Word[];
}>();

const emit = defineEmits<{
  addWord: [text: string, meaning: string];
}>();

const text = ref("");
const meaning = ref("");
const textError = ref("");

const canSubmit = computed(
  () =>
    text.value.trim() &&
    meaning.value.trim() &&
    !textError.value &&
    !props.isLoading
);

const validateText = () => {
  if (
    text.value &&
    props.existingWords.some(
      (word) => word.text.toLowerCase() === text.value.toLowerCase()
    )
  ) {
    textError.value = "この単語は既に登録されています";
  } else {
    textError.value = "";
  }
};

const handleSubmit = () => {
  if (!canSubmit.value) return;
  emit("addWord", text.value.trim(), meaning.value.trim());
  text.value = "";
  meaning.value = "";
  textError.value = "";
};
</script>
