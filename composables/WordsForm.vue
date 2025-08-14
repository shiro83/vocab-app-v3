<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
    <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
      <span class="mr-2">➕</span>新しい単語を追加
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="relative">
        <input
          v-model.trim="text"
          type="text"
          placeholder="英単語"
          required
          :disabled="isLoading"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          @input="validateInput"
        />
        <div v-if="inputError" class="text-red-500 text-sm mt-1">
          {{ inputError }}
        </div>
      </div>
      <div class="relative">
        <input
          v-model.trim="meaning"
          type="text"
          placeholder="意味"
          required
          :disabled="isLoading"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>
      <button
        type="submit"
        :disabled="isLoading || !text || !meaning || !!inputError"
        class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <span v-if="!isLoading" class="mr-2">💾</span>
        <span v-if="isLoading" class="mr-2">⏳</span>
        {{ isLoading ? "保存中..." : "保存" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  existingWords: Array<{ text: string }>;
}

interface Emits {
  (e: 'add-word', text: string, meaning: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const text = ref('');
const meaning = ref('');
const isLoading = ref(false);
const inputError = ref('');

const validateInput = () => {
  if (
    text.value &&
    props.existingWords.some(
      (word) => word.text.toLowerCase() === text.value.toLowerCase()
    )
  ) {
    inputError.value = 'この単語は既に登録されています';
  } else {
    inputError.value = '';
  }
};

const handleSubmit = async () => {
  console.log('handleSubmit called:', { text: text.value, meaning: meaning.value }); // デバッグ用
  if (!text.value || !meaning.value || inputError.value) {
    console.log('Validation failed:', { text: text.value, meaning: meaning.value, inputError: inputError.value }); // デバッグ用
    return;
  }

  isLoading.value = true;
  try {
    console.log('Emitting add-word event:', { text: text.value, meaning: meaning.value }); // デバッグ用
    emit('add-word', text.value, meaning.value);
    text.value = '';
    meaning.value = '';
    inputError.value = '';
  } finally {
    isLoading.value = false;
  }
};

// テキストが変更されたときにバリデーションを実行
watch(() => props.existingWords, validateInput);
</script><template>
  <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
    <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
      <span class="mr-2">➕</span>新しい単語を追加
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="relative">
        <input
          v-model.trim="text"
          type="text"
          placeholder="英単語"
          required
          :disabled="isLoading"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          @input="validateInput"
        />
        <div v-if="inputError" class="text-red-500 text-sm mt-1">
          {{ inputError }}
        </div>
      </div>
      <div class="relative">
        <input
          v-model.trim="meaning"
          type="text"
          placeholder="意味"
          required
          :disabled="isLoading"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>
      <button
        type="submit"
        :disabled="isLoading || !text || !meaning || !!inputError"
        class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <span v-if="!isLoading" class="mr-2">💾</span>
        <span v-if="isLoading" class="mr-2">⏳</span>
        {{ isLoading ? "保存中..." : "保存" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  existingWords: Array<{ text: string }>;
}

interface Emits {
  (e: 'add-word', text: string, meaning: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const text = ref('');
const meaning = ref('');
const isLoading = ref(false);
const inputError = ref('');

const validateInput = () => {
  if (
    text.value &&
    props.existingWords.some(
      (word) => word.text.toLowerCase() === text.value.toLowerCase()
    )
  ) {
    inputError.value = 'この単語は既に登録されています';
  } else {
    inputError.value = '';
  }
};

const handleSubmit = async () => {
  console.log('handleSubmit called:', { text: text.value, meaning: meaning.value }); // デバッグ用
  if (!text.value || !meaning.value || inputError.value) {
    console.log('Validation failed:', { text: text.value, meaning: meaning.value, inputError: inputError.value }); // デバッグ用
    return;
  }

  isLoading.value = true;
  try {
    console.log('Emitting add-word event:', { text: text.value, meaning: meaning.value }); // デバッグ用
    emit('add-word', text.value, meaning.value);
    text.value = '';
    meaning.value = '';
    inputError.value = '';
  } finally {
    isLoading.value = false;
  }
};

// テキストが変更されたときにバリデーションを実行
watch(() => props.existingWords, validateInput);
</script><template>
  <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
    <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
      <span class="mr-2">➕</span>新しい単語を追加
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="relative">
        <input
          v-model.trim="text"
          type="text"
          placeholder="英単語"
          required
          :disabled="isLoading"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          @input="validateInput"
        />
        <div v-if="inputError" class="text-red-500 text-sm mt-1">
          {{ inputError }}
        </div>
      </div>
      <div class="relative">
        <input
          v-model.trim="meaning"
          type="text"
          placeholder="意味"
          required
          :disabled="isLoading"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>
      <button
        type="submit"
        :disabled="isLoading || !text || !meaning || !!inputError"
        class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <span v-if="!isLoading" class="mr-2">💾</span>
        <span v-if="isLoading" class="mr-2">⏳</span>
        {{ isLoading ? "保存中..." : "保存" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  existingWords: Array<{ text: string }>;
}

interface Emits {
  (e: 'add-word', text: string, meaning: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const text = ref('');
const meaning = ref('');
const isLoading = ref(false);
const inputError = ref('');

const validateInput = () => {
  if (
    text.value &&
    props.existingWords.some(
      (word) => word.text.toLowerCase() === text.value.toLowerCase()
    )
  ) {
    inputError.value = 'この単語は既に登録されています';
  } else {
    inputError.value = '';
  }
};

const handleSubmit = async () => {
  console.log('handleSubmit called:', { text: text.value, meaning: meaning.value }); // デバッグ用
  if (!text.value || !meaning.value || inputError.value) {
    console.log('Validation failed:', { text: text.value, meaning: meaning.value, inputError: inputError.value }); // デバッグ用
    return;
  }

  isLoading.value = true;
  try {
    console.log('Emitting add-word event:', { text: text.value, meaning: meaning.value }); // デバッグ用
    emit('add-word', text.value, meaning.value);
    text.value = '';
    meaning.value = '';
    inputError.value = '';
  } finally {
    isLoading.value = false;
  }
};

// テキストが変更されたときにバリデーションを実行
watch(() => props.existingWords, validateInput);
</script>