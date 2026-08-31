import type { LogEntry, PassiveQuickLogItem, SourceMapping } from "./models";

export function sourceKeyForEntry(entry: LogEntry): string | null {
  const token = entry.placeholderTokenId ?? entry.sourceTagId ?? entry.scaleItemName ?? entry.originalFoodId;
  return token ? `${entry.sourceTagMode ?? entry.scaleEventType ?? "unknown"}:${token}` : null;
}

export function isZeroWeightUnresolved(entry: LogEntry): boolean {
  return entry.zeroWeightFlag && entry.grams === 0;
}

export function isUnknownUnresolved(entry: LogEntry): boolean {
  return Boolean(entry.placeholderUnresolved || entry.identityResolutionState === "PENDING" || entry.foodId.startsWith("unknown:"));
}

export function resolveZeroWeight(entry: LogEntry, grams: number): LogEntry {
  return {
    ...entry,
    grams,
    zeroWeightFlag: grams === 0,
  };
}

export function resolveUnknownEntry(entry: LogEntry, foodId: string, now = new Date().toISOString()): LogEntry {
  return {
    ...entry,
    foodId,
    placeholderUnresolved: false,
    originalFoodId: entry.originalFoodId ?? entry.foodId,
    refinementUpdatedAt: now,
    refinementScope: "entry",
    identityResolutionState: entry.identityId ? "RESOLVED" : entry.identityResolutionState,
  };
}

export function applySourceMappings(entry: LogEntry, mappings: SourceMapping[]): LogEntry {
  const key = sourceKeyForEntry(entry);
  const mapping = key ? mappings.find((item) => item.sourceKey === key) : null;
  return mapping && isUnknownUnresolved(entry) ? resolveUnknownEntry(entry, mapping.foodId, mapping.updatedAt) : entry;
}

export function applyPassiveShortcutConfig(entry: LogEntry, passiveItems: PassiveQuickLogItem[]): LogEntry {
  if (entry.scaleEventType !== "PASSIVE") return entry;
  const item = passiveItems.find((candidate) => candidate.itemId === entry.foodId || candidate.linkedFoodId === entry.foodId);
  if (!item?.linkedFoodId) return entry;
  return {
    ...entry,
    foodId: item.linkedFoodId,
    grams: entry.grams > 0 ? entry.grams : item.defaultGrams,
    zeroWeightFlag: false,
    identityId: item.identityId,
    identityName: item.identityName,
    scaleItemName: item.itemName,
    originalFoodId: entry.originalFoodId ?? entry.foodId,
  };
}
