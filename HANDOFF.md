# Handoff — GlueClaw Test Suite

**Date:** 2026-04-11
**Last commit:** `8fabb34` on `main`
**Status:** 50 tests passing, 2 skipped. Needs Max plan validation.

---

## What happened this session

We added a full vitest test suite to GlueClaw from scratch. The project had zero automated tests — everything was manual (documented in `docs/testing.md`).

### Source changes to production code

`src/stream.ts` was refactored for testability. **No behavioral changes:**

- Extracted `scrubPrompt(input: string): string` — the 6-rule detection trigger scrub chain that was inline in `createClaudeCliStreamFn`
- Extracted `unscrubResponse(text: string): string` — the 3-rule reverse translation that was inline in `endStream` and the streaming delta handler
- Added `export` to 5 previously-private functions: `buildUsage`, `buildMsg`, `getMcpLoopback`, `writeMcpConfig`, `persistSessions`
- The call sites in `createClaudeCliStreamFn` now call the extracted functions instead of inline replacements

### Test files created

```
src/__tests__/
├── unit/
│   ├── pure-functions.test.ts    # 32 tests — scrubPrompt, unscrubResponse, buildUsage, buildMsg, getMcpLoopback
│   └── filesystem.test.ts        # 5 tests  — writeMcpConfig create/cleanup/idempotent
├── integration/
│   ├── mock-claude.mjs           # Mock Claude CLI script (outputs NDJSON scenarios)
│   └── stream.test.ts            # 10 tests — createClaudeCliStreamFn with mock subprocess
└── e2e/
    ├── openclaw.test.ts           # 3 tests  — plugin registration, provider, agent smoke
    └── live-cli.test.ts           # 2 tests  — real Claude CLI (opt-in: RUN_LIVE_TESTS=1)
```

### Config files created/modified

- `vitest.config.ts` — test runner config, forks pool
- `package.json` — added vitest devDep, test scripts
- `tsconfig.json` — added vitest.config.ts to includes

---

## The auth gap — why this matters

GlueClaw is designed for **Claude Max plan** users. The key design decision is on `src/stream.ts:200`:

```typescript
const env = { ...process.env };
delete env.ANTHROPIC_API_KEY;      // ← Forces CLI to use Max plan OAuth
delete env.ANTHROPIC_API_KEY_OLD;
```

This session ran on a corporate Anthropic API key proxied through LiteLLM. That means:

| Test layer | Auth used | Tests `createClaudeCliStreamFn`? | Validated? |
|---|---|---|---|
| Unit (37) | None needed | No (pure functions) | Yes |
| Integration (10) | None (mock CLI) | Yes, with mock subprocess | Yes |
| OpenClaw E2E (3) | OpenClaw default | Indirectly | Yes |
| Live CLI E2E (2) | Direct `claude` call, API key intact | No, bypasses stream function | Partially |

**The untested path:** `createClaudeCliStreamFn` → real Claude CLI → real response. This path deletes `ANTHROPIC_API_KEY` from the subprocess env, which:
- **On Max plan:** Correct — CLI uses OAuth, works fine
- **On API key auth:** Breaks — CLI has no auth, returns "not logged in"

---

## What to do next (on a Max plan workstation)

### 1. Clone and install

```bash
git clone https://github.com/robinmordasiewicz/glueclaw.git
cd glueclaw
npm install
```

### 2. Verify existing tests pass

```bash
npm test                    # Should get 50 pass, 2 skipped (~15s)
npm run typecheck           # Should pass clean
```

### 3. Run live CLI tests

```bash
RUN_LIVE_TESTS=1 npm run test:e2e
```

These 2 tests call the real Claude CLI directly (not through `createClaudeCliStreamFn`). They should work on Max plan since the CLI uses OAuth natively.

### 4. Add the missing end-to-end test

Create a test that exercises the full production path:

```typescript
// src/__tests__/e2e/stream-live.test.ts
import { createClaudeCliStreamFn } from "../../stream.js";

it("createClaudeCliStreamFn produces response via Max plan auth", async () => {
  const streamFn = createClaudeCliStreamFn({
    sessionKey: `e2e-max-${Date.now()}`,
  });
  const stream = await streamFn(model, context, {});
  // ... collect events, verify response
});
```

This test will only pass on Max plan because `createClaudeCliStreamFn` deletes `ANTHROPIC_API_KEY`. This is the critical test that validates the production auth path.

### 5. Test session resume (multi-turn memory)

```typescript
it("resumes session across calls", async () => {
  const key = `e2e-resume-${Date.now()}`;
  // Call 1: "remember the word mango"
  // Call 2 with same key: "what word did I ask you to remember?"
  // Verify the second call uses --resume and returns "mango"
});
```

### 6. Install and test via OpenClaw

```bash
bash install.sh
export GLUECLAW_KEY=local
openclaw agent --agent main --message "say pong" 2>&1 | tail -1
# Expected: pong
```

---

## Gotchas discovered during testing

1. **OpenClaw suppresses all stdout when `VITEST=true`** is in the environment. The E2E tests strip `VITEST`, `VITEST_POOL_ID`, and `VITEST_WORKER_ID` from child process env to work around this.

2. **`spawnSync` stdout capture is broken in vitest's worker threads.** We use `pool: "forks"` in `vitest.config.ts`. Even with forks, `spawnSync` for some tools (like OpenClaw) returns empty stdout. The OpenClaw E2E tests use `spawnSync` with the VITEST env cleanup, which resolved it.

3. **Claude CLI SessionEnd hooks add 30-60s** to process exit time. The live CLI tests use `spawn` (async) instead of `spawnSync`, kill the process after receiving the `result` NDJSON event, and don't reject on stderr noise from hooks.

4. **`PROCESS_TIMEOUT_MS` is 5000ms** in `src/stream.ts:11`. This is the post-stream cleanup wait, not a response timeout. The actual response comes through the NDJSON readline interface with no timeout.

5. **Mock CLI is `.mjs` not `.ts`** (`src/__tests__/integration/mock-claude.mjs`) because vitest can run it directly as the `claudeBin` without needing tsx compilation.

---

## File inventory

```
package.json          — vitest in devDeps, 6 test scripts
vitest.config.ts      — forks pool, 30s default timeout
tsconfig.json         — includes vitest.config.ts
src/stream.ts         — exported pure functions, extracted scrub/unscrub
src/__tests__/        — all test files (listed above)
docs/testing.md       — original manual test procedures (still valid)
```

## npm scripts

```bash
npm test              # vitest run (all tests)
npm run test:watch    # vitest (watch mode)
npm run test:unit     # src/__tests__/unit only
npm run test:integration  # src/__tests__/integration only
npm run test:e2e      # src/__tests__/e2e only
npm run typecheck     # tsc --noEmit
```
