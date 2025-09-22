<template>
  <main class="p-4 max-w-4xl mx-auto">
    <NuxtLink :to="`/books/${bookId}`" class="text-sm text-blue-600"
      >← Back</NuxtLink
    >
    <h1 class="text-2xl font-bold mt-2 mb-4">Words</h1>

    <!-- Controls -->
    <div class="flex flex-col md:flex-row gap-2 md:items-center mb-4">
      <input
        v-model="q"
        placeholder="Search (term / reading / meaning / #tag)"
        class="border rounded px-3 py-2 flex-1"
      />
      <select v-model="sortKey" class="border rounded px-2 py-2">
        <option value="updatedAt">Sort: Updated</option>
        <option value="term">Sort: Term</option>
        <option value="reading">Sort: Reading</option>
        <option value="meaning">Sort: Meaning</option>
      </select>
      <select v-model="sortDir" class="border rounded px-2 py-2">
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>

    <!-- Add form -->
    <form
      class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4"
      @submit.prevent="onCreate"
    >
      <input
        v-model="term"
        placeholder="Term"
        class="border rounded px-3 py-2"
      />
      <input
        v-model="reading"
        placeholder="Reading"
        class="border rounded px-3 py-2"
      />
      <input
        v-model="meaning"
        placeholder="Meaning"
        class="border rounded px-3 py-2"
      />
      <button class="bg-blue-600 text-white rounded px-4 py-2">Add</button>
    </form>

    <!-- List -->
    <ul class="space-y-2">
      <li v-for="w in viewWords" :key="w.id" class="border rounded p-3">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="font-medium">
              {{ w.term }}
              <span v-if="w.reading" class="text-gray-500"
                >({{ w.reading }})</span
              >
            </div>
            <div class="text-gray-700">{{ w.meaning }}</div>
            <div v-if="w.tags?.length" class="text-xs text-gray-500 mt-1">
              <span v-for="t in w.tags" :key="t" class="mr-1">#{{ t }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="text-sm" @click="onMove(w.id)">Move</button>
            <button class="text-sm text-red-600" @click="del(w.id)">
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Move dialog -->
    <dialog ref="moveDlg" class="p-4 rounded border max-w-sm w-full">
      <h2 class="font-semibold mb-2">Move word to…</h2>
      <select
        v-model="targetSectionId"
        class="border rounded px-2 py-1 w-full mb-3"
      >
        <option v-for="s in allSections" :key="s.id" :value="s.id">
          {{ s.name }}
        </option>
      </select>
      <div class="flex justify-end gap-2">
        <button @click="closeMove()">Cancel</button>
        <button
          class="bg-blue-600 text-white rounded px-3 py-1"
          @click="confirmMove()"
        >
          Move
        </button>
      </div>
    </dialog>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useSections } from "~/composables/useSections";
import { useWords } from "~/composables/useWords";

const route = useRoute();
const bookId = route.params.bookId as string;
const sectionId = route.params.sectionId as string;

const { subscribe: subSections, listSections } = useSections();
const {
  subscribe: subWords,
  listWords,
  createWord,
  deleteWord,
  moveWord,
} = useWords();

// form
const term = ref("");
const reading = ref("");
const meaning = ref("");

// search & sort controls
const q = ref(""); // "#tag" でタグ検索にマッチ
const sortKey = ref<"updatedAt" | "term" | "reading" | "meaning">("updatedAt");
const sortDir = ref<"asc" | "desc">("desc");

// data
const rawWords = computed(() => listWords(sectionId));
const words = computed(() => rawWords.value ?? []);
const allSections = computed(() => listSections(bookId));

// search (client-side contains, case-insensitive; "#tag" はタグ完全一致)
const viewWords = computed(() => {
  const needle = q.value.trim().toLowerCase();
  let arr = words.value;
  if (needle) {
    if (needle.startsWith("#")) {
      const tag = needle.slice(1);
      arr = arr.filter((w) => w.tags?.some((t) => t.toLowerCase() === tag));
    } else {
      arr = arr.filter(
        (w) =>
          (w.term?.toLowerCase() ?? "").includes(needle) ||
          (w.reading?.toLowerCase() ?? "").includes(needle) ||
          (w.meaning?.toLowerCase() ?? "").includes(needle)
      );
    }
  }
  const dir = sortDir.value === "asc" ? 1 : -1;
  return [...arr].sort((a, b) => {
    const key = sortKey.value;
    if (key === "updatedAt") return (a.updatedAt - b.updatedAt) * dir;
    const av = (a[key] ?? "").toString().toLowerCase();
    const bv = (b[key] ?? "").toString().toLowerCase();
    return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
  });
});

// subscriptions
let stopA: (() => void) | null = null;
let stopB: (() => void) | null = null;
if (process.client) {
  stopA = subSections(bookId);
  stopB = subWords(bookId, sectionId);
}
onBeforeUnmount(() => {
  stopA?.();
  stopB?.();
});

// actions
const onCreate = async () => {
  if (!term.value.trim() || !meaning.value.trim()) return;
  await createWord(bookId, sectionId, {
    term: term.value.trim(),
    meaning: meaning.value.trim(),
    reading: reading.value || undefined,
  });
  term.value = "";
  reading.value = "";
  meaning.value = "";
};
const del = async (id: string) => {
  if (confirm("Delete this word?")) await deleteWord(bookId, sectionId, id);
};

// move dialog
const moveDlg = ref<HTMLDialogElement | null>(null);
const movingId = ref<string | null>(null);
const targetSectionId = ref<string>("");

const onMove = (id: string) => {
  movingId.value = id;
  targetSectionId.value = sectionId;
  moveDlg.value?.showModal();
};
const closeMove = () => moveDlg.value?.close();
const confirmMove = async () => {
  if (
    !movingId.value ||
    !targetSectionId.value ||
    targetSectionId.value === sectionId
  )
    return closeMove();
  await moveWord(bookId, sectionId, targetSectionId.value, movingId.value);
  closeMove();
};
</script>
