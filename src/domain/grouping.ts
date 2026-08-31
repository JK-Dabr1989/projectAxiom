import type { FoodCatalogItem, LogEntry, LoggedFood, MealGroup } from "./models";
import { emptyMacros, macrosForFood } from "./nutrition";

const mealWindows: Array<[string, number, number]> = [
  ["breakfast", 5 * 60, 10 * 60 + 30],
  ["lunch", 11 * 60 + 30, 15 * 60],
  ["dinner", 17 * 60, 22 * 60],
];

export function inferMealLabel(timestamp: string): string {
  const date = new Date(timestamp);
  const minutes = date.getHours() * 60 + date.getMinutes();
  return mealWindows.find(([, start, end]) => minutes >= start && minutes <= end)?.[0] ?? "snacks";
}

export function displayMealLabel(value: string): string {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

export function loggedFood(entry: LogEntry, foodsById: Map<string, FoodCatalogItem>): LoggedFood {
  const food = foodsById.get(entry.foodId);
  const macros = food ? macrosForFood(food, entry.grams) : emptyMacros();
  const unresolved = Boolean(entry.placeholderUnresolved || !food);
  const reviewReasons = [
    ...(entry.zeroWeightFlag ? ["ZERO_WEIGHT"] : []),
    ...(unresolved ? ["UNKNOWN"] : []),
  ];
  return {
    entry,
    food,
    name: food?.displayName ?? entry.scaleItemName ?? entry.placeholderTokenLabel ?? "Unknown item",
    brandName: food?.brandName ?? "",
    mealLabel: entry.mealLabelOverride ?? inferMealLabel(entry.timestamp),
    macros,
    caloriesRounded: Math.round(macros.kcal),
    unresolvedPlaceholder: unresolved,
    reviewReasons,
  };
}

export function groupEntriesByMeal(entries: LogEntry[], foodsById: Map<string, FoodCatalogItem>): MealGroup[] {
  const logged = entries
    .slice()
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .map((entry) => loggedFood(entry, foodsById));
  const grouped = new Map<string, LoggedFood[]>();
  for (const item of logged) {
    const key = item.mealLabel;
    grouped.set(key, [...(grouped.get(key) ?? []), item]);
  }
  const order = ["breakfast", "lunch", "dinner", "snacks"];
  return [...grouped.entries()]
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([label, items]) => ({
      groupId: label,
      label: displayMealLabel(label),
      timeRangeLabel: timeRange(items.map((item) => item.entry.timestamp)),
      entries: items,
      kcalTotal: items.reduce((sum, item) => sum + item.caloriesRounded, 0),
      unresolvedCount: items.filter((item) => item.unresolvedPlaceholder).length,
      zeroWeightCount: items.filter((item) => item.entry.zeroWeightFlag).length,
    }));
}

export function entriesForDate(entries: LogEntry[], date: string): LogEntry[] {
  return entries.filter((entry) => entry.timestamp.slice(0, 10) === date);
}

function timeRange(timestamps: string[]): string {
  if (timestamps.length === 0) return "";
  const times = timestamps.map((value) => new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  return times.length === 1 ? times[0] : `${times[0]} - ${times[times.length - 1]}`;
}
