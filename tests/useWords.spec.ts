import { useWords } from "~/composables/useWords";

describe("useWords", () => {
  it("loads words", async () => {
    const { loadWords, words } = useWords();
    await loadWords();
    expect(words.value.length).toBe(1);
    expect(words.value[0].text).toBe("apple");
  });
});
