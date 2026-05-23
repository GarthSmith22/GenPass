# GenPass — Ubiquitous Language

## Glossary

### Special Character
One of `@`, `_`, or `$` — produced by leet-speak substitution of vowels/consonants.
A generated password is only considered valid if it contains at least one special character.

### Number Character
One of `4`, `1`, or `0` — produced by leet-speak substitution of vowels.
Not required for a password to be considered valid.

### Leet-Speak Substitution
The character-replacement rules applied to **lowercase** letters in a word *after* the first letter:
- `a` → `@`
- `e` → `4`
- `i` → `1`
- `o` → `0`
- `u` → `_`
- `s` → `$`

Uppercase letters after the first position are never substituted and pass through unchanged.
Example: "McDonald" → `McD0n@ld` (the `D` is left as-is; `o`→`0`, `a`→`@`).

### Word Capitalisation
The first letter of each source word is uppercased. All other letters retain their original casing from the source word. The first letter is never substituted. Source words are NOT lowercased before transformation — original casing is preserved.

### Source Word
A single English word returned by a Random Word Provider. Before any transformation, all non-alphabetic characters (hyphens, apostrophes, etc.) are stripped. Original casing is preserved. The stripped form is what is measured for the 15-character minimum and passed to leet-speak substitution.

### Random Word Provider
An adapter that abstracts the source of random words. Exposes a single operation: an async function `getWords()` that resolves to an array of three source words, or throws on failure. Concrete implementations can be swapped in without changing the password-generation logic. The current implementation fetches from `randomwordgenerator.com`.

### Password Candidate
The string produced by concatenating three capitalised, leet-speak-substituted source words.
A password candidate may or may not be valid.

### Valid Password
A password candidate that:
1. Has a combined raw source-word length (before any transformation) of at least 15 characters.
2. Contains at least one special character (`@`, `_`, or `$`).

### Generation Attempt
One full cycle: fetch three source words → apply word capitalisation and leet-speak substitution → evaluate whether the result is a valid password.
If the result is not a valid password, a new generation attempt begins.
If the word source fails (network error, malformed response, etc.) the loop terminates immediately and the error is reported to the user. No retry of the word source is performed.
