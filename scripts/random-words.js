// Usage: node scripts/random-words.js
// Prints 3 random English words from the default Random Word Provider, one per line.

const provider = require("./random-word-generator-com-provider");

(async () => {
  try {
    const words = await provider.getWords();
    for (const word of words) console.log(word);
  } catch (error) {
    console.error(error.message ?? String(error));
    process.exit(1);
  }
})();
