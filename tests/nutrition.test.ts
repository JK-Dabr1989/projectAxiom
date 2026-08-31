import { describe, expect, it } from "vitest";
import type { FoodCatalogItem, Recipe } from "../src/domain/models";
import { macrosForFood, recipeTotals } from "../src/domain/nutrition";

const banana: FoodCatalogItem = {
  id: "fd_banana",
  displayName: "Banana",
  displayNameNormalized: "banana",
  productConcept: "Banana",
  productConceptKey: "banana",
  brandName: "Generic",
  brandNameNormalized: "generic",
  storeName: "",
  searchAnchor: "banana",
  stateCandidate: "raw",
  uxCategory: "fruit",
  kcal100g: 89,
  protein100g: 1.1,
  fat100g: 0.3,
  carbs100g: 22.8,
  source: "test",
  sourceRank: 1,
  thumbnailLabel: "BA",
  tokens: ["banana"],
  headTokens: ["banana"],
};

describe("nutrition calculations", () => {
  it("scales Android-style per-100g macros by grams and rounds to one decimal", () => {
    expect(macrosForFood(banana, 125)).toEqual({
      kcal: 111.3,
      protein: 1.4,
      fat: 0.4,
      carbs: 28.5,
    });
  });

  it("totals recipe ingredient macros", () => {
    const recipe: Recipe = {
      id: "recipe-1",
      name: "Banana bowl",
      type: "SINGLE",
      mealLabel: "breakfast",
      iconName: "",
      ingredients: [{ foodId: "fd_banana", grams: 200 }],
      createdAt: "2026-08-31T08:00:00",
    };
    expect(recipeTotals(recipe, new Map([["fd_banana", banana]]))).toEqual({
      kcal: 178,
      protein: 2.2,
      fat: 0.6,
      carbs: 45.6,
    });
  });
});
