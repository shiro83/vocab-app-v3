import "@testing-library/jest-dom";
// tests/setup.ts
import { vi } from "vitest";

// ~/lib/firebase をモック
vi.mock("~/lib/firebase", () => ({
  auth: { currentUser: { uid: "mockUserId" } }, // モックユーザー
  provider: {},
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  db: {}, // Firestore ダミー
}));

// firebase/auth をモック
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({
      displayName: "Mock User",
      email: "mock@example.com",
      photoURL: "mock.png",
      uid: "mockUserId",
    });
  }),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(() => ({ currentUser: { uid: "mockUserId" } })),
}));

// firebase/firestore をモック
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => "mockCollection"),
  query: vi.fn(() => "mockQuery"),
  where: vi.fn(() => "mockWhere"),
  orderBy: vi.fn(() => "mockOrderBy"),
  getDocs: vi.fn(() =>
    Promise.resolve({
      docs: [
        {
          id: "1",
          data: () => ({
            word: "apple",
            meaning: "リンゴ",
            memorized: false,
          }),
        },
      ],
    })
  ),
  addDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  doc: vi.fn(() => "mockDoc"),
  Timestamp: {
    fromDate: vi.fn(() => "mockTimestamp"),
  },
}));
