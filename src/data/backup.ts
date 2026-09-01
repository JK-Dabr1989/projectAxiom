import type { AppSettings, AxiomBackup, FoodPreference, IdentityProfile, LogEntry, Recipe, SourceMapping, UserIngredient } from "../domain/models";

export const BACKUP_VERSION = "axiom-web-backup-v1";

export function buildBackup(input: {
  settings: AppSettings;
  logs: LogEntry[];
  recipes: Recipe[];
  ingredients: UserIngredient[];
  identities: IdentityProfile[];
  sourceMappings: SourceMapping[];
  foodPreferences?: FoodPreference[];
  exportedAt?: string;
}): AxiomBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    data: {
      settings: input.settings,
      logs: input.logs,
      recipes: input.recipes,
      ingredients: input.ingredients,
      identities: input.identities,
      sourceMappings: input.sourceMappings,
      foodPreferences: input.foodPreferences ?? [],
    },
  };
}

export function decodeBackup(rawJson: string): AxiomBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error("Invalid JSON backup.");
  }
  if (!isRecord(parsed)) throw new Error("Backup root must be an object.");
  if (parsed.version !== BACKUP_VERSION) throw new Error(`Unsupported backup version: ${String(parsed.version)}`);
  if (!isRecord(parsed.data)) throw new Error("Backup is missing data.");
  for (const key of ["settings", "logs", "recipes", "ingredients", "identities", "sourceMappings"]) {
    if (!(key in parsed.data)) throw new Error(`Backup is missing required section: ${key}.`);
  }
  if (!Array.isArray(parsed.data.logs) || !Array.isArray(parsed.data.recipes) || !Array.isArray(parsed.data.ingredients) || !Array.isArray(parsed.data.identities) || !Array.isArray(parsed.data.sourceMappings)) {
    throw new Error("Backup data is incomplete or malformed.");
  }
  const backup = parsed as unknown as AxiomBackup;
  return { ...backup, data: { ...backup.data, foodPreferences: Array.isArray(backup.data.foodPreferences) ? backup.data.foodPreferences : [] } };
}

export function logsToCsv(logs: LogEntry[], foodName: (foodId: string) => string): string {
  const header = ["timestamp", "meal", "food_id", "food_name", "grams", "source", "identity", "zero_weight", "raw_scale_line"];
  const rows = logs.map((entry) => [
    entry.timestamp,
    entry.mealLabelOverride ?? "",
    entry.foodId,
    foodName(entry.foodId),
    entry.grams.toString(),
    entry.source,
    entry.identityName ?? "",
    entry.zeroWeightFlag ? "true" : "false",
    entry.scaleRawLine ?? "",
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export function downloadText(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
