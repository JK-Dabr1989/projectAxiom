import { describe, expect, it } from "vitest";
import type { FoodCatalogItem, LogEntry } from "../src/domain/models";
import { groupEntriesByMeal, inferMealLabel } from "../src/domain/grouping";

const food: FoodCatalogItem = {
  id: "fd_test",
  displayName: "Test Food",
  displayNameNormalized: "test food",
  productConcept: "Test Food",
  productConceptKey: "test-food",
  brandName: "Generic",
  brandNameNormalized: "generic",
  storeName: "",
  searchAnchor: "test",
  stateCandidate: "raw",
  uxCategory: "test",
  kcal100g: 100,
  protein100g: 10,
  fat100g: 2,
  carbs100g: 5,
  source: "test",
  sourceRank: 1,
  thumbnailLabel: "TF",
  tokens: ["test"],
  headTokens: ["test"],
};

function entry(id: string, timestamp: string, grams = 100): LogEntry {
  return {
    id,
    foodId: "fd_test",
    grams,
    timestamp,
    source: "MANUAL",
    zeroWeightFlag: grams === 0,
    identityResolutionState: "RESOLVED",
    identitySource: "EXPLICIT",
  };
}

describe("meal grouping", () => {
  it("uses Android meal windows", () => {
    expect(inferMealLabel("2026-08-31T08:00:00")).toBe("breakfast");
    expect(inferMealLabel("2026-08-31T12:00:00")).toBe("lunch");
    expect(inferMealLabel("2026-08-31T18:00:00")).toBe("dinner");
    expect(inferMealLabel("2026-08-31T23:00:00")).toBe("snacks");
  });

  it("groups dated entries by meal with kcal totals", () => {
    const groups = groupEntriesByMeal([entry("a", "2026-08-31T08:00:00"), entry("b", "2026-08-31T08:30:00", 50)], new Map([["fd_test", food]]));
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe("Breakfast");
    expect(groups[0].kcalTotal).toBe(150);
  });
});
