// tests/setup.ts
import { vi } from "vitest";

// firebase/auth のモック
vi.mock("firebase/auth", () => {
  const mockUser = {
    displayName: "Test User",
    email: "test@example.com",
    photoURL: "https://example.com/photo.jpg",
    uid: "test-uid",
  };

  return {
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(mockUser); // 直ちに呼び出してログイン状態を模倣
    }),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    // 型エラーを避けるため、auth, provider も一応返す
    getAuth: vi.fn(() => ({})),
    GoogleAuthProvider: vi.fn(() => ({})),
  };
});

vi.mock("~/lib/firebase", () => {
  return {
    db: {},
    collection: vi.fn(() => {}),
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(async () => ({
      docs: [
        {
          id: "1",
          data: () => ({
            text: "apple",
            meaning: "りんご",
            userId: "test-uid",
          }),
        },
      ],
    })),
    orderBy: vi.fn(),
    where: vi.fn((...args) => args),
    query: vi.fn(),
    Timestamp: {
      fromDate: vi.fn(() => "mock-timestamp"),
    },
    updateDoc: vi.fn(),
    auth: {},
    provider: {},
  };
});
