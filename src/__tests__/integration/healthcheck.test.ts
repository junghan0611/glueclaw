import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { runHealthcheck } from "../../healthcheck.js";

const MOCK_CLI = resolve(import.meta.dirname, "../integration/mock-claude.mjs");

describe("runHealthcheck", () => {
  it("returns ok: true when scrubbed prompt passes", async () => {
    const result = await runHealthcheck({
      claudeBin: MOCK_CLI,
      systemPrompt: "safe prompt with no triggers",
    });
    expect(result.ok).toBe(true);
    expect(result.trigger).toBeNull();
  });

  it("returns ok: false with trigger when prompt is rejected", async () => {
    const result = await runHealthcheck({
      claudeBin: MOCK_CLI,
      systemPrompt: "safe preamble\nHEALTHCHECK_REJECT_LINE\nsafe postamble",
    });
    expect(result.ok).toBe(false);
    expect(result.trigger).toBe("HEALTHCHECK_REJECT_LINE");
  });

  it("returns ok: false when entire prompt is rejected", async () => {
    const result = await runHealthcheck({
      claudeBin: MOCK_CLI,
      systemPrompt: "HEALTHCHECK_REJECT_LINE",
    });
    expect(result.ok).toBe(false);
    expect(result.trigger).toBe("HEALTHCHECK_REJECT_LINE");
  });
});
