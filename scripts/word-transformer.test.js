const { test } = require("node:test");
const assert = require("node:assert/strict");
const { transform } = require("./word-transformer");

test("substitutes lowercase 'a' with '@' after position 0", () => {
  assert.equal(transform("bad"), "B@d");
});

test("substitutes lowercase 'e' with '4' after position 0", () => {
  assert.equal(transform("bed"), "B4d");
});

test("substitutes lowercase 'i' with '1' after position 0", () => {
  assert.equal(transform("big"), "B1g");
});

test("substitutes lowercase 'o' with '0' after position 0", () => {
  assert.equal(transform("dog"), "D0g");
});

test("substitutes lowercase 'u' with '_' after position 0", () => {
  assert.equal(transform("bun"), "B_n");
});

test("substitutes lowercase 's' with '$' after position 0", () => {
  assert.equal(transform("bus"), "B_$");
});

test("first letter is capitalised and never substituted", () => {
  assert.equal(transform("key"), "K4y");
  assert.equal(transform("apple"), "Appl4");
  assert.equal(transform("egg"), "Egg");
});

test("uppercase letters after position 0 pass through unchanged", () => {
  assert.equal(transform("McDonald"), "McD0n@ld");
});

test("all-caps words pass through with only first-letter treatment", () => {
  assert.equal(transform("NATO"), "NATO");
});

test("non-alphabetic characters are stripped before transformation", () => {
  assert.equal(transform("mother-in-law"), "M0th4r1nl@w");
  assert.equal(transform("don't"), "D0nt");
});

test("words with no substitutable characters after the first letter pass through", () => {
  assert.equal(transform("rhythm"), "Rhythm");
});

test("multiple substitution rules apply within a single word", () => {
  assert.equal(transform("name"), "N@m4");
  assert.equal(transform("model"), "M0d4l");
  assert.equal(transform("pass"), "P@$$");
});

test("leading non-alphabetic characters are stripped before capitalising", () => {
  assert.equal(transform("'apple"), "Appl4");
});
