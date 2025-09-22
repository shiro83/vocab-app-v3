// composables/useMigration.ts
import { 
  db, 
  collection, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  doc,
  Timestamp,
  writeBatch 
} from "~/lib/firebase";
import { useAuth } from "~/composables/useAuth";

export function useMigration() {
  const { user } = useAuth();

  async function migrateUserWords() {
    if (!user.value) throw new Error("未ログイン");
    
    console.log("📚 データ移行開始...");

    try {
      // 1. 既存の単語を取得
      const wordsQuery = query(
        collection(db, "words"),
        where("userId", "==", user.value.uid)
      );
      const wordsSnapshot = await getDocs(wordsQuery);
      const existingWords = wordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📝 既存単語数: ${existingWords.length}`);

      if (existingWords.length === 0) {
        console.log("✅ 移行する単語がありません");
        return;
      }

      // 2. 既にデフォルトブック・セクションが存在するかチェック
      const booksQuery = query(
        collection(db, "books"),
        where("userId", "==", user.value.uid),
        where("title", "==", "📚 未分類")
      );
      const booksSnapshot = await getDocs(booksQuery);

      let defaultBookId: string;
      let defaultSectionId: string;

      if (booksSnapshot.empty) {
        // 3. デフォルトブックを作成
        console.log("📚 デフォルトブック作成中...");
        const bookDoc = await addDoc(collection(db, "books"), {
          title: "📚 未分類",
          description: "既存の単語を移行するためのデフォルトブック",
          userId: user.value.uid,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
        });
        defaultBookId = bookDoc.id;

        // 4. デフォルトセクションを作成
        console.log("📑 デフォルトセクション作成中...");
        const sectionDoc = await addDoc(collection(db, "sections"), {
          title: "📑 単語リスト",
          description: "既存の単語を移行するためのデフォルトセクション",
          bookId: defaultBookId,
          userId: user.value.uid,
          order: 1,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
        });
        defaultSectionId = sectionDoc.id;
      } else {
        // 既存のデフォルト構造を使用
        defaultBookId = booksSnapshot.docs[0].id;
        
        const sectionsQuery = query(
          collection(db, "sections"),
          where("bookId", "==", defaultBookId),
          where("userId", "==", user.value.uid)
        );
        const sectionsSnapshot = await getDocs(sectionsQuery);
        
        if (sectionsSnapshot.empty) {
          const sectionDoc = await addDoc(collection(db, "sections"), {
            title: "📑 単語リスト",
            description: "既存の単語を移行するためのデフォルトセクション",
            bookId: defaultBookId,
            userId: user.value.uid,
            order: 1,
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
          });
          defaultSectionId = sectionDoc.id;
        } else {
          defaultSectionId = sectionsSnapshot.docs[0].id;
        }
      }

      // 5. バッチで既存単語を更新
      console.log("🔄 既存単語をバッチ更新中...");
      const batch = writeBatch(db);
      let updateCount = 0;

      for (let i = 0; i < existingWords.length; i++) {
        const word = existingWords[i];
        
        // 既にbookIdとsectionIdがある場合はスキップ
        if (word.bookId && word.sectionId) {
          console.log(`⏭️  スキップ: ${word.text} (既に移行済み)`);
          continue;
        }

        const wordRef = doc(db, "words", word.id);
        batch.update(wordRef, {
          bookId: defaultBookId,
          sectionId: defaultSectionId,
          order: i + 1,
          updatedAt: Timestamp.fromDate(new Date()),
        });

        updateCount++;
      }

      if (updateCount > 0) {
        await batch.commit();
        console.log(`✅ ${updateCount}個の単語を移行完了`);
      } else {
        console.log("ℹ️  移行が必要な単語はありませんでした");
      }

      return {
        defaultBookId,
        defaultSectionId,
        migratedWordsCount: updateCount,
        totalWordsCount: existingWords.length
      };

    } catch (error) {
      console.error("❌ 移行エラー:", error);
      throw error;
    }
  }

  // 移行状況をチェック
  async function checkMigrationStatus() {
    if (!user.value) return null;

    const wordsQuery = query(
      collection(db, "words"),
      where("userId", "==", user.value.uid)
    );
    const wordsSnapshot = await getDocs(wordsQuery);
    const words = wordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const totalWords = words.length;
    const migratedWords = words.filter(word => word.bookId && word.sectionId).length;
    const needsMigration = totalWords - migratedWords;

    return {
      totalWords,
      migratedWords,
      needsMigration,
      migrationComplete: needsMigration === 0
    };
  }

  return {
    migrateUserWords,
    checkMigrationStatus
  };
}