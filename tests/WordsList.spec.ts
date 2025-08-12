import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import  WordsList from "~/composables/WordsList.vue";

vi.mock("~/lib/firebase", () => {
  return {
    db: {},
    collection: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn((...args) => args),
    where: vi.fn((...args) => args),
    orderBy: vi.fn((...args) => args),
    Timestamp: {
      fromDate: vi.fn(),
    },
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    updateDoc: vi.fn(),
  };
});

vi.mock("~/composables/useAuth", () => {
  return {
    useAuth: () => ({
      user: { value: { uid: "test-user" } },
    }),
  };
});

vi.mock("~/composables/useWords", () => {
  return {
    useWords: () => ({
      words: [
        { id: "1", text: "hello", meaning: "こんにちは" },
        { id: "2", text: "world", meaning: "世界" },
      ],
    }),
  };
});

describe("WordsList", () => {
  it("matches DOM snapshot", () => {
    const wrapper = mount(WordsList);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
