# GenPass — Acceptance Tests

Gherkin scenarios covering all password-generation requirements.
Terms used here match the ubiquitous language defined in `CONTEXT.md`.

---

## Feature: Word Transformation

> Rules for converting a single source word into its transformed form.

```gherkin
Feature: Word Transformation

  Scenario: First letter is capitalised and never substituted
    Given the source word is "key"
    When the word transformation is applied
    Then the result is "K4y"

  Scenario: Lowercase vowels after the first letter are substituted with number characters
    Given the source word is "model"
    When the word transformation is applied
    Then the result is "M0d4l"

  Scenario: Lowercase 'a' is substituted with '@'
    Given the source word is "name"
    When the word transformation is applied
    Then the result is "N@m4"

  Scenario: Lowercase 's' is substituted with '$'
    Given the source word is "pass"
    When the word transformation is applied
    Then the result is "P@$$"

  Scenario: All six substitution rules are applied in a single word
    Given the source word is "abusive"
    When the word transformation is applied
    Then the result is "A_$1v4"

  Scenario: Uppercase letters after the first position are never substituted
    Given the source word is "McDonald"
    When the word transformation is applied
    Then the result is "McD0n@ld"

  Scenario: An all-caps word passes through with only the first letter treatment
    Given the source word is "NATO"
    When the word transformation is applied
    Then the result is "NATO"

  Scenario: Non-alphabetic characters are stripped before transformation
    Given the source word is "mother-in-law"
    When the word transformation is applied
    Then the result is "M0th4r1nl@w"

  Scenario: A word with no substitutable characters after the first letter produces no special or number characters
    Given the source word is "rhythm"
    When the word transformation is applied
    Then the result is "Rhythm"
```

---

## Feature: Password Candidate Assembly

> Rules for assembling three transformed words into a password candidate.

```gherkin
Feature: Password Candidate Assembly

  Scenario: Three transformed words are concatenated with no separator
    Given the source words are "name", "model", "key"
    When the word transformation is applied to each word
    Then the password candidate is "N@m4M0d4lK4y"

  Scenario: The combined raw word length is measured before transformation
    Given the source words are "name", "model", "key"
    Then the combined raw word length is 12
    # Note: this candidate would fail the 15-character minimum and trigger a retry
```

---

## Feature: Password Validity

> Criteria that must both be satisfied for a password candidate to be a valid password.

```gherkin
Feature: Password Validity

  Scenario: A candidate with combined raw word length under 15 is not a valid password
    Given the source words are "name", "model", "key"
    Then the combined raw word length is 12
    And the candidate "N@m4M0d4lK4y" is not a valid password

  Scenario: A candidate with combined raw word length of exactly 15 satisfies the length criterion
    Given the source words are "elephant", "stone", "two"
    Then the combined raw word length is 15
    # "elephant"=8, "stone"=5, "two"=2 — passes length check

  Scenario: A candidate without a special character is not a valid password
    Given the source words are "rhythm", "crypt", "lymph"
    When the word transformation is applied to each word
    Then the password candidate is "RhythmCryptLymph"
    And the candidate contains no special character
    And the candidate is not a valid password
    # Combined raw length = 16, passes length check, but no @, _ or $ present

  Scenario: Number characters (4, 1, 0) alone do not make a password valid
    Given a password candidate contains "4", "1", and "0" but none of "@", "_", or "$"
    Then the candidate is not a valid password

  Scenario: A candidate meeting both criteria is a valid password
    Given the source words are "elephant", "mountain", "river"
    When the word transformation is applied to each word
    Then the password candidate is "El4ph@ntM0_nt@1nR1v4r"
    And the combined raw word length is 21
    And the candidate contains the special character "@"
    And the candidate is a valid password
```

---

## Feature: Generation Loop

> Retry logic — the loop runs until a valid password is produced.

```gherkin
Feature: Generation Loop

  Scenario: A valid password is output to stdout on the first attempt
    Given the provider returns "elephant", "mountain", "river"
    When a password is generated
    Then "El4ph@ntM0_nt@1nR1v4r" is printed to stdout

  Scenario: A candidate failing the length check triggers a new generation attempt
    Given the provider returns "name", "model", "key" on the first attempt
    And the provider returns "elephant", "mountain", "river" on the second attempt
    When a password is generated
    Then the first candidate "N@m4M0d4lK4y" is discarded
    And "El4ph@ntM0_nt@1nR1v4r" is printed to stdout

  Scenario: A candidate with no special character triggers a new generation attempt
    Given the provider returns "rhythm", "crypt", "lymph" on the first attempt
    And the provider returns "elephant", "mountain", "river" on the second attempt
    When a password is generated
    Then the first candidate "RhythmCryptLymph" is discarded
    And "El4ph@ntM0_nt@1nR1v4r" is printed to stdout

  Scenario: The loop retries indefinitely until both validity criteria are met
    Given the provider returns invalid candidates on the first 10 attempts
    And the provider returns "elephant", "mountain", "river" on the 11th attempt
    When a password is generated
    Then "El4ph@ntM0_nt@1nR1v4r" is printed to stdout

  Scenario: Only one password is printed regardless of how many attempts were needed
    Given the provider requires multiple attempts before producing a valid password
    When a password is generated
    Then exactly one line is printed to stdout
```

---

## Feature: Error Handling

> The generation loop exits immediately on provider failure; errors are never silently swallowed.

```gherkin
Feature: Error Handling

  Scenario: A provider network failure exits with a non-zero code and reports to stderr
    Given the provider throws a network error "Network request failed"
    When a password is generated
    Then the process exits with a non-zero exit code
    And the error message is written to stderr
    And nothing is printed to stdout

  Scenario: A provider returning malformed data exits with a non-zero code and reports to stderr
    Given the provider returns a malformed response
    When a password is generated
    Then the process exits with a non-zero exit code
    And the error message is written to stderr

  Scenario: A word that is empty after stripping non-alphabetic characters is treated as a provider error
    Given the provider returns a word composed entirely of non-alphabetic characters
    When a password is generated
    Then the process exits with a non-zero exit code
    And the error message is written to stderr

  Scenario: A provider error during a retry attempt (not the first attempt) still exits immediately
    Given the provider returns an invalid candidate on the first attempt
    And the provider throws an error on the second attempt
    When a password is generated
    Then the process exits with a non-zero exit code
    And the error message is written to stderr
```
