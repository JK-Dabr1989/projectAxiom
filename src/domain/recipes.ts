import type { LogEntry, Recipe } from "./models";

export function recipePortionLogs(recipe: Recipe, portionGrams: number, date: string, identityId: string, identityName: string, mealLabel: string): LogEntry[] {
  const totalRecipeGrams = recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.grams, 0);
  if (totalRecipeGrams <= 0 || portionGrams <= 0) return [];
  const timestamp = `${date}T${new Date().toTimeString().slice(0, 8)}`;
  return recipe.ingredients.map((ingredient) => {
    const scaledGrams = (ingredient.grams / totalRecipeGrams) * portionGrams;
    return {
      id: crypto.randomUUID(),
      foodId: ingredient.foodId,
      grams: Math.round(scaledGrams * 10) / 10,
      timestamp,
      source: "MANUAL",
      zeroWeightFlag: false,
      identityId,
      identityName,
      mealLabelOverride: mealLabel,
      scaleRecipeId: recipe.id,
      scaleRecipeName: recipe.name,
      scaleIntakeEvent: true,
      originalFoodId: ingredient.foodId,
      identityResolutionState: "RESOLVED",
      identitySource: "EXPLICIT",
      logHash: null,
    };
  });
}
