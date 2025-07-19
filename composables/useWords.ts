import { ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";

interface Word {
  id: string;
  text: string;
  meaning: string;
  memorized: boolean;
  createdAt: any;
  userId: string;
}

const words = ref<Word[]>([]);

export function useWords() {
  const loadWords = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "words"));
      words.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Word[];
      console.log("Loaded words:", words.value);
    } catch (e) {
      console.error("Failed to load words:", e);
    }
  };

  return {
    words,
    loadWords,
  };
}
