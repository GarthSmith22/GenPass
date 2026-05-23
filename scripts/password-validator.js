const MINIMUM_RAW_LENGTH = 15;
const SPECIAL_CHARACTER_PATTERN = /[@_$]/;

function isValid(candidate, rawWords) {
  const combinedRawLength = rawWords.reduce(
    (total, word) => total + word.length,
    0,
  );
  if (combinedRawLength < MINIMUM_RAW_LENGTH) return false;
  return SPECIAL_CHARACTER_PATTERN.test(candidate);
}

module.exports = { isValid };
