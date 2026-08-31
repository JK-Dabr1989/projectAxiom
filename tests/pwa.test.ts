import { describe, expect, it, vi } from "vitest";
import { registerServiceWorker } from "../src/pwa";

describe("PWA registration", () => {
  it("does not throw when service workers are unavailable", () => {
    expect(() => registerServiceWorker(vi.fn())).not.toThrow();
  });
});
