// composables/useWords.ts
import type { Word } from '@/lib/types';
import { now, newId } from '@/lib/utils';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
  getDoc,
} from 'firebase/firestore';

export const useWords = () => {
  const { $db } = useNuxtApp();
  const { uid } = useAuth();

  // sectionId -> Word[] のキャッシュ
  const wordsBySection = useState<Record<string, Word[]>>(
    'wordsBySection',
    () => ({})
  );

  /** 指定 section の単語一覧を購読（リアルタイム） */
  const subscribe = (bookId: string, sectionId: string) => {
    const col = collection(
      $db,
      'users',
      uid.value!,
      'books',
      bookId,
      'sections',
      sectionId,
      'words'
    );
    const q = query(col, orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const list: Word[] = [];
      snap.forEach((d) => {
        const x: any = d.data();
        list.push({
          id: d.id,
          sectionId,
          term: x.term,
          reading: x.reading,
          meaning: x.meaning,
          notes: x.notes,
          tags: x.tags,
          createdAt: x.createdAt ?? now(),
          updatedAt: x.updatedAt ?? now(),
          stats: x.stats,
        });
      });
      wordsBySection.value[sectionId] = list;
    });
  };

  /** メモリ上の最新一覧を返す（購読後に使用） */
  const listWords = (sectionId: string) => wordsBySection.value[sectionId] ?? [];

  /** 追加 */
  const createWord = async (
    bookId: string,
    sectionId: string,
    input: { term: string; meaning: string; reading?: string; notes?: string; tags?: string[] }
  ) => {
    const id = newId();
    const ref = doc(
      collection(
        $db,
        'users',
        uid.value!,
        'books',
        bookId,
        'sections',
        sectionId,
        'words'
      ),
      id
    );
    await setDoc(ref, {
      ...input,
      createdAt: now(),
      updatedAt: now(),
    });
  };

  /** 更新 */
  const updateWord = async (
    bookId: string,
    sectionId: string,
    id: string,
    patch: Partial<Word>
  ) => {
    const ref = doc(
      $db,
      'users',
      uid.value!,
      'books',
      bookId,
      'sections',
      sectionId,
      'words',
      id
    );
    await updateDoc(ref, { ...patch, updatedAt: now() });
  };

  /** 削除 */
  const deleteWord = async (bookId: string, sectionId: string, id: string) => {
    await deleteDoc(
      doc(
        $db,
        'users',
        uid.value!,
        'books',
        bookId,
        'sections',
        sectionId,
        'words',
        id
      )
    );
  };

  /** セクション間の移動（バッチで copy -> delete; 同一IDで移動） */
  const moveWord = async (
    bookId: string,
    fromSectionId: string,
    toSectionId: string,
    id: string
  ) => {
    if (fromSectionId === toSectionId) return;

    const srcRef = doc(
      $db,
      'users',
      uid.value!,
      'books',
      bookId,
      'sections',
      fromSectionId,
      'words',
      id
    );
    const dstRef = doc(
      $db,
      'users',
      uid.value!,
      'books',
      bookId,
      'sections',
      toSectionId,
      'words',
      id
    );

    // まずはメモリから探し、無ければ読み取る
    let w = (wordsBySection.value[fromSectionId] || []).find((x) => x.id === id);
    if (!w) {
      const snap = await getDoc(srcRef);
      if (!snap.exists()) return;
      const x: any = snap.data();
      w = {
        id,
        sectionId: fromSectionId,
        term: x.term,
        reading: x.reading,
        meaning: x.meaning,
        notes: x.notes,
        tags: x.tags,
        createdAt: x.createdAt ?? now(),
        updatedAt: x.updatedAt ?? now(),
        stats: x.stats,
      };
    }

    const batch = writeBatch($db);
    batch.set(dstRef, { ...w, sectionId: toSectionId, updatedAt: now() });
    batch.delete(srcRef);
    await batch.commit();
  };

  return { subscribe, listWords, createWord, updateWord, deleteWord, moveWord };
};
