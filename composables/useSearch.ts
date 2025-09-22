// composables/useSearch.ts
import {
  collectionGroup,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
  where,
} from "firebase/firestore";

export const useSearch = () => {
  const { $db } = useNuxtApp();
  const { uid } = useAuth();

  /** words の prefix 検索（termLC / readingLC いずれか） */
  const searchWordsGlobal = async (
    qstr: string,
    opts?: { max?: number; tag?: string; bookId?: string; sectionId?: string }
  ) => {
    const max = opts?.max ?? 50;
    const needle = qstr.trim().toLowerCase();
    if (!needle) return [];

    // termLC prefix
    const cg = collectionGroup($db, "words");
    const q1 = query(
      cg,
      orderBy("termLC"),
      startAt(needle),
      endAt(needle + "\uf8ff"),
      limit(max)
    );

    const results: any[] = [];
    const snap1 = await getDocs(q1);
    snap1.forEach((d) => results.push({ id: d.id, ...d.data() }));

    // readingLC prefix（補助）：termLC と重複する可能性があるので差分だけ
    const q2 = query(
      cg,
      orderBy("readingLC"),
      startAt(needle),
      endAt(needle + "\uf8ff"),
      limit(max)
    );
    const snap2 = await getDocs(q2);
    const seen = new Set(results.map((r) => r.__path || r.id));
    snap2.forEach((d) => {
      const data = { id: d.id, ...d.data() };
      const key = d.ref.path; // 一意
      if (!seen.has(key)) results.push(data);
    });

    // 追加フィルタ（任意）
    let filtered = results;
    if (opts?.tag) {
      const tag = opts.tag.toLowerCase();
      filtered = filtered.filter((w) =>
        (w.tags || []).some((t: string) => (t || "").toLowerCase() === tag)
      );
    }
    if (opts?.bookId)
      filtered = filtered.filter((w) => w.bookId === opts.bookId);
    if (opts?.sectionId)
      filtered = filtered.filter((w) => w.sectionId === opts.sectionId);

    // ソートは updatedAt desc で揃える
    filtered.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    return filtered.slice(0, max);
  };

  return { searchWordsGlobal };
};
