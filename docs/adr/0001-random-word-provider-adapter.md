# ADR 0001 — Random Word Provider uses the Adapter pattern

**Status:** Accepted  
**Date:** 2026-05-23

## Context

The password generator needs three random source words per generation attempt. The initial implementation fetches them from `randomwordgenerator.com`. The owner anticipates wanting to swap in a different word source in future without touching the password-generation logic.

## Decision

Introduce a **Random Word Provider** adapter interface. The password-generation logic depends only on the interface (a function/object that returns three words or throws). Concrete implementations (e.g. `RandomWordGeneratorComProvider`) are passed in or resolved at startup.

`scripts/random-words.js` is refactored into a thin CLI wrapper around the default provider.

## Consequences

- Swapping word sources requires only a new provider module — no changes to generation logic.
- Adds one layer of indirection to an otherwise trivial fetch call.
- Tests can inject a stub provider without network access.
