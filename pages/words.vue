<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
    <!-- ヘッダー -->
    <WordHeader :word-count="words.length" />

    <main class="max-w-2xl mx-auto p-6">
      <!-- 統計情報 -->
      <WordStats
        :total-count="words.length"
        :memorized-count="memorizedCount"
        :studying-count="studyingCount"
      />

      <!-- 学習モードボタン -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">📚 学習モード</h2>
        <div class="flex justify-center">
          <button
            @click="startStudyMode('flashcard')"
            :disabled="studyingWords.length === 0"
            :class="[
              'flex items-center justify-center space-x-3 py-4 px-8 rounded-xl transition text-base font-medium min-w-64',
              studyingWords.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1',
            ]"
          >
            <span class="text-2xl">🃏</span>
            <div class="text-left">
              <div class="font-semibold">フラッシュカード</div>
              <div class="text-xs opacity-90">
                {{ studyingWords.length }}個の単語
              </div>
            </div>
          </button>
        </div>

        <div
          v-if="studyingWords.length === 0 && words.length > 0"
          class="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg"
        >
          💡
          学習中の単語がありません。単語を「学習中に戻す」ボタンで戻してから学習を始めましょう。
        </div>
      </div>

      <!-- 単語追加フォーム -->
      <WordForm :existing-words="words" @add-word="handleAddWord" />
      <!-- CSVインポートボタンを適切な場所に配置 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">📂 データ管理</h2>
        <div class="flex gap-4">
          <CSVImport @words-imported="handleWordsImported" />
          <!-- 他のデータ管理機能 -->
        </div>
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
    <DeleteModal
      :word-to-delete="wordToDelete"
      @confirm-delete="executeDelete"
      @cancel="wordToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import WordHeader from "~/components/WordHeader.vue";
import WordStats from "~/components/WordStats.vue";
import WordForm from "~/components/WordForm.vue";
import DeleteModal from "~/components/DeleteModal.vue";
import CSVImport from   "~/components/CSVImport.vue";
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

// 学習用単語リスト
const studyingWords = computed(() =>
  words.value.filter((word) => !word.memorized)
);

// 学習モード開始
const startStudyMode = (mode: "flashcard") => {
  const wordsToStudy = studyingWords.value;

  if (wordsToStudy.length === 0) {
    alert("学習する単語がありません");
    return;
  }

  // 学習モード画面に遷移
  navigateTo("/study/flashcard");
};

// 単語登録
const handleAddWord = async (text: string, meaning: string) => {
  console.log("handleAddWord called:", { text, meaning });
  try {
    await addWord(text, meaning);
    await loadWords();
    console.log("Word added successfully");
  } catch (error) {
    console.error("Error adding word:", error);
    alert("単語の追加に失敗しました");
  }
};

// インポート完了時の処理を修正
const handleWordsImported = async (importedWords: any[]) => {
  console.log("インポート開始:", importedWords); // デバッグ用

  try {
    let successCount = 0;
    let errorCount = 0;

    // 重複チェック（オプション）
    const existingTexts = words.value.map((w) => w.text.toLowerCase());

    for (const word of importedWords) {
      try {
        // 重複チェック
        if (existingTexts.includes(word.text.toLowerCase())) {
          console.log(`重複スキップ: ${word.text}`);
          continue;
        }

        console.log(`単語追加中: ${word.text} - ${word.meaning}`); // デバッグ用
        await addWord(word.text, word.meaning);
        successCount++;

        // 追加された単語を既存リストに追加（重複チェック用）
        existingTexts.push(word.text.toLowerCase());
      } catch (error) {
        console.error(`単語「${word.text}」の追加に失敗:`, error);
        errorCount++;
      }
    }

    // 単語リストを再読み込み
    console.log("単語リスト再読み込み中..."); // デバッグ用
    await loadWords();

    // 結果を通知
    if (errorCount === 0) {
      console.log(`成功: ${successCount}個の単語をインポート`); // デバッグ用
      alert(`${successCount}個の単語をインポートしました！`);
    } else {
      alert(
        `${successCount}個の単語をインポートしました。${errorCount}個の単語でエラーが発生しました。`
      );
    }
  } catch (error) {
    console.error("インポート処理でエラーが発生:", error);
    alert("インポート処理でエラーが発生しました: " + error.message);
  }
};

// フィルタリング
const displayWords = computed(() => {
  let filtered = words.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (word) =>
        word.text.toLowerCase().includes(query) ||
        word.meaning.toLowerCase().includes(query)
    );
  }

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

watch(user, async (newUser) => {
  if (newUser) {
    await loadWords();
  } else {
    words.value = [];
  }
});

watch([searchQuery, filterStatus], () => {
  currentPage.value = 1;
});

// その他の関数
const toggleMemorized = async (word: any) => {
  try {
    await markMemorized(word.id);
    await loadWords();
  } catch (error) {
    console.error("Error marking word:", error);
    alert("更新に失敗しました");
  }
};

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

const clearFilters = () => {
  searchQuery.value = "";
  filterStatus.value = "all";
  currentPage.value = 1;
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("ja-JP");
};
</script>
