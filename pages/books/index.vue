<!-- pages/books/index.vue -->
<template>
  <main class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Books</h1>

    <!-- 追加ボタン -->
    <button
      class="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      @click="openAddBookModal"
    >
      Add Book
    </button>

    <!-- 一覧 -->
    <div v-if="booksWithStats.length" class="grid md:grid-cols-2 gap-4">
      <div
        v-for="book in booksWithStats"
        :key="book.id"
        class="border rounded p-4 shadow-sm flex flex-col justify-between"
      >
        <div>
          <NuxtLink :to="`/books/${book.id}`" class="text-lg font-semibold">
            {{ book.title }}
          </NuxtLink>
          <p v-if="book.description" class="text-gray-600 mt-1">
            {{ book.description }}
          </p>
        </div>

        <!-- 進捗 -->
        <div class="mt-2 text-sm text-gray-700">
          {{ book.memorizedWords }}/{{ book.totalWords }} words memorized
        </div>

        <!-- アクション -->
        <div class="flex gap-2 mt-3">
          <button
            @click="openEditBookModal(book)"
            class="px-3 py-1 text-sm border rounded"
          >
            Edit
          </button>
          <button
            @click="remove(book.id)"
            class="px-3 py-1 text-sm text-red-600 border rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500">No books yet. Add the first one!</p>

    <!-- モーダル -->
    <BookModal
      :is-open="showAddBookModal || showEditBookModal"
      :book="editingBook"
      @close="closeModals"
      @save="handleSaveBook"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useBooks } from "~/composables/useBooks";
import { useAuth } from "~/composables/useAuth";
import BookModal from "~/components/BookModal.vue";

const { getBooksWithStats, addBook, updateBook, deleteBook } = useBooks();
const { user } = useAuth();

const booksWithStats = ref<any[]>([]);

const showAddBookModal = ref(false);
const showEditBookModal = ref(false);
const editingBook = ref<any>(null);

// データ読み込み
async function loadBooksData() {
  if (!user.value) return;
  booksWithStats.value = await getBooksWithStats();
}

// モーダル制御
function closeModals() {
  showAddBookModal.value = false;
  showEditBookModal.value = false;
  editingBook.value = null;
}
function openAddBookModal() {
  showAddBookModal.value = true;
}
function openEditBookModal(book: any) {
  editingBook.value = book;
  showEditBookModal.value = true;
}

// 保存
async function handleSaveBook(bookData: {
  title: string;
  description?: string;
}) {
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
}

// 削除
async function remove(id: string) {
  if (confirm("Delete this book?")) {
    await deleteBook(id);
    await loadBooksData();
  }
}

onMounted(loadBooksData);
watch(user, async (newUser) => {
  if (newUser) await loadBooksData();
  else booksWithStats.value = [];
});
</script>
