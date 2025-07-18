import { ref } from "vue";
import { Timestamp } from "firebase/firestore";
import { db } from "~/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "~/composables/useAuth";

export interface Word {
  id: string;
  text: string;
  meaning: string;
  memorized: boolean;
  createdAt: any;
  userId: string;
}

const words = ref<Word[]>([]);
const loading = ref(false);

const loadWords = async () => {
  const { user } = useAuth();
  if (!user.value) {
    console.warn("未ログインなので単語は取得しません");
    words.value = [];
    return;
  }

  loading.value = true;
  try {
    const q = query(
      collection(db, "words"),
      where("userId", "==", user.value.uid)
    );
    const querySnapshot = await getDocs(q);
    words.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Word, "id">),
    }));
    console.log("単語一覧取得:", words.value);
  } catch (err) {
    console.error("loadWordsエラー:", err);
  } finally {
    loading.value = false;
  }
};

const addWord = async (text: string, meaning: string) => {
  const { user } = useAuth();
  console.log("👤 user:", user.value);
  if (!user.value) {
    console.error("⚠️ ユーザー未ログイン");
    return;
  }


  try {
    await addDoc(collection(db, "words"), {
      text,
      meaning,
      memorized: false,
      createdAt: Timestamp.now(),
      userId: user.value.uid,
    });
    console.log("✅ Firestoreに追加完了");
    await loadWords();
  } catch (e) {
    console.error("🔥 Firestore追加失敗", e);
  }
};

const toggleMemorized = async (id: string, memorized: boolean) => {
  const { user } = useAuth();
  if (!user.value) {
    throw new Error("未ログインです");
  }

  try {
    const wordRef = doc(db, "words", id);
    await updateDoc(wordRef, { memorized });
    console.log(`memorized更新: ${id} → ${memorized}`);
    await loadWords(); // 更新後に一覧更新
  } catch (err) {
    console.error("toggleMemorizedエラー:", err);
  }
};

// 👇 これだけ export
export function useWords() {
  return {
    words,
    loading,
    loadWords,
    addWord,
    toggleMemorized,
  };
}
