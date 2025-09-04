<!-- pages/books/[bookId]/index.vue -->
<template>
  <main class="p-4 max-w-3xl mx-auto">
    <NuxtLink to="/books" class="text-sm text-blue-600">← Back</NuxtLink>
    <h1 class="text-2xl font-bold mt-2 mb-4">Sections</h1>

    <form class="flex gap-2 mb-4" @submit.prevent="onCreate">
      <input
        v-model="name"
        placeholder="New section name"
        class="border rounded px-3 py-2 flex-1"
      />
      <button class="bg-blue-600 text-white rounded px-4 py-2">Add</button>
    </form>

    <ul class="space-y-2" v-if="sections.length">
      <li
        v-for="s in sections"
        :key="s.id"
        class="border rounded p-3 flex items-center justify-between"
      >
        <NuxtLink
          :to="`/books/${bookId}/sections/${s.id}`"
          class="font-medium"
          >{{ s.name }}</NuxtLink
        >
        <button class="text-sm text-red-600" @click="del(s.id)">Delete</button>
      </li>
    </ul>

    <p v-else class="text-gray-500">
      No sections yet. Create the first one above.
    </p>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSections } from "@/composables/useSections";

const route = useRoute();
const bookId = route.params.bookId as string;

const { subscribe, listSections, createSection, deleteSection } = useSections();

const name = ref("");
const sections = computed(() => listSections(bookId));

let stop: (() => void) | null = null;
if (process.client) stop = subscribe(bookId);
onBeforeUnmount(() => {
  stop?.();
});

const onCreate = async () => {
  if (!name.value.trim()) return;
  await createSection(bookId, name.value.trim());
  name.value = "";
};

const del = async (sectionId: string) => {
  if (confirm("Delete this section (and all its words)?")) {
    await deleteSection(bookId, sectionId);
  }
};
</script>
