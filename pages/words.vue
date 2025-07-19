<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
    <!-- ヘッダー -->
    <header
      class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 shadow"
    >
      <h1 class="text-3xl font-bold text-center">📘 単語暗記帳</h1>
    </header>

    <main class="max-w-2xl mx-auto p-6">
      <!-- 単語追加フォーム -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          ➕ 新しい単語を追加
        </h2>
        <form @submit.prevent="addNewWord" class="space-y-4">
          <input
            v-model="text"
            type="text"
            placeholder="単語"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            v-model="meaning"
            type="text"
            placeholder="意味"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition"
          >
            💾 保存
          </button>
        </form>
      </div>

      <!-- 単語リスト -->
      <div v-if="words.length" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          📋 登録済み単語
        </h2>
        <ul class="space-y-4">
          <li
            v-for="word in words"
            :key="word.id"
            class="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl p-5 flex justify-between items-center hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
          >
            <div>
              <p class="text-xl font-bold text-gray-800">{{ word.text }}</p>
              <p class="text-gray-500 text-sm">{{ word.meaning }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="markMemorized(word.id)"
                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full shadow"
                title="暗記済みにする"
              >
                ✅
              </button>
              <button
                @click="deleteWord(word.id)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full shadow"
                title="削除"
              >
                🗑️
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="text-center text-gray-500 mt-10">
        😴 まだ単語が登録されていません
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWords } from "~/composables/useWords";

const { words, addWord, loadWords, markMemorized, deleteWord } = useWords();
const text = ref("");
const meaning = ref("");

// 画面表示時に一覧自動読み込み
onMounted(async () => {
  await loadWords();
});

const addNewWord = async () => {
  if (!text.value || !meaning.value) return;
  await addWord(text.value, meaning.value);
  text.value = "";
  meaning.value = "";
  await loadWords(); // 保存後に一覧更新
};
</script>
