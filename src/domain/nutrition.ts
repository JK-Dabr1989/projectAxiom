import type { FoodCatalogItem, MacroValues, Recipe, RecipeIngredient } from "./models";

export const emptyMacros = (): MacroValues => ({ kcal: 0, carbs: 0, fat: 0, protein: 0 });

export function addMacros(a: MacroValues, b: MacroValues): MacroValues {
  return {
    kcal: a.kcal + b.kcal,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
    protein: a.protein + b.protein,
  };
}

export function scaleMacros(per100g: MacroValues, grams: number): MacroValues {
  const multiplier = grams / 100;
  return {
    kcal: per100g.kcal * multiplier,
    carbs: per100g.carbs * multiplier,
    fat: per100g.fat * multiplier,
    protein: per100g.protein * multiplier,
  };
}

export function roundMacros(macros: MacroValues): MacroValues {
  return {
    kcal: Math.round(macros.kcal * 10) / 10,
    carbs: Math.round(macros.carbs * 10) / 10,
    fat: Math.round(macros.fat * 10) / 10,
    protein: Math.round(macros.protein * 10) / 10,
  };
}

export function macrosPer100g(food: FoodCatalogItem): MacroValues {
  return {
    kcal: food.kcal100g,
    carbs: food.carbs100g,
    fat: food.fat100g,
    protein: food.protein100g,
  };
}

export function macrosForFood(food: FoodCatalogItem, grams: number): MacroValues {
  return roundMacros(scaleMacros(macrosPer100g(food), grams));
}

export function recipeTotals(recipe: Recipe, foodsById: Map<string, FoodCatalogItem>): MacroValues {
  return roundMacros(
    recipe.ingredients.reduce((total, ingredient) => addMacros(total, ingredientMacros(ingredient, foodsById)), emptyMacros()),
  );
}

export function ingredientMacros(ingredient: RecipeIngredient, foodsById: Map<string, FoodCatalogItem>): MacroValues {
  const food = foodsById.get(ingredient.foodId);
  return food ? scaleMacros(macrosPer100g(food), ingredient.grams) : emptyMacros();
}
