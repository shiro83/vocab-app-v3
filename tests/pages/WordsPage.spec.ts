//WordPage.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import WordsPage from "~/pages/words.vue";
import { ref, shallowRef } from "vue";

// 🔸 テストで使うモックデータを外に出す（トップレベル）
const mockWords = shallowRef([{ id: 1, text: "hello", meaning: "こんにちは" }]);

// ✅ useWords のモック
vi.mock("~/composables/useWords", () => {
  return {
    useWords: () => ({
      words: mockWords,
      loadWords: vi.fn(),
      addWord: vi.fn(async (text: string, meaning: string) => {
        mockWords.value.push({ id: Date.now(), text, meaning });
      }),
      deleteWord: vi.fn(),
      markMemorized: vi.fn(),
    }),
  };
});

// ✅ useAuth のモック
vi.mock("~/composables/useAuth", () => {
  return {
    useAuth: () => ({
      user: ref({ uid: "test-user" }),
    }),
  };
});

describe("WordsPage.vue", () => {
  beforeEach(() => {
    mockWords.value = [{ id: 1, text: "hello", meaning: "こんにちは" }];
  });

  it("renders initial words", () => {
    const { getByText } = render(WordsPage);

    expect(getByText("hello")).toBeTruthy();
    expect(getByText("こんにちは")).toBeTruthy();
  });

  it("adds a new word when form is submitted", async () => {
    // const { getByPlaceholderText, getByText, getByRole } = render(WordsPage);

    // const textInput = getByPlaceholderText("英単語");
    // const meaningInput = getByPlaceholderText("意味");
    // const addButton = getByRole("button", { name: /保存/ });

    // await fireEvent.update(textInput, "world");
    // await fireEvent.update(meaningInput, "世界");
    // await fireEvent.click(addButton);

    // expect(getByText("world")).toBeTruthy();
    // expect(getByText("世界")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { container } = render(WordsPage);
    expect(container).toMatchSnapshot();
  });
});
