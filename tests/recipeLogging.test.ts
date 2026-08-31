import { describe, expect, it, vi } from "vitest";
import type { Recipe } from "../src/domain/models";
import { recipePortionLogs } from "../src/domain/recipes";

describe("recipe portion logging", () => {
  it("creates manual ingredient logs scaled by recipe proportions", () => {
    vi.stubGlobal("crypto", { randomUUID: vi.fn(() => "log-id") });
    const recipe: Recipe = {
      id: "recipe-1",
      name: "Bowl",
      type: "SINGLE",
      mealLabel: "lunch",
      iconName: "",
      ingredients: [
        { foodId: "fd_rice", grams: 200 },
        { foodId: "fd_chicken", grams: 100 },
      ],
      createdAt: "2026-08-31T10:00:00",
    };
    const logs = recipePortionLogs(recipe, 150, "2026-08-31", "default", "Default", "lunch");
    expect(logs.map((entry) => entry.grams)).toEqual([100, 50]);
    expect(logs.every((entry) => entry.source === "MANUAL")).toBe(true);
    expect(logs.every((entry) => entry.scaleRecipeName === "Bowl")).toBe(true);
    vi.unstubAllGlobals();
  });
});
