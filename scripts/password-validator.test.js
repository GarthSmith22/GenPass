const { test } = require("node:test");
const assert = require("node:assert/strict");
const { isValid } = require("./password-validator");

test("combined raw word length under 15 is not valid", () => {
  // "name"(4) + "model"(5) + "key"(3) = 12
  assert.equal(isValid("N@m4M0d4lK4y", ["name", "model", "key"]), false);
});

test("combined raw word length exactly 14 is not valid", () => {
  // 14 chars total
  assert.equal(isValid("Abcd@Efghi$Jkl", ["abcd", "efghi", "jkl"]), false);
});

test("combined raw word length exactly 15 satisfies the length criterion", () => {
  // "elephant"(8) + "stone"(5) + "two"(2) = 15
  assert.equal(isValid("El4ph@ntSt0n4Tw0", ["elephant", "stone", "two"]), true);
});

test("candidate without a special character is not valid (length alone is not enough)", () => {
  // "rhythm"(6) + "crypt"(5) + "lymph"(5) = 16 raw chars, but no @, _ or $
  assert.equal(isValid("RhythmCryptLymph", ["rhythm", "crypt", "lymph"]), false);
});

test("number characters alone (4, 1, 0) do not satisfy the special character requirement", () => {
  // raw length >= 15, but only numbers in candidate
  assert.equal(
    isValid("M0d4lFr14ndBr0th4r", ["model", "friend", "brother"]),
    false,
  );
});

test("a candidate containing '@' satisfies the special character requirement", () => {
  assert.equal(
    isValid("El4ph@ntM0_nt@1nR1v4r", ["elephant", "mountain", "river"]),
    true,
  );
});

test("a candidate containing '_' satisfies the special character requirement", () => {
  // need raw length >= 15 to isolate the special-char check
  // "auntie"(6) + "kettle"(6) + "river"(5) = 17
  assert.equal(isValid("A_nt14K4ttl4R1v4r", ["auntie", "kettle", "river"]), true);
});

test("a candidate containing '$' satisfies the special character requirement", () => {
  // "session"(7) + "kettle"(6) + "two"(2) = 15
  assert.equal(isValid("S4$$10nK4ttl4Tw0", ["session", "kettle", "two"]), true);
});

test("both criteria must be satisfied simultaneously", () => {
  // length ok, special ok
  assert.equal(
    isValid("El4ph@ntM0_nt@1nR1v4r", ["elephant", "mountain", "river"]),
    true,
  );
  // length fail, special ok
  assert.equal(isValid("N@m4M0d4lK4y", ["name", "model", "key"]), false);
  // length ok, special fail
  assert.equal(isValid("RhythmCryptLymph", ["rhythm", "crypt", "lymph"]), false);
});
