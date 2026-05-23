// Usage: node scripts/genpass.js
// Prints a single valid password to stdout. On provider failure, writes the
// error message to stderr and exits with a non-zero code.

const { generate } = require("./password-generator");
const provider = require("./random-word-generator-com-provider");

(async () => {
  try {
    const password = await generate(provider);
    console.log(password);
  } catch (error) {
    console.error(error.message ?? String(error));
    process.exit(1);
  }
})();
