import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { AppSettings, IdentityProfile, LogEntry, Recipe, SourceMapping, UserIngredient } from "../domain/models";

const DB_NAME = "axiom-web-local";
const DB_VERSION = 1;

interface AxiomWebDb extends DBSchema {
  settings: {
    key: string;
    value: AppSettings;
  };
  logs: {
    key: string;
    value: LogEntry;
    indexes: { "by-timestamp": string; "by-logHash": string };
  };
  recipes: {
    key: string;
    value: Recipe;
    indexes: { "by-createdAt": string };
  };
  ingredients: {
    key: string;
    value: UserIngredient;
    indexes: { "by-updatedAt": string };
  };
  identities: {
    key: string;
    value: IdentityProfile;
  };
  sourceMappings: {
    key: string;
    value: SourceMapping;
  };
}

let dbPromise: Promise<IDBPDatabase<AxiomWebDb>> | null = null;

export function defaultSettings(): AppSettings {
  return {
    activationComplete: false,
    appInstanceId: crypto.randomUUID(),
    activeIdentityId: "default",
    activeIdentityName: "Default",
    preferredStoreName: null,
    preferredUnit: "grams",
    autoConnectEnabled: false,
    zeroWeightReviewEnabled: true,
    zeroWeightYellowIndicatorEnabled: true,
    genericReviewEnabled: true,
    genericWeekRefinementEnabled: true,
    genericYellowIndicatorEnabled: true,
    fatButtonItemId: "fd_butter",
    fatButtonItemName: "Butter",
    fatButtonFixed: true,
    fatButtonGrams: 20,
    passiveQuickLogItems: [],
  };
}

export function defaultIdentity(): IdentityProfile {
  return {
    identityId: "default",
    identityName: "Default",
    profileType: "primary",
    zeroWeightReviewEnabled: true,
    zeroWeightYellowIndicatorEnabled: true,
    genericReviewEnabled: true,
    genericWeekRefinementEnabled: true,
  };
}

async function db(): Promise<IDBPDatabase<AxiomWebDb>> {
  dbPromise ??= openDB<AxiomWebDb>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      database.createObjectStore("settings");
      const logs = database.createObjectStore("logs", { keyPath: "id" });
      logs.createIndex("by-timestamp", "timestamp");
      logs.createIndex("by-logHash", "logHash", { unique: true });
      const recipes = database.createObjectStore("recipes", { keyPath: "id" });
      recipes.createIndex("by-createdAt", "createdAt");
      const ingredients = database.createObjectStore("ingredients", { keyPath: "id" });
      ingredients.createIndex("by-updatedAt", "updatedAt");
      database.createObjectStore("identities", { keyPath: "identityId" });
      database.createObjectStore("sourceMappings", { keyPath: "sourceKey" });
    },
  });
  return dbPromise;
}

export async function getSettings(): Promise<AppSettings> {
  const database = await db();
  const existing = await database.get("settings", "app");
  if (existing) return existing;
  const created = defaultSettings();
  await database.put("settings", created, "app");
  return created;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const database = await db();
  await database.put("settings", settings, "app");
}

export async function getLogs(): Promise<LogEntry[]> {
  const database = await db();
  const logs = await database.getAllFromIndex("logs", "by-timestamp");
  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function upsertLog(entry: LogEntry): Promise<void> {
  const database = await db();
  await database.put("logs", entry);
}

export async function deleteLog(entryId: string): Promise<void> {
  const database = await db();
  await database.delete("logs", entryId);
}

export async function getRecipes(): Promise<Recipe[]> {
  const database = await db();
  const recipes = await database.getAllFromIndex("recipes", "by-createdAt");
  return recipes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getIngredients(): Promise<UserIngredient[]> {
  const database = await db();
  const ingredients = await database.getAllFromIndex("ingredients", "by-updatedAt");
  return ingredients.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function upsertIngredient(ingredient: UserIngredient): Promise<void> {
  const database = await db();
  await database.put("ingredients", ingredient);
}

export async function deleteIngredient(ingredientId: string): Promise<void> {
  const database = await db();
  await database.delete("ingredients", ingredientId);
}

export async function getIdentities(): Promise<IdentityProfile[]> {
  const database = await db();
  const identities = await database.getAll("identities");
  if (identities.length > 0) return identities.sort((a, b) => (a.profileType === "primary" ? -1 : b.profileType === "primary" ? 1 : a.identityName.localeCompare(b.identityName)));
  const created = defaultIdentity();
  await database.put("identities", created);
  return [created];
}

export async function upsertIdentity(identity: IdentityProfile): Promise<void> {
  const database = await db();
  await database.put("identities", identity);
}

export async function deleteIdentity(identityId: string): Promise<void> {
  const database = await db();
  await database.delete("identities", identityId);
}

export async function getSourceMappings(): Promise<SourceMapping[]> {
  return (await db()).getAll("sourceMappings");
}

export async function upsertSourceMapping(mapping: SourceMapping): Promise<void> {
  await (await db()).put("sourceMappings", mapping);
}

export async function upsertRecipe(recipe: Recipe): Promise<void> {
  const database = await db();
  await database.put("recipes", recipe);
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  const database = await db();
  await database.delete("recipes", recipeId);
}

export async function resetLocalData(): Promise<void> {
  const database = await db();
  await Promise.all([database.clear("logs"), database.clear("recipes"), database.clear("ingredients"), database.clear("identities"), database.clear("sourceMappings")]);
  await saveSettings(defaultSettings());
  await database.put("identities", defaultIdentity());
}

export async function replaceAllData(payload: {
  settings: AppSettings;
  logs: LogEntry[];
  recipes: Recipe[];
  ingredients: UserIngredient[];
  identities: IdentityProfile[];
  sourceMappings: SourceMapping[];
}): Promise<void> {
  const database = await db();
  const tx = database.transaction(["settings", "logs", "recipes", "ingredients", "identities", "sourceMappings"], "readwrite");
  await Promise.all([tx.objectStore("logs").clear(), tx.objectStore("recipes").clear(), tx.objectStore("ingredients").clear(), tx.objectStore("identities").clear(), tx.objectStore("sourceMappings").clear()]);
  await tx.objectStore("settings").put(payload.settings, "app");
  await Promise.all(payload.logs.map((entry) => tx.objectStore("logs").put(entry)));
  await Promise.all(payload.recipes.map((recipe) => tx.objectStore("recipes").put(recipe)));
  await Promise.all(payload.ingredients.map((ingredient) => tx.objectStore("ingredients").put(ingredient)));
  await Promise.all(payload.identities.map((identity) => tx.objectStore("identities").put(identity)));
  await Promise.all(payload.sourceMappings.map((mapping) => tx.objectStore("sourceMappings").put(mapping)));
  await tx.done;
}
