import type { FoodCatalogItem, IdentityProfile, PassiveQuickLogItem, Recipe } from "./models";

export const TOKEN_PAYLOAD_VERSION = "ss1-v4";
export const TOKEN_LEGACY_WRITABLE_BYTES = 144;
export const TOKEN_MAX_RECIPE_STEPS = 12;
export const WRITE_TOKENS_SCREEN_ID = "writeTokens";

export type TokenDefinitionType = "ingredient" | "recipe" | "identity" | "shortcut" | "generic";
export type TokenTopLevelType = Exclude<TokenDefinitionType, "shortcut">;
export type TokenQueueStatus = "queued" | "ready" | "writing" | "written" | "failed" | "skipped";
export type TokenWritingMode = "queue" | "writing" | "complete";

export interface TokenCategoryMetadata {
  tokenType: TokenTopLevelType;
  eyebrow: string;
  label: string;
  description: string;
  emptyTitle: string;
  emptyAction: string;
}

export const TOKEN_CATEGORY_METADATA: TokenCategoryMetadata[] = [
  {
    tokenType: "ingredient",
    eyebrow: "Food",
    label: "Food / Ingredient",
    description: "Select something you weigh regularly.",
    emptyTitle: "No matching foods yet.",
    emptyAction: "Create ingredient",
  },
  {
    tokenType: "recipe",
    eyebrow: "Recipe",
    label: "Recipe",
    description: "Start a saved recipe workflow.",
    emptyTitle: "You don't have any recipes yet.",
    emptyAction: "Create recipe",
  },
  {
    tokenType: "generic",
    eyebrow: "Generic",
    label: "Generic Token",
    description: "Use a reusable generic food token.",
    emptyTitle: "Standard Generic Tokens are available.",
    emptyAction: "Create generic token",
  },
  {
    tokenType: "identity",
    eyebrow: "Person",
    label: "Identity",
    description: "Switch who the scale is logging for.",
    emptyTitle: "No extra people are set up yet.",
    emptyAction: "Add person",
  },
];

export const DEFAULT_GENERIC_FOODS: FoodCatalogItem[] = [
  genericFood("generic_pork", "Pork", 242, 27, 14, 0, "ham.png"),
  genericFood("generic_lamb", "Lamb", 294, 25, 21, 0, "steak.png"),
  genericFood("generic_beef", "Beef", 250, 26, 15, 0, "steak.png"),
  genericFood("generic_chicken", "Chicken", 165, 31, 3.6, 0, "chick leg.png"),
  genericFood("generic_fish", "Fish", 120, 22, 2, 0, "fish.png"),
];

export interface TokenDefinition {
  tokenType: TokenDefinitionType;
  displayLabel: string;
  sourceEntityId: string;
  payload: string;
  payloadVersion: string;
  entityType: string;
  behaviorLabel: string;
}

export interface TokenWriteQueueItem {
  id: string;
  tokenType: TokenDefinitionType;
  displayLabel: string;
  sourceEntityId: string;
  payload: string;
  payloadVersion: string;
  status: TokenQueueStatus;
  behaviorLabel: string;
  error?: string | null;
}

export interface TokenWritingSession {
  mode: TokenWritingMode;
  items: TokenWriteQueueItem[];
  currentIndex: number;
  statusText: string;
}

export function foodTokenDefinition(food: FoodCatalogItem): TokenDefinition {
  const tokenType: TokenDefinitionType = isGenericFoodId(food.id) ? "generic" : "ingredient";
  const request = buildIngredientRequest(food.id, food.displayName);
  return { ...request, tokenType, entityType: tokenType === "generic" ? "generic" : request.entityType, behaviorLabel: tokenType === "generic" ? "Generic food token" : "Weighed item" };
}

export function recipeTokenDefinition(recipe: Recipe, foodsById: Map<string, FoodCatalogItem>): TokenDefinition {
  const steps = recipe.ingredients.map((ingredient) => ({
    foodId: ingredient.foodId,
    displayName: foodsById.get(ingredient.foodId)?.displayName ?? ingredient.foodId,
    grams: ingredient.grams,
  }));
  return buildRecipeRequest(recipe.id, recipe.name, steps);
}

export function identityTokenDefinition(identity: IdentityProfile): TokenDefinition {
  return buildIdentityRequest(identity.identityId, identity.identityName);
}

export function shortcutTokenDefinition(item: PassiveQuickLogItem): TokenDefinition {
  return buildPassiveRequest(item.itemId, item.itemName, item.itemId.startsWith("recipe:") ? "recipe" : "ingredient", item.defaultGrams);
}

export function quickLogFoodTokenDefinition(food: FoodCatalogItem, grams: number): TokenDefinition {
  return buildPassiveRequest(food.id, food.displayName, "ingredient", grams);
}

export function quickLogRecipeTokenDefinition(recipe: Recipe, grams: number): TokenDefinition {
  return buildPassiveRequest(`recipe:${recipe.id}`, recipe.name, "recipe", grams);
}

export function tokenCategoryMetadata(type: TokenTopLevelType): TokenCategoryMetadata {
  return TOKEN_CATEGORY_METADATA.find((item) => item.tokenType === type) ?? TOKEN_CATEGORY_METADATA[0];
}

export function tokenPreviewSummary(definition: TokenDefinition): string {
  return definition.behaviorLabel;
}

export function isIntentionalWriterTokenType(type: string): type is TokenDefinitionType {
  return ["ingredient", "recipe", "identity", "shortcut", "generic"].includes(type);
}

export function isTopLevelWriterTokenType(type: string): type is TokenTopLevelType {
  return ["ingredient", "recipe", "identity", "generic"].includes(type);
}

export function isGenericFoodId(foodId: string): boolean {
  const normalized = foodId.trim().toLowerCase();
  return normalized === "generic_pork" || normalized === "generic_lamb" || normalized === "generic_beef" || normalized === "generic_chicken" || normalized === "generic_fish" || normalized.startsWith("generic_") || normalized.startsWith("generic:");
}

export function queueItemFromDefinition(definition: TokenDefinition, id?: string): TokenWriteQueueItem {
  return {
    id: id ?? crypto.randomUUID(),
    tokenType: definition.tokenType,
    displayLabel: definition.displayLabel,
    sourceEntityId: definition.sourceEntityId,
    payload: definition.payload,
    payloadVersion: definition.payloadVersion,
    status: "queued",
    behaviorLabel: definition.behaviorLabel,
    error: null,
  };
}

export function addTokenToQueue(queue: TokenWriteQueueItem[], definition: TokenDefinition, id?: string): TokenWriteQueueItem[] {
  return [...queue, queueItemFromDefinition(definition, id)];
}

export function removeQueueItem(queue: TokenWriteQueueItem[], itemId: string): TokenWriteQueueItem[] {
  return queue.filter((item) => item.id !== itemId);
}

export function moveQueueItem(queue: TokenWriteQueueItem[], itemId: string, direction: -1 | 1): TokenWriteQueueItem[] {
  const index = queue.findIndex((item) => item.id === itemId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= queue.length) return queue;
  const next = [...queue];
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  return next;
}

export function startWritingSession(queue: TokenWriteQueueItem[]): TokenWritingSession {
  const items = queue.map((item) => ({ ...item, status: "ready" as const, error: null }));
  return {
    mode: items.length > 0 ? "writing" : "complete",
    items,
    currentIndex: items.length > 0 ? 0 : -1,
    statusText: items.length > 0 ? "Connect scale and enable token write mode." : "No tokens queued.",
  };
}

export function markCurrentWriting(session: TokenWritingSession): TokenWritingSession {
  const current = currentSessionItem(session);
  if (!current) return session;
  return updateCurrentItem(session, { ...current, status: "writing", error: null }, "Writing token.");
}

export function markCurrentWritten(session: TokenWritingSession): TokenWritingSession {
  const current = currentSessionItem(session);
  if (!current) return session;
  const items = session.items.map((item, index) => index === session.currentIndex ? { ...item, status: "written" as const, error: null } : item);
  return advanceSession({ ...session, items });
}

export function failCurrentToken(session: TokenWritingSession, error: string): TokenWritingSession {
  const current = currentSessionItem(session);
  if (!current) return session;
  return updateCurrentItem(session, { ...current, status: "failed", error }, "Write failed. Retry or skip this token.");
}

export function retryCurrentToken(session: TokenWritingSession): TokenWritingSession {
  const current = currentSessionItem(session);
  if (!current || current.status !== "failed") return session;
  return updateCurrentItem(session, { ...current, status: "ready", error: null }, "Place a blank token on the scale.");
}

export function skipCurrentToken(session: TokenWritingSession): TokenWritingSession {
  const current = currentSessionItem(session);
  if (!current) return session;
  const items = session.items.map((item, index) => index === session.currentIndex ? { ...item, status: "skipped" as const, error: null } : item);
  return advanceSession({ ...session, items });
}

export function currentSessionItem(session: TokenWritingSession): TokenWriteQueueItem | null {
  return session.currentIndex >= 0 ? session.items[session.currentIndex] ?? null : null;
}

function advanceSession(session: TokenWritingSession): TokenWritingSession {
  const nextIndex = session.items.findIndex((item) => item.status === "ready" || item.status === "queued");
  if (nextIndex < 0) {
    return { ...session, mode: "complete", currentIndex: -1, statusText: `${session.items.filter((item) => item.status === "written").length} tokens written.` };
  }
  return { ...session, mode: "writing", currentIndex: nextIndex, statusText: nextIndex === 0 ? "Place a blank token on the scale." : "Place the next blank token on the scale." };
}

function updateCurrentItem(session: TokenWritingSession, nextItem: TokenWriteQueueItem, statusText: string): TokenWritingSession {
  return {
    ...session,
    items: session.items.map((item, index) => index === session.currentIndex ? nextItem : item),
    statusText,
  };
}

function buildIngredientRequest(foodId: string, displayName: string): TokenDefinition {
  const sanitizedId = sanitizeField(foodId);
  const sanitizedName = sanitizeField(displayName);
  const payload = `SS1|type=ingredient|id=${sanitizedId}|name=${sanitizedName}`;
  validatePayloadSize(payload);
  return { tokenType: "ingredient", entityType: "ingredient", sourceEntityId: sanitizedId, displayLabel: sanitizedName, payload, payloadVersion: TOKEN_PAYLOAD_VERSION, behaviorLabel: "Weighed item" };
}

function buildRecipeRequest(recipeId: string, displayName: string, steps: Array<{ foodId: string; displayName: string; grams: number }>): TokenDefinition {
  if (steps.length > TOKEN_MAX_RECIPE_STEPS) throw new Error(`Recipes can only write up to ${TOKEN_MAX_RECIPE_STEPS} ingredients to a token.`);
  const sanitizedId = sanitizeField(recipeId);
  const sanitizedName = sanitizeField(displayName);
  const encodedSteps = steps.map((step) => ({
    foodId: sanitizeField(step.foodId),
    displayName: sanitizeField(step.displayName),
    grams: formatGrams(step.grams),
  }));
  const recipeNameCandidates = unique([sanitizedName, truncateTokenField(sanitizedName, 32), truncateTokenField(sanitizedName, 24), truncateTokenField(sanitizedName, 16), truncateTokenField(sanitizedName, 10)]);
  const stepNameLimits = [null, 20, 16, 12, 8, 4, 2, 1] as const;
  for (const candidateName of recipeNameCandidates) {
    for (const stepLimit of stepNameLimits) {
      const stepBlob = encodedSteps.map((step) => [step.foodId, stepLimit == null ? step.displayName : truncateTokenField(step.displayName, stepLimit), step.grams].join("^")).join("~");
      const payload = `SS1|type=recipe|id=${sanitizedId}|name=${candidateName}|steps=${stepBlob}`;
      if (asciiByteLength(payload) <= TOKEN_LEGACY_WRITABLE_BYTES) {
        return { tokenType: "recipe", entityType: "recipe", sourceEntityId: sanitizedId, displayLabel: candidateName, payload, payloadVersion: TOKEN_PAYLOAD_VERSION, behaviorLabel: "Recipe workflow" };
      }
    }
  }
  throw new Error("Recipe token payload is too large. Try fewer ingredients or shorter names.");
}

function buildIdentityRequest(identityId: string, identityName: string): TokenDefinition {
  const sanitizedId = sanitizeField(identityId);
  const sanitizedName = sanitizeField(identityName);
  const payload = `SS1|type=identity|identity_id=${sanitizedId}|identity_name=${sanitizedName}`;
  validatePayloadSize(payload);
  return { tokenType: "identity", entityType: "identity", sourceEntityId: sanitizedId, displayLabel: sanitizedName, payload, payloadVersion: TOKEN_PAYLOAD_VERSION, behaviorLabel: "Person switch token" };
}

function buildPassiveRequest(referenceId: string, displayName: string, tokenType: "ingredient" | "recipe", defaultGrams?: number): TokenDefinition {
  const sanitizedReferenceId = sanitizeField(referenceId);
  const sanitizedDisplayName = sanitizeField(displayName);
  const grams = defaultGrams && defaultGrams > 0 ? formatGrams(defaultGrams) : null;
  const payload = `SS1|payload_version=${TOKEN_PAYLOAD_VERSION}|type=shortcut|token_type=${tokenType}|reference_id=${sanitizedReferenceId}|display_name=${sanitizedDisplayName}${grams ? `|default_grams=${grams}` : ""}`;
  validatePayloadSize(payload);
  return { tokenType: "shortcut", entityType: `shortcut_${tokenType}`, sourceEntityId: sanitizedReferenceId, displayLabel: sanitizedDisplayName, payload, payloadVersion: TOKEN_PAYLOAD_VERSION, behaviorLabel: `Quick log - ${grams ?? "saved"} g` };
}

function genericFood(id: string, displayName: string, kcal100g: number, protein100g: number, fat100g: number, carbs100g: number, iconName: string): FoodCatalogItem {
  const normalized = displayName.toLowerCase();
  return {
    id,
    displayName,
    displayNameNormalized: normalized,
    productConcept: displayName,
    productConceptKey: normalized,
    brandName: "Generic",
    brandNameNormalized: "generic",
    storeName: "",
    searchAnchor: normalized,
    stateCandidate: "generic",
    uxCategory: "Generic food",
    iconName,
    kcal100g,
    protein100g,
    fat100g,
    carbs100g,
    source: "axiom_generic",
    sourceRank: 0,
    thumbnailLabel: displayName.slice(0, 2),
    tokens: [normalized, "generic"],
    headTokens: [normalized],
  };
}

function validatePayloadSize(payload: string): void {
  if (asciiByteLength(payload) > TOKEN_LEGACY_WRITABLE_BYTES) throw new Error("Token payload is too large for the currently supported Axiom token capacity.");
}

function formatGrams(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function sanitizeField(value: string): string {
  const ascii = value.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[|^,~]/g, "/")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!ascii) throw new Error("Token payload fields must contain printable text.");
  return ascii;
}

function truncateTokenField(value: string, maxLength: number): string {
  if (maxLength <= 0) return "x";
  const clipped = value.slice(0, maxLength).trim();
  return clipped || "x";
}

function asciiByteLength(value: string): number {
  return value.length;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}
