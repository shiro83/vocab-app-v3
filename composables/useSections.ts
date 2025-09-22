// composables/useSections.ts
import type { Section } from "@/lib/types";
import { newId, now } from "@/lib/utils";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  getDocs,
  limit,
  writeBatch,
} from "firebase/firestore";

export const useSections = () => {
  const { $db } = useNuxtApp();
  const { uid } = useAuth(); // 既存の匿名/通常認証を想定（必要ならパス調整）

  // bookId -> Section[] のキャッシュ
  const sectionsByBook = useState<Record<string, Section[]>>(
    "sectionsByBook",
    () => ({})
  );

  /** 指定 bookId のセクション一覧を購読（リアルタイム） */
  const subscribe = (bookId: string) => {
    const col = collection(
      $db,
      "users",
      uid.value!,
      "books",
      bookId,
      "sections"
    );
    const q = query(col, orderBy("order", "asc"), orderBy("updatedAt", "desc"));
    return onSnapshot(q, (snap) => {
      const list: Section[] = [];
      snap.forEach((d) => {
        const data: any = d.data();
        list.push({
          id: d.id,
          bookId,
          name: data.name,
          description: data.description,
          order: data.order ?? 0,
          createdAt: data.createdAt ?? now(),
          updatedAt: data.updatedAt ?? now(),
        });
      });
      sectionsByBook.value[bookId] = list;
    });
  };

  /** メモリ上の最新一覧を返す（購読後に使う） */
  const listSections = (bookId: string) => sectionsByBook.value[bookId] ?? [];

  /** 追加 */
  const createSection = async (
    bookId: string,
    name: string,
    description?: string
  ) => {
    const id = newId();
    const ref = doc(
      collection($db, "users", uid.value!, "books", bookId, "sections"),
      id
    );
    await setDoc(ref, {
      name,
      description,
      order: listSections(bookId).length,
      createdAt: now(),
      updatedAt: now(),
    });
  };

  /** 更新（名前や説明、order など） */
  const updateSection = async (
    bookId: string,
    id: string,
    patch: Partial<Section>
  ) => {
    const ref = doc($db, "users", uid.value!, "books", bookId, "sections", id);
    await updateDoc(ref, { ...patch, updatedAt: now() });
  };

  /** 削除（配下の words をバッチで先に削除してから section を削除） */
  const deleteSection = async (bookId: string, id: string) => {
    // words サブコレクションを分割バッチで削除（最大500/バッチだが安全マージンで250ずつ）
    const purgeWords = async () => {
      const wordsCol = collection(
        $db,
        "users",
        uid.value!,
        "books",
        bookId,
        "sections",
        id,
        "words"
      );
      while (true) {
        const snap = await getDocs(query(wordsCol, limit(250)));
        if (snap.empty) break;
        const batch = writeBatch($db);
        snap.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    };

    await purgeWords();
    await deleteDoc(
      doc($db, "users", uid.value!, "books", bookId, "sections", id)
    );
  };

  return {
    subscribe,
    listSections,
    createSection,
    updateSection,
    deleteSection,
  };
};
