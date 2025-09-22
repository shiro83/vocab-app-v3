// composables/useWords.ts
import type { Word } from '@/lib/types'
import { now, newId } from '@/lib/utils'
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
  Firestore,
} from 'firebase/firestore'

// ここはあなたの初期化に合わせて調整：
// - lib/firebase.ts で db/auth を export している想定
// - もし plugins/firebase.client.ts で provide しているなら、useNuxtApp().$db/$auth を使ってください
import { db as firestore, auth } from '~/lib/firebase'

/**
 * Firestore words コレクションのパスビルダー
 */
const wordsCol = (db: Firestore, uid: string, bookId: string, sectionId: string) =>
  collection(db, 'users', uid, 'books', bookId, 'sections', sectionId, 'words')

/**
 * ログイン済 UID を取得（未ログインならエラー）
 */
const ensureUid = (): string => {
  const u = auth.currentUser?.uid
  if (!u) throw new Error('Not signed in')
  return u
}

export const useWords = () => {
  // sectionId -> Word[] のメモリキャッシュ（リアクティブ）
  const wordsBySection = useState<Record<string, Word[]>>('wordsBySection', () => ({}))

  /**
   * 指定 section の単語一覧を購読（リアルタイム）
   * @returns unsubscribe 関数
   */
  const subscribe = (bookId: string, sectionId: string) => {
    const uid = ensureUid()
    const qy = query(
      wordsCol(firestore, uid, bookId, sectionId),
      orderBy('updatedAt', 'desc')
    )
    return onSnapshot(qy, (snap) => {
      const list: Word[] = []
      snap.forEach((d) => {
        const x: any = d.data()
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
        })
      })
      wordsBySection.value[sectionId] = list
    })
  }

  /** メモリ上の最新一覧（購読後に使用） */
  const listWords = (sectionId: string) => wordsBySection.value[sectionId] ?? []

  /**
   * 追加
   * - グローバル検索用に LC フィールド（termLC/readingLC/meaningLC）と親IDを保存
   */
  const createWord = async (
    bookId: string,
    sectionId: string,
    input: { term: string; meaning: string; reading?: string; notes?: string; tags?: string[] }
  ) => {
    const uid = ensureUid()
    const id = newId()
    const ref = doc(wordsCol(firestore, uid, bookId, sectionId), id)
    await setDoc(ref, {
      ...input,
      bookId,                  // 検索/集計用に保持（型の都合で読込時は無視してOK）
      sectionId,               // 同上
      termLC: (input.term || '').toLowerCase(),
      readingLC: (input.reading || '').toLowerCase(),
      meaningLC: (input.meaning || '').toLowerCase(),
      createdAt: now(),
      updatedAt: now(),
    })
  }

  /**
   * 更新
   * - term/reading/meaning を更新する場合は LC も同期
   */
  const updateWord = async (
    bookId: string,
    sectionId: string,
    id: string,
    patch: Partial<Word>
  ) => {
    const uid = ensureUid()
    const ref = doc(firestore, 'users', uid, 'books', bookId, 'sections', sectionId, 'words', id)

    const lcPatch: Record<string, any> = {}
    if (patch.term !== undefined) lcPatch.termLC = (patch.term || '').toLowerCase()
    if (patch.reading !== undefined) lcPatch.readingLC = (patch.reading || '').toLowerCase()
    if (patch.meaning !== undefined) lcPatch.meaningLC = (patch.meaning || '').toLowerCase()

    await updateDoc(ref, { ...patch, ...lcPatch, updatedAt: now() })
  }

  /** 削除 */
  const deleteWord = async (bookId: string, sectionId: string, id: string) => {
    const uid = ensureUid()
    await deleteDoc(doc(firestore, 'users', uid, 'books', bookId, 'sections', sectionId, 'words', id))
  }

  /**
   * セクション間の移動（同じIDで移動）
   * - getDoc → batch.set(新) → batch.delete(旧)
   * - 既にメモリにある場合は読み取りを省略（ただし整合を優先するなら getDoc 推奨）
   */
  const moveWord = async (
    bookId: string,
    fromSectionId: string,
    toSectionId: string,
    id: string
  ) => {
    if (fromSectionId === toSectionId) return
    const uid = ensureUid()

    const srcRef = doc(firestore, 'users', uid, 'books', bookId, 'sections', fromSectionId, 'words', id)
    const dstRef = doc(firestore, 'users', uid, 'books', bookId, 'sections', toSectionId, 'words', id)

    // まずメモリから取得、無ければ getDoc
    let w = (wordsBySection.value[fromSectionId] || []).find((x) => x.id === id)
    if (!w) {
      const snap = await getDoc(srcRef)
      if (!snap.exists()) return
      const x: any = snap.data()
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
      }
    }

    const batch = writeBatch(firestore)
    batch.set(dstRef, {
      ...w,
      sectionId: toSectionId,
      // 検索用のLCフィールドも更新
      termLC: (w.term || '').toLowerCase(),
      readingLC: (w.reading || '').toLowerCase(),
      meaningLC: (w.meaning || '').toLowerCase(),
      bookId,
      updatedAt: now(),
    })
    batch.delete(srcRef)
    await batch.commit()
  }

  return { subscribe, listWords, createWord, updateWord, deleteWord, moveWord }
}
