const { transform } = require("./word-transformer");
const { isValid } = require("./password-validator");

async function generate(provider) {
  while (true) {
    const rawWords = await provider.getWords();
    const candidate = rawWords.map(transform).join("");
    if (isValid(candidate, rawWords)) {
      return { password: candidate, words: rawWords };
    }
  }
}

module.exports = { generate };
