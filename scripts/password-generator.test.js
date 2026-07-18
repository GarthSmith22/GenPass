const { test } = require("node:test");
const assert = require("node:assert/strict");
const { generate } = require("./password-generator");

function stubProvider(responses) {
  let i = 0;
  const calls = [];
  const provider = {
    getWords: async () => {
      calls.push(i);
      if (i >= responses.length) {
        throw new Error(`stubProvider exhausted after ${i} calls`);
      }
      const response = responses[i++];
      if (response instanceof Error) throw response;
      return response;
    },
    callCount: () => i,
  };
  return provider;
}

test("returns the password candidate when the first attempt is valid", async () => {
  const provider = stubProvider([["elephant", "mountain", "river"]]);
  const result = await generate(provider);
  assert.equal(result.password, "El4ph@ntM0_nt@1nR1v4r");
  assert.deepEqual(result.words, ["elephant", "mountain", "river"]);
  assert.equal(provider.callCount(), 1);
});

test("retries when combined raw word length is under 15", async () => {
  const provider = stubProvider([
    ["name", "model", "key"], // 12 raw chars — too short
    ["elephant", "mountain", "river"],
  ]);
  const result = await generate(provider);
  assert.equal(result.password, "El4ph@ntM0_nt@1nR1v4r");
  assert.deepEqual(result.words, ["elephant", "mountain", "river"]);
  assert.equal(provider.callCount(), 2);
});

test("retries when candidate has no special character", async () => {
  const provider = stubProvider([
    ["rhythm", "crypt", "lymph"], // 16 raw chars, no @/_/$
    ["elephant", "mountain", "river"],
  ]);
  const result = await generate(provider);
  assert.equal(result.password, "El4ph@ntM0_nt@1nR1v4r");
  assert.deepEqual(result.words, ["elephant", "mountain", "river"]);
  assert.equal(provider.callCount(), 2);
});

test("error on the first provider call propagates immediately", async () => {
  const boom = new Error("network down");
  const provider = stubProvider([boom]);
  await assert.rejects(() => generate(provider), /network down/);
  assert.equal(provider.callCount(), 1);
});

test("error on a retry provider call propagates immediately (no swallow)", async () => {
  const boom = new Error("network down on retry");
  const provider = stubProvider([
    ["name", "model", "key"], // invalid → triggers retry
    boom,
  ]);
  await assert.rejects(() => generate(provider), /network down on retry/);
  assert.equal(provider.callCount(), 2);
});

test("retries multiple times until a valid password is produced", async () => {
  const provider = stubProvider([
    ["name", "model", "key"],
    ["rhythm", "crypt", "lymph"],
    ["name", "model", "key"],
    ["elephant", "mountain", "river"],
  ]);
  const result = await generate(provider);
  assert.equal(result.password, "El4ph@ntM0_nt@1nR1v4r");
  assert.deepEqual(result.words, ["elephant", "mountain", "river"]);
  assert.equal(provider.callCount(), 4);
});
