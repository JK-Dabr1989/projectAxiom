import type { FoodCatalogItem, UserIngredient } from "../domain/models";

export interface FoodSearchResult {
  food: FoodCatalogItem;
  score: number;
}

export async function loadFoodCatalog(): Promise<FoodCatalogItem[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}food_catalog.json`);
  if (!response.ok) throw new Error("Unable to load bundled food catalog.");
  return response.json();
}

export function searchFoods(catalog: FoodCatalogItem[], query: string, preferredStore?: string | null): FoodSearchResult[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [];
  return catalog
    .map((food) => ({ food, score: scoreFood(food, terms, preferredStore) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.food.sourceRank - b.food.sourceRank || a.food.displayName.localeCompare(b.food.displayName))
    .slice(0, 60);
}

export function findFood(catalog: FoodCatalogItem[], foodId: string): FoodCatalogItem | undefined {
  return catalog.find((food) => food.id === foodId);
}

export function ingredientToCatalogItem(ingredient: UserIngredient): FoodCatalogItem {
  const normalized = ingredient.displayName.toLowerCase();
  return {
    id: ingredient.id,
    displayName: ingredient.displayName,
    displayNameNormalized: normalized,
    productConcept: ingredient.displayName,
    productConceptKey: normalized.replace(/\s+/g, "-"),
    brandName: ingredient.brandName,
    brandNameNormalized: ingredient.brandName.toLowerCase(),
    storeName: "",
    searchAnchor: ingredient.displayName,
    stateCandidate: ingredient.classification,
    uxCategory: ingredient.classification,
    iconName: ingredient.iconName,
    searchKey: normalized,
    anchorFood: normalized,
    searchGroup: ingredient.classification,
    kcal100g: ingredient.kcal100g,
    protein100g: ingredient.protein100g,
    fat100g: ingredient.fat100g,
    carbs100g: ingredient.carbs100g,
    source: ingredient.sourceKind,
    sourceRank: 0,
    thumbnailLabel: ingredient.displayName.slice(0, 2).toUpperCase(),
    tokens: normalized.split(/\s+/).filter(Boolean),
    headTokens: normalized.split(/\s+/).filter(Boolean).slice(0, 2),
  };
}

function scoreFood(food: FoodCatalogItem, terms: string[], preferredStore?: string | null): number {
  const haystack = [
    food.displayNameNormalized,
    food.displayName,
    food.productConcept,
    food.brandName,
    food.storeName,
    food.searchAnchor,
    food.searchKey,
    food.anchorFood,
    food.searchGroup,
    ...(food.tokens ?? []),
  ]
    .join(" ")
    .toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (food.displayNameNormalized === term || normalize(food.displayName) === term) score += 320;
    if (normalize(food.searchAnchor) === term || normalize(food.anchorFood ?? "") === term) score += 260;
    if (normalize(food.searchKey ?? "").startsWith(term)) score += 210;
    if (haystack.includes(term)) score += 60;
    if ((food.tokens ?? []).some((token) => token.startsWith(term))) score += 40;
  }
  if (food.isDefaultChoice) score += 80;
  score += (food.trackingImportance ?? 0) * 12;
  score += Math.round((food.trackingConfidence ?? 0) * 18);
  if (preferredStore && normalize(food.storeName) === normalize(preferredStore)) score += 140;
  if (food.brandName.toLowerCase() === "generic") score -= 30;
  return score;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
