<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">📚 単語帳</h1>
          <div class="flex items-center space-x-4">
            <button
              @click="showAddBookModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              ブック作成
            </button>
            <NuxtLink
              to="/study"
              class="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              学習開始
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto p-6">
      <!-- 移行ステータス -->
      <MigrationStatus />

      <!-- 統計情報 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">ブック数</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ booksWithStats.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">総単語数</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ totalStats.totalWords }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">学習中</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ totalStats.studyingWords }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">暗記済み</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ totalStats.memorizedWords }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ブック一覧 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">ブック一覧</h2>
        </div>

        <div v-if="booksWithStats.length === 0" class="p-8 text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            ブックがありません
          </h3>
          <p class="text-gray-500 mb-4">
            最初のブックを作成して単語の整理を始めましょう
          </p>
          <button
            @click="showAddBookModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            ブック作成
          </button>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="book in booksWithStats"
            :key="book.id"
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="$router.push(`/books/${book.id}`)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  {{ book.title }}
                </h3>
                <p v-if="book.description" class="text-gray-600 mb-3">
                  {{ book.description }}
                </p>

                <div class="flex items-center space-x-6 text-sm text-gray-500">
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ book.sectionCount }} セクション
                  </div>
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      />
                    </svg>
                    {{ book.totalWords }} 単語
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        class="h-2 bg-green-500 rounded-full transition-all"
                        :style="{
                          width: `${
                            book.totalWords > 0
                              ? (book.memorizedWords / book.totalWords) * 100
                              : 0
                          }%`,
                        }"
                      ></div>
                    </div>
                    {{
                      Math.round(
                        book.totalWords > 0
                          ? (book.memorizedWords / book.totalWords) * 100
                          : 0
                      )
                    }}% 完了
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2 ml-4">
                <NuxtLink
                  :to="`/study/book/${book.id}`"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  @click.stop
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  学習
                </NuxtLink>

                <button
                  @click.stop="openEditBookModal(book)"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  編集
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ブック追加/編集モーダル -->
    <BookModal
      :is-open="showAddBookModal || showEditBookModal"
      :book="editingBook"
      @close="closeModals"
      @save="handleSaveBook"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBooks } from "~/composables/useBooks";
import { useAuth } from "~/composables/useAuth";
import MigrationStatus from "~/components/MigrationStatus.vue";
import BookModal from "~/components/BookModal.vue";

const { getBooksWithStats, addBook, updateBook, deleteBook } = useBooks();
const { user } = useAuth();

const booksWithStats = ref([]);
const showAddBookModal = ref(false);
const showEditBookModal = ref(false);
const editingBook = ref(null);

// 統計情報の計算
const totalStats = computed(() => {
  const stats = {
    totalWords: 0,
    memorizedWords: 0,
    studyingWords: 0,
  };

  booksWithStats.value.forEach((book) => {
    stats.totalWords += book.totalWords;
    stats.memorizedWords += book.memorizedWords;
    stats.studyingWords += book.studyingWords;
  });

  return stats;
});

// データ読み込み
async function loadBooksData() {
  if (!user.value) return;
  try {
    booksWithStats.value = await getBooksWithStats();
  } catch (error) {
    console.error("ブックデータの読み込みエラー:", error);
  }
}

// モーダル制御
function closeModals() {
  showAddBookModal.value = false;
  showEditBookModal.value = false;
  editingBook.value = null;
}

function openEditBookModal(book) {
  editingBook.value = book;
  showEditBookModal.value = true;
}

// ブック保存
async function handleSaveBook(bookData) {
  try {
    if (editingBook.value) {
      await updateBook(
        editingBook.value.id,
        bookData.title,
        bookData.description
      );
    } else {
      await addBook(bookData.title, bookData.description);
    }
    await loadBooksData();
    closeModals();
  } catch (error) {
    console.error("ブック保存エラー:", error);
    alert("ブックの保存に失敗しました");
  }
}

// 初期化
onMounted(() => {
  loadBooksData();
});

// ユーザー変更時の再読み込み
watch(user, async (newUser) => {
  if (newUser) {
    await loadBooksData();
  } else {
    booksWithStats.value = [];
  }
});
</script>
