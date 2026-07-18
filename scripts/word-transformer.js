const LEET_SUBSTITUTIONS = {
  a: "@",
  e: "4",
  i: "1",
  o: "0",
  u: "_",
  s: "$",
};

function transform(word) {
  const stripped = word.replace(/[^A-Za-z]/g, "");
  if (stripped.length === 0) return "";

  const firstLetter = stripped[0].toUpperCase();
  let result = firstLetter;
  for (let i = 1; i < stripped.length; i++) {
    const ch = stripped[i];
    result += LEET_SUBSTITUTIONS[ch] ?? ch;
  }
  return result;
}

function capitalize(word) {
  if (word.length === 0) return "";
  return word[0].toUpperCase() + word.slice(1);
}

module.exports = { transform, capitalize };
