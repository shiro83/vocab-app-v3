import { ref } from "vue";
import {
  db,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  Timestamp,
} from "~/lib/firebase";
import { useAuth } from "~/composables/useAuth";

const words = ref<any[]>([]);

export function useWords() {
  const { user } = useAuth();

  async function loadWords() {
    if (!user.value) return;
    const q = query(
      collection(db, "words"),
      where("userId", "==", user.value.uid),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    words.value =
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) ?? [];
  }

  async function addWord(text: string, meaning: string) {
    if (!user.value) throw new Error("未ログイン");
    await addDoc(collection(db, "words"), {
      text,
      meaning,
      memorized: false,
      createdAt: Timestamp.fromDate(new Date()), // ここを修正
      userId: user.value.uid,
    });
    await loadWords();
  }

  async function deleteWord(id: string) {
    if (!user.value) throw new Error("未ログイン");
    await deleteDoc(doc(db, "words", id));
    await loadWords();
  }

  async function markMemorized(id: string) {
    if (!user.value) throw new Error("未ログイン");
    await updateDoc(doc(db, "words", id), {
      memorized: true,
    });
    await loadWords();
  }

  return {
    words,
    loadWords,
    addWord,
    deleteWord,
    markMemorized,
  };
}
