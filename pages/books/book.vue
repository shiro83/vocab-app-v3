<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/books"
              class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              ブック一覧
            </NuxtLink>
            <div class="text-gray-300">/</div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ currentBook?.title }}
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showAddSectionModal = true"
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
              セクション作成
            </button>
            <NuxtLink
              :to="`/study/book/${$route.params.bookId}`"
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
              ブック学習
            </NuxtLink>
          </div>
        </div>
        <p v-if="currentBook?.description" class="mt-2 text-gray-600">
          {{ currentBook.description }}
        </p>
      </div>
    </header>

    <main class="max-w-4xl mx-auto p-6">
      <!-- 統計情報 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              <p class="text-sm font-medium text-gray-500">セクション数</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ sectionsWithStats.length }}
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
                {{ bookStats.totalWords }}
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
                <div class="w-4 h-2 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-purple-600 rounded-full transition-all"
                    :style="{
                      width: `${
                        bookStats.totalWords > 0
                          ? (bookStats.memorizedWords / bookStats.totalWords) *
                            100
                          : 0
                      }%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">学習進捗</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{
                  Math.round(
                    bookStats.totalWords > 0
                      ? (bookStats.memorizedWords / bookStats.totalWords) * 100
                      : 0
                  )
                }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- セクション一覧 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">セクション一覧</h2>
        </div>

        <div v-if="sectionsWithStats.length === 0" class="p-8 text-center">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            セクションがありません
          </h3>
          <p class="text-gray-500 mb-4">
            最初のセクションを作成して単語を整理しましょう
          </p>
          <button
            @click="showAddSectionModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            セクション作成
          </button>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="section in sectionsWithStats"
            :key="section.id"
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="
              $router.push(`/books/${$route.params.bookId}/${section.id}`)
            "
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  {{ section.title }}
                </h3>
                <p v-if="section.description" class="text-gray-600 mb-3">
                  {{ section.description }}
                </p>

                <div class="flex items-center space-x-6 text-sm text-gray-500">
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
                    {{ section.totalWords }} 単語
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        class="h-2 bg-green-500 rounded-full transition-all"
                        :style="{
                          width: `${
                            section.totalWords > 0
                              ? (section.memorizedWords / section.totalWords) *
                                100
                              : 0
                          }%`,
                        }"
                      ></div>
                    </div>
                    {{
                      Math.round(
                        section.totalWords > 0
                          ? (section.memorizedWords / section.totalWords) * 100
                          : 0
                      )
                    }}% 完了
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ section.studyingWords }} 学習中 /
                    {{ section.memorizedWords }} 暗記済み
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2 ml-4">
                <NuxtLink
                  :to="`/study/section/${section.id}`"
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
                  @click.stop="openEditSectionModal(section)"
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

    <!-- セクション追加/編集モーダル -->
    <SectionModal
      :is-open="showAddSectionModal || showEditSectionModal"
      :section="editingSection"
      @close="closeSectionModals"
      @save="handleSaveSection"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useBooks } from "~/composables/useBooks";
import { useSections } from "~/composables/useSections";
import { useAuth } from "~/composables/useAuth";
import SectionModal from "~/components/SectionModal.vue";

const route = useRoute();
const { books, loadBooks } = useBooks();
const { getSectionsWithStats, addSection, updateSection, deleteSection } =
  useSections();
const { user } = useAuth();

const sectionsWithStats = ref([]);
const showAddSectionModal = ref(false);
const showEditSectionModal = ref(false);
const editingSection = ref(null);

const bookId = computed(() => route.params.bookId as string);

const currentBook = computed(() => {
  return books.value.find((book) => book.id === bookId.value);
});

const bookStats = computed(() => {
  const stats = {
    totalWords: 0,
    memorizedWords: 0,
    studyingWords: 0,
  };

  sectionsWithStats.value.forEach((section) => {
    stats.totalWords += section.totalWords;
    stats.memorizedWords += section.memorizedWords;
    stats.studyingWords += section.studyingWords;
  });

  return stats;
});

// データ読み込み
async function loadSectionData() {
  if (!user.value || !bookId.value) return;
  try {
    sectionsWithStats.value = await getSectionsWithStats(bookId.value);
  } catch (error) {
    console.error("セクションデータの読み込みエラー:", error);
  }
}

// モーダル制御
function closeSectionModals() {
  showAddSectionModal.value = false;
  showEditSectionModal.value = false;
  editingSection.value = null;
}

function openEditSectionModal(section) {
  editingSection.value = section;
  showEditSectionModal.value = true;
}

// セクション保存
async function handleSaveSection(sectionData) {
  try {
    if (editingSection.value) {
      await updateSection(
        editingSection.value.id,
        sectionData.title,
        sectionData.description
      );
    } else {
      await addSection(
        bookId.value,
        sectionData.title,
        sectionData.description
      );
    }
    await loadSectionData();
    closeSectionModals();
  } catch (error) {
    console.error("セクション保存エラー:", error);
    alert("セクションの保存に失敗しました");
  }
}

// 初期化
onMounted(async () => {
  await loadBooks();
  await loadSectionData();
});

// ユーザーやブックID変更時の再読み込み
watch([user, bookId], async () => {
  if (user.value && bookId.value) {
    await loadBooks();
    await loadSectionData();
  }
});
</script>
