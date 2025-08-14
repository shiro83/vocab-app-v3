<!-- pages/words.vue -  -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
    <!-- ヘッダー -->
    <!-- 元のコード（削除） -->
    <!-- 
<header class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 shadow">
  <div class="max-w-2xl mx-auto px-6 flex justify-between items-center">
    <h1 class="text-3xl font-bold">📘 単語暗記帳</h1>
    <div class="text-sm">📊 {{ words.length }}語登録済み</div>
  </div>
</header>
-->

    <!-- 新しいコンポーネントの使用 -->
    <WordHeader :word-count="words.length" />

    <main class="max-w-2xl mx-auto p-6">
      <!-- 統計情報 -->
      <!-- 元のコード（削除） -->
      <!-- 
<div class="grid grid-cols-3 gap-4 mb-6">
  <div class="bg-white rounded-lg p-4 text-center shadow">
    <div class="text-2xl font-bold text-blue-600">{{ words.length }}</div>
    <div class="text-sm text-gray-600">総単語数</div>
  </div>
  <div class="bg-white rounded-lg p-4 text-center shadow">
    <div class="text-2xl font-bold text-green-600">{{ memorizedCount }}</div>
    <div class="text-sm text-gray-600">習得済み</div>
  </div>
  <div class="bg-white rounded-lg p-4 text-center shadow">
    <div class="text-2xl font-bold text-orange-600">{{ studyingCount }}</div>
    <div class="text-sm text-gray-600">学習中</div>
  </div>
</div>
-->

      <!-- 新しいコンポーネントの使用 -->
      <WordStats
        :total-count="words.length"
        :memorized-count="memorizedCount"
        :studying-count="studyingCount"
      />

      <!-- 単語追加フォーム -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <span class="mr-2">➕</span>新しい単語を追加
        </h2>
        <form @submit.prevent="addNewWord" class="space-y-4">
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

      <!-- フィルター・検索 -->
      <div class="bg-white rounded-xl shadow-md p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 単語を検索..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div class="flex gap-2">
            <button
              @click="filterStatus = 'all'"
              :class="[
                'px-3 py-2 rounded-lg text-sm transition',
                filterStatus === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              ]"
            >
              すべて
            </button>
            <button
              @click="filterStatus = 'studying'"
              :class="[
                'px-3 py-2 rounded-lg text-sm transition',
                filterStatus === 'studying'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              ]"
            >
              学習中
            </button>
            <button
              @click="filterStatus = 'memorized'"
              :class="[
                'px-3 py-2 rounded-lg text-sm transition',
                filterStatus === 'memorized'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              ]"
            >
              習得済み
            </button>
          </div>
        </div>
      </div>

      <!-- 単語リスト -->
      <div v-if="displayWords.length" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-700">
            📋 登録済み単語 ({{ displayWords.length }}件表示 / 全{{
              words.length
            }}件)
          </h2>
          <button
            @click="showBulkActions = !showBulkActions"
            class="text-sm text-blue-600 hover:text-blue-800 transition"
          >
            一括操作
          </button>
        </div>

        <!-- 一括操作 -->
        <div v-if="showBulkActions" class="bg-gray-50 rounded-lg p-4">
          <div class="flex flex-wrap gap-2">
            <button
              @click="bulkMarkMemorized"
              class="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition"
            >
              選択した単語を習得済みに
            </button>
            <button
              @click="bulkDelete"
              class="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition"
            >
              選択した単語を削除
            </button>
          </div>
        </div>

        <ul class="space-y-4">
          <li
            v-for="word in paginatedWords"
            :key="word.id"
            :class="[
              'bg-white rounded-xl shadow-md p-4 flex justify-between items-center transition-all hover:shadow-lg',
              word.memorized ? 'bg-green-50 border-l-4 border-green-500' : '',
            ]"
          >
            <div class="flex items-center space-x-3 flex-1">
              <input
                v-if="showBulkActions"
                type="checkbox"
                v-model="selectedWords"
                :value="word.id"
                class="rounded"
              />
              <div class="flex-1">
                <p class="text-gray-800 font-medium text-base">
                  {{ word.text }}
                  <span v-if="word.memorized" class="text-green-600 ml-2"
                    >✓</span
                  >
                </p>
                <p class="text-gray-500 text-sm">{{ word.meaning }}</p>
                <p v-if="word.createdAt" class="text-gray-400 text-xs mt-1">
                  {{ formatDate(word.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="toggleMemorized(word)"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition text-white',
                  word.memorized
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-green-500 hover:bg-green-600',
                ]"
                :title="word.memorized ? '学習中に戻す' : '覚えた'"
              >
                {{ word.memorized ? "↩️" : "✅" }}
              </button>
              <button
                @click="confirmDelete(word)"
                class="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
                title="削除"
              >
                🗑
              </button>
            </div>
          </li>
        </ul>

        <!-- ページネーション -->
        <div v-if="totalPages > 1" class="flex justify-center space-x-2 mt-6">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 rounded-lg text-sm transition',
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>

      <div
        v-else-if="words.length === 0"
        class="text-center text-gray-500 mt-10"
      >
        <div class="text-6xl mb-4">😴</div>
        <p class="text-lg">まだ単語が登録されていません</p>
        <p class="text-sm mt-2">
          上のフォームから最初の単語を追加してみましょう！
        </p>
      </div>

      <div v-else class="text-center text-gray-500 mt-10">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-lg">検索条件に一致する単語が見つかりません</p>
        <button
          @click="clearFilters"
          class="mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          フィルターをクリア
        </button>
      </div>
    </main>

    <!-- 削除確認モーダル -->
    <div
      v-if="wordToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">削除確認</h3>
        <p class="text-gray-600 mb-6">
          「{{ wordToDelete.text }}」を削除しますか？<br />
          この操作は取り消せません。
        </p>
        <div class="flex space-x-4">
          <button
            @click="executeDelete"
            class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            削除
          </button>
          <button
            @click="wordToDelete = null"
            class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import WordHeader from "~/components/WordHeader.vue";
import WordStats from "~/components/WordStats.vue";
import { useWords } from "~/composables/useWords";
import { useAuth } from "~/composables/useAuth";

const { words, loadWords, addWord, deleteWord, markMemorized } = useWords();
const { user } = useAuth();

// フォーム関連
const text = ref("");
const meaning = ref("");
const isLoading = ref(false);
const inputError = ref("");

// 検索・フィルター関連
const searchQuery = ref("");
const filterStatus = ref<"all" | "studying" | "memorized">("all");
const currentPage = ref(1);
const itemsPerPage = 10;

// 一括操作関連
const showBulkActions = ref(false);
const selectedWords = ref<string[]>([]);

// 削除確認関連
const wordToDelete = ref<any>(null);

// 統計計算
const memorizedCount = computed(
  () => words.value.filter((word) => word.memorized).length
);

const studyingCount = computed(
  () => words.value.filter((word) => !word.memorized).length
);

// フィルタリング（シンプル版）
const displayWords = computed(() => {
  let filtered = words.value;

  // 検索フィルター
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (word) =>
        word.text.toLowerCase().includes(query) ||
        word.meaning.toLowerCase().includes(query)
    );
  }

  // ステータスフィルター
  if (filterStatus.value === "studying") {
    filtered = filtered.filter((word) => !word.memorized);
  } else if (filterStatus.value === "memorized") {
    filtered = filtered.filter((word) => word.memorized);
  }

  return filtered;
});

// ページネーション
const totalPages = computed(() =>
  Math.ceil(displayWords.value.length / itemsPerPage)
);

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return displayWords.value.slice(start, end);
});

// 初期化
onMounted(async () => {
  if (user.value) {
    await loadWords();
  }
});

// ユーザー情報が確定したら単語をロードする
watch(user, async (newUser) => {
  if (newUser) {
    await loadWords();
  } else {
    words.value = [];
  }
});

// 検索・フィルター変更時にページをリセット
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1;
});

// バリデーション
const validateInput = () => {
  if (
    text.value &&
    words.value.some(
      (word) => word.text.toLowerCase() === text.value.toLowerCase()
    )
  ) {
    inputError.value = "この単語は既に登録されています";
  } else {
    inputError.value = "";
  }
};

// 単語追加処理
const addNewWord = async () => {
  if (!text.value || !meaning.value || inputError.value) return;

  isLoading.value = true;
  try {
    await addWord(text.value, meaning.value);
    text.value = "";
    meaning.value = "";
    inputError.value = "";
    await loadWords();
  } catch (error) {
    console.error("Error adding word:", error);
    alert("単語の追加に失敗しました");
  } finally {
    isLoading.value = false;
  }
};

// 習得状態の切り替え
const toggleMemorized = async (word: any) => {
  try {
    await markMemorized(word.id);
    await loadWords();
  } catch (error) {
    console.error("Error marking word:", error);
    alert("更新に失敗しました");
  }
};

// 削除確認
const confirmDelete = (word: any) => {
  wordToDelete.value = word;
};

const executeDelete = async () => {
  if (wordToDelete.value) {
    try {
      await deleteWord(wordToDelete.value.id);
      await loadWords();
      wordToDelete.value = null;
    } catch (error) {
      console.error("Error deleting word:", error);
      alert("削除に失敗しました");
    }
  }
};

// 一括操作
const bulkMarkMemorized = async () => {
  try {
    for (const wordId of selectedWords.value) {
      await markMemorized(wordId);
    }
    selectedWords.value = [];
    await loadWords();
  } catch (error) {
    console.error("Error in bulk operation:", error);
    alert("一括操作に失敗しました");
  }
};

const bulkDelete = async () => {
  if (
    confirm(`選択した${selectedWords.value.length}個の単語を削除しますか？`)
  ) {
    try {
      for (const wordId of selectedWords.value) {
        await deleteWord(wordId);
      }
      selectedWords.value = [];
      await loadWords();
    } catch (error) {
      console.error("Error in bulk delete:", error);
      alert("一括削除に失敗しました");
    }
  }
};

// フィルタークリア
const clearFilters = () => {
  searchQuery.value = "";
  filterStatus.value = "all";
  currentPage.value = 1;
};

// 日付フォーマット
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("ja-JP");
};
</script>
