import { describe, expect, it } from "vitest";
import type { LogEntry, SourceMapping } from "../src/domain/models";
import { applyPassiveShortcutConfig, applySourceMappings, isUnknownUnresolved, isZeroWeightUnresolved, resolveUnknownEntry, resolveZeroWeight, sourceKeyForEntry } from "../src/domain/review";

const unresolved: LogEntry = {
  id: "evt_unknown_1",
  foodId: "unknown:token",
  grams: 0,
  timestamp: "2026-08-31T12:00:00",
  source: "SCALE",
  zeroWeightFlag: true,
  scaleItemName: "Mystery token",
  scaleEventType: "UNKNOWN",
  placeholderUnresolved: true,
  identityResolutionState: "PENDING",
  identitySource: "UNKNOWN",
};

describe("review resolution", () => {
  it("resolves zero-weight entries in place", () => {
    const corrected = resolveZeroWeight(unresolved, 75);
    expect(isZeroWeightUnresolved(unresolved)).toBe(true);
    expect(corrected.id).toBe(unresolved.id);
    expect(corrected.grams).toBe(75);
    expect(corrected.zeroWeightFlag).toBe(false);
  });

  it("maps unknown entries while preserving raw source identity", () => {
    const resolved = resolveUnknownEntry(unresolved, "fd_banana", "2026-08-31T13:00:00");
    expect(isUnknownUnresolved(unresolved)).toBe(true);
    expect(resolved.foodId).toBe("fd_banana");
    expect(resolved.placeholderUnresolved).toBe(false);
    expect(resolved.originalFoodId).toBe("unknown:token");
    expect(resolved.refinementScope).toBe("entry");
  });

  it("applies saved source mappings for repeat imports without duplicating ids", () => {
    const mapping: SourceMapping = {
      sourceKey: sourceKeyForEntry(unresolved)!,
      foodId: "fd_banana",
      displayName: "Banana",
      updatedAt: "2026-08-31T13:00:00",
    };
    const mapped = applySourceMappings(unresolved, [mapping]);
    expect(mapped.id).toBe(unresolved.id);
    expect(mapped.foodId).toBe("fd_banana");
    expect(mapped.placeholderUnresolved).toBe(false);
  });

  it("resolves passive shortcut imports through configured quick-log items", () => {
    const passive: LogEntry = { ...unresolved, foodId: "custom:abc", grams: 0, scaleEventType: "PASSIVE", zeroWeightFlag: true };
    const resolved = applyPassiveShortcutConfig(passive, [{
      itemId: "custom:abc",
      itemName: "Quick banana",
      identityId: "identity:a",
      identityName: "Alex",
      linkedFoodId: "passive:custom:abc",
      defaultGrams: 120,
      ingredients: [],
    }]);
    expect(resolved.foodId).toBe("passive:custom:abc");
    expect(resolved.grams).toBe(120);
    expect(resolved.identityName).toBe("Alex");
    expect(resolved.zeroWeightFlag).toBe(false);
  });
});
