// lib/types.ts
export type ID = string;

export interface SrsStats {
  easiness?: number; // SM-2などで使用（初期2.5想定）
  interval?: number; // days
  repetition?: number; // 連続正解回数など
  dueAt?: number; // 次回出題予定（ms epoch）
  correct?: number; // 累計正解
  wrong?: number; // 累計不正解
}

export interface Book {
  id: ID; // Firestoreのdoc idと一致
  name: string;
  description?: string;
  order?: number; // 並び順
  createdAt: number; // ms epoch
  updatedAt: number; // ms epoch
}

export interface Section {
  id: ID; // doc id
  bookId: ID; // 親Bookのid（便宜上フィールドにも保持）
  name: string;
  description?: string;
  order?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Word {
  id: ID; // doc id
  sectionId: ID; // 親Sectionのid（便宜上フィールドにも保持）
  term: string;
  reading?: string;
  meaning: string;
  notes?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  stats?: SrsStats; // 将来のSRS用
}
