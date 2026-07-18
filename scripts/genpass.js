// Usage: node scripts/genpass.js
// Prints a single valid password to stdout, followed by the source words it
// was constructed from, e.g. "El4ph@ntS0ngUmbr4ll@ (ElephantSongUmbrella)".
// On provider failure, writes the error message to stderr and exits with a
// non-zero code.

const { generate } = require("./password-generator");
const { capitalize } = require("./word-transformer");
const provider = require("./random-word-generator-com-provider");

(async () => {
  try {
    const { password, words } = await generate(provider);
    const sourceWords = words.map(capitalize).join("");
    console.log(`${password} (${sourceWords})`);
  } catch (error) {
    console.error(error.message ?? String(error));
    process.exit(1);
  }
})();
