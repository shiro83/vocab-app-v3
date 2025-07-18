<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- ヘッダー -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <h1 class="text-2xl font-bold text-center py-4">📘 単語暗記帳</h1>
    </header>

    <main class="max-w-2xl mx-auto p-6 space-y-8">
      <!-- 単語追加フォーム -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-700">➕ 新しい単語</h2>
        <form @submit.prevent="addNewWord" class="space-y-4">
          <input
            v-model="text"
            type="text"
            placeholder="単語"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300 transition"
          />
          <input
            v-model="meaning"
            type="text"
            placeholder="意味"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300 transition"
          />
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition shadow-sm"
          >
            保存
          </button>
        </form>
      </div>

      <!-- 単語リスト -->
      <div v-if="words.length" class="space-y-3">
        <h2 class="text-lg font-semibold text-gray-700">📋 登録済み単語</h2>
        <ul class="space-y-2">
          <li
            v-for="word in words"
            :key="word.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <p class="font-medium text-base text-gray-800">{{ word.text }}</p>
              <p class="text-sm text-gray-500">{{ word.meaning }}</p>
            </div>
            <button
              class="text-blue-500 border border-blue-500 rounded px-3 py-1 text-sm hover:bg-blue-50 transition"
              @click="markMemorized(word.id)"
            >
              ✅
            </button>
          </li>
        </ul>
      </div>

      <p v-else class="text-center text-gray-500">
        まだ単語が登録されていません。
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWords } from "~/composables/useWords";

const { words, addWord, loadWords, markMemorized } = useWords();
const text = ref("");
const meaning = ref("");

const addNewWord = async () => {
  if (!text.value.trim() || !meaning.value.trim()) return;
  await addWord(text.value, meaning.value);
  text.value = "";
  meaning.value = "";
};
onMounted(loadWords);
</script>
