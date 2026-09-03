import { describe, expect, it } from "vitest";
import type { FoodCatalogItem, IdentityProfile, PassiveQuickLogItem, Recipe } from "../src/domain/models";
import {
  DEFAULT_GENERIC_FOODS,
  TOKEN_CATEGORY_METADATA,
  WRITE_TOKENS_SCREEN_ID,
  addTokenToQueue,
  currentSessionItem,
  failCurrentToken,
  foodTokenDefinition,
  identityTokenDefinition,
  isIntentionalWriterTokenType,
  isTopLevelWriterTokenType,
  markCurrentWritten,
  moveQueueItem,
  quickLogFoodTokenDefinition,
  quickLogRecipeTokenDefinition,
  recipeTokenDefinition,
  removeQueueItem,
  retryCurrentToken,
  shortcutTokenDefinition,
  skipCurrentToken,
  startWritingSession,
  tokenPreviewSummary,
  type TokenWriteQueueItem,
} from "../src/domain/tokenWriting";
import { searchFoods } from "../src/data/foodService";

describe("token writing domain", () => {
  it("adds mixed token types to one queue", () => {
    const queue = [
      foodTokenDefinition(food("fd_chicken", "Chicken breast")),
      recipeTokenDefinition(recipe, foodsById),
      identityTokenDefinition(identity),
      shortcutTokenDefinition(shortcut),
      foodTokenDefinition(food("generic:butter", "Generic butter")),
    ].reduce<TokenWriteQueueItem[]>((items, definition, index) => addTokenToQueue(items, definition, `q${index}`), []);

    expect(queue.map((item) => item.tokenType)).toEqual(["ingredient", "recipe", "identity", "shortcut", "generic"]);
    expect(queue).toHaveLength(5);
    expect(queue.every((item) => item.status === "queued")).toBe(true);
  });

  it("removes and reorders queue items predictably", () => {
    const first = addTokenToQueue([], foodTokenDefinition(food("fd_a", "A")), "a");
    const second = addTokenToQueue(first, foodTokenDefinition(food("fd_b", "B")), "b");
    const third = addTokenToQueue(second, foodTokenDefinition(food("fd_c", "C")), "c");

    expect(moveQueueItem(third, "c", -1).map((item) => item.id)).toEqual(["a", "c", "b"]);
    expect(moveQueueItem(third, "a", -1).map((item) => item.id)).toEqual(["a", "b", "c"]);
    expect(removeQueueItem(third, "b").map((item) => item.id)).toEqual(["a", "c"]);
  });

  it("prepares canonical SS1 payloads from entities", () => {
    expect(foodTokenDefinition(food("fd_butter", "Butter")).payload).toBe("SS1|type=ingredient|id=fd_butter|name=Butter");
    expect(identityTokenDefinition(identity).payload).toBe("SS1|type=identity|identity_id=identity_jack|identity_name=Jack");
    expect(shortcutTokenDefinition(shortcut).payload).toBe("SS1|payload_version=ss1-v4|type=shortcut|token_type=ingredient|reference_id=shortcut_coffee|display_name=Morning coffee|default_grams=250");
    expect(quickLogFoodTokenDefinition(food("fd_butter", "Butter"), 15).payload).toBe("SS1|payload_version=ss1-v4|type=shortcut|token_type=ingredient|reference_id=fd_butter|display_name=Butter|default_grams=15");
    expect(quickLogRecipeTokenDefinition(recipe, 150).payload).toBe("SS1|payload_version=ss1-v4|type=shortcut|token_type=recipe|reference_id=recipe:recipe_chilli|display_name=Family chilli|default_grams=150");
    expect(recipeTokenDefinition(recipe, foodsById).payload).toContain("SS1|type=recipe|id=recipe_chilli|name=Family chilli|steps=");
  });

  it("does not advance automatically after failure", () => {
    const session = startWritingSession(addTokenToQueue(addTokenToQueue([], foodTokenDefinition(food("fd_a", "A")), "a"), foodTokenDefinition(food("fd_b", "B")), "b"));
    const failed = failCurrentToken(session, "No token detected.");

    expect(currentSessionItem(failed)?.id).toBe("a");
    expect(currentSessionItem(failed)?.status).toBe("failed");
    expect(retryCurrentToken(failed).currentIndex).toBe(0);
  });

  it("advances on confirmed success, supports skip, and completes", () => {
    const queue = addTokenToQueue(addTokenToQueue([], foodTokenDefinition(food("fd_a", "A")), "a"), foodTokenDefinition(food("fd_b", "B")), "b");
    const session = startWritingSession(queue);
    const afterFirst = markCurrentWritten(session);
    const afterSkip = skipCurrentToken(afterFirst);

    expect(currentSessionItem(afterFirst)?.id).toBe("b");
    expect(afterSkip.mode).toBe("complete");
    expect(afterSkip.items.map((item) => item.status)).toEqual(["written", "skipped"]);
  });

  it("uses Write Tokens as the canonical token action target", () => {
    expect(WRITE_TOKENS_SCREEN_ID).toBe("writeTokens");
  });

  it("removes Quick-log from top-level writer categories", () => {
    expect(TOKEN_CATEGORY_METADATA.map((item) => item.tokenType)).toEqual(["ingredient", "recipe", "generic", "identity"]);
    expect(TOKEN_CATEGORY_METADATA.map((item) => item.emptyAction)).toEqual(["Create ingredient", "Create recipe", "Create generic token", "Add person"]);
    expect(isTopLevelWriterTokenType("shortcut")).toBe(false);
    expect(isIntentionalWriterTokenType("undefined")).toBe(false);
  });

  it("searches a combined bundled and custom food list for food tokens", () => {
    const bundled = food("fd_chicken", "Chicken breast");
    const custom = food("custom:protein_oats", "Protein oats");

    expect(searchFoods([bundled, custom], "protein")[0]?.food.id).toBe("custom:protein_oats");
    expect(searchFoods([bundled, custom], "chicken")[0]?.food.id).toBe("fd_chicken");
  });

  it("keeps an existing mixed queue when a created entity returns to the writer", () => {
    const existing = addTokenToQueue(addTokenToQueue([], foodTokenDefinition(food("fd_chicken", "Chicken")), "food"), identityTokenDefinition(identity), "identity");
    const createdRecipe = { ...recipe, id: "recipe_new", name: "New stew" };
    const next = addTokenToQueue(existing, recipeTokenDefinition(createdRecipe, foodsById), "created");

    expect(next.map((item) => item.id)).toEqual(["food", "identity", "created"]);
    expect(next[2].displayLabel).toBe("New stew");
  });

  it("previews token type meaning without raw protocol labels", () => {
    expect(tokenPreviewSummary(foodTokenDefinition(food("generic_03", "Generic 03")))).toBe("Generic food token");
    expect(tokenPreviewSummary(recipeTokenDefinition(recipe, foodsById))).toBe("Recipe workflow");
    expect(tokenPreviewSummary(quickLogFoodTokenDefinition(food("fd_coffee", "Coffee"), 250))).toBe("Quick log - 250 g");
  });

  it("ships standard generic foods and queues them as generic tokens", () => {
    expect(DEFAULT_GENERIC_FOODS.map((food) => food.displayName)).toEqual(["Pork", "Lamb", "Beef", "Chicken", "Fish"]);

    const queue = addTokenToQueue([], foodTokenDefinition(DEFAULT_GENERIC_FOODS[0]), "generic");
    expect(queue[0].tokenType).toBe("generic");
    expect(queue[0].sourceEntityId).toBe("generic_pork");
    expect(queue[0].behaviorLabel).toBe("Generic food token");
  });

  it("supports weighed food, quick-log food, recipe, identity, and generic in one mixed queue", () => {
    const queue = [
      foodTokenDefinition(food("fd_chicken", "Chicken breast")),
      quickLogFoodTokenDefinition(food("fd_butter", "Butter"), 15),
      recipeTokenDefinition(recipe, foodsById),
      identityTokenDefinition(identity),
      foodTokenDefinition(DEFAULT_GENERIC_FOODS[4]),
    ].reduce<TokenWriteQueueItem[]>((items, definition, index) => addTokenToQueue(items, definition, `mix${index}`), []);

    expect(queue.map((item) => item.behaviorLabel)).toEqual(["Weighed item", "Quick log - 15 g", "Recipe workflow", "Person switch token", "Generic food token"]);
  });
});

const identity: IdentityProfile = {
  identityId: "identity_jack",
  identityName: "Jack",
  profileType: "primary",
  zeroWeightReviewEnabled: true,
  zeroWeightYellowIndicatorEnabled: true,
  genericReviewEnabled: true,
  genericWeekRefinementEnabled: true,
};

const shortcut: PassiveQuickLogItem = {
  itemId: "shortcut_coffee",
  itemName: "Morning coffee",
  identityId: "identity_jack",
  identityName: "Jack",
  linkedFoodId: "fd_coffee",
  defaultGrams: 250,
  ingredients: [],
};

const recipe: Recipe = {
  id: "recipe_chilli",
  name: "Family chilli",
  type: "SINGLE",
  mealLabel: "dinner",
  iconName: "",
  ingredients: [
    { foodId: "fd_beans", grams: 200 },
    { foodId: "fd_tomato", grams: 150 },
  ],
  createdAt: "2026-09-02T12:00:00",
};

const foodsById = new Map([
  ["fd_beans", food("fd_beans", "Beans")],
  ["fd_tomato", food("fd_tomato", "Tomato")],
]);

function food(id: string, displayName: string): FoodCatalogItem {
  return {
    id,
    displayName,
    displayNameNormalized: displayName.toLowerCase(),
    productConcept: displayName,
    productConceptKey: displayName.toLowerCase(),
    brandName: "",
    brandNameNormalized: "",
    storeName: "",
    searchAnchor: displayName,
    stateCandidate: "",
    uxCategory: "",
    kcal100g: 100,
    protein100g: 10,
    fat100g: 2,
    carbs100g: 8,
    source: "test",
    sourceRank: 1,
    thumbnailLabel: displayName.slice(0, 2),
    tokens: [displayName.toLowerCase()],
    headTokens: [displayName.toLowerCase()],
  };
}
