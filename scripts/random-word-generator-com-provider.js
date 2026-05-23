const WORDS_URL = "https://randomwordgenerator.com/json/words_ws.json";
const WORDS_PER_ATTEMPT = 3;

function stripNonAlphabetic(word) {
  return word.replace(/[^A-Za-z]/g, "");
}

async function getWords() {
  const response = await fetch(WORDS_URL);
  if (!response.ok) {
    throw new Error(
      `Random Word Provider request failed: HTTP ${response.status}`,
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new Error("Random Word Provider returned malformed JSON", { cause });
  }

  const entries = payload?.data;
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("Random Word Provider returned no words");
  }

  const words = [];
  for (let i = 0; i < WORDS_PER_ATTEMPT; i++) {
    const entry = entries[Math.floor(Math.random() * entries.length)];
    const rawValue = entry?.word?.value;
    if (typeof rawValue !== "string") {
      throw new Error("Random Word Provider returned malformed word entry");
    }
    const stripped = stripNonAlphabetic(rawValue);
    if (stripped.length === 0) {
      throw new Error(
        `Random Word Provider returned a word with no alphabetic characters: "${rawValue}"`,
      );
    }
    words.push(stripped);
  }
  return words;
}

module.exports = { getWords };
