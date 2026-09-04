import type { FoodCatalogItem, IdentityProfile, PassiveQuickLogItem, Recipe, UserIngredient } from "./models";

export const TOKEN_PAYLOAD_VERSION = "ss1-v4";
export const TOKEN_LEGACY_WRITABLE_BYTES = 144;
export const TOKEN_MAX_RECIPE_STEPS = 12;
export const WRITE_TOKENS_SCREEN_ID = "writeTokens";

export type TokenDefinitionType = "ingredient" | "recipe" | "identity" | "shortcut" | "generic";
export type TokenTopLevelType = Exclude<TokenDefinitionType, "shortcut">;
export type TokenBehaviorSubtype = "weighed" | "set_portion" | "recipe_workflow" | "person_switch" | "generic_food";
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

export const DEFAULT_GENERIC_INGREDIENTS: UserIngredient[] = DEFAULT_GENERIC_FOODS.map((food) => ({
  id: food.id,
  displayName: food.displayName,
  brandName: "Generic",
  classification: "generic_token",
  kcal100g: food.kcal100g,
  protein100g: food.protein100g,
  carbs100g: food.carbs100g,
  fat100g: food.fat100g,
  sourceKind: "generic",
  iconName: food.iconName ?? "generic_food.png",
  updatedAt: "2026-09-03T00:00:00.000Z",
}));

export function mergeDefaultGenericIngredients(ingredients: UserIngredient[]): UserIngredient[] {
  const existingIds = new Set(ingredients.map((ingredient) => ingredient.id));
  return [...ingredients, ...DEFAULT_GENERIC_INGREDIENTS.filter((ingredient) => !existingIds.has(ingredient.id))];
}

export interface TokenDefinition {
  tokenFamily: TokenTopLevelType;
  tokenType: TokenDefinitionType;
  behaviorSubtype: TokenBehaviorSubtype;
  displayLabel: string;
  sourceEntityId: string;
  payload: string;
  payloadVersion: string;
  entityType: string;
  behaviorLabel: string;
  amountGrams?: number | null;
}

export interface TokenWriteQueueItem {
  id: string;
  tokenFamily: TokenTopLevelType;
  tokenType: TokenDefinitionType;
  behaviorSubtype: TokenBehaviorSubtype;
  displayLabel: string;
  sourceEntityId: string;
  payload: string;
  payloadVersion: string;
  status: TokenQueueStatus;
  behaviorLabel: string;
  amountGrams?: number | null;
  error?: string | null;
}

export type TokenCreationInput =
  | { tokenFamily: "ingredient"; source?: FoodCatalogItem | null; behaviorSubtype?: "weighed" | "set_portion" | null; amountGrams?: number | null }
  | { tokenFamily: "recipe"; source?: Recipe | null; behaviorSubtype?: "recipe_workflow" | "set_portion" | null; amountGrams?: number | null; foodsById?: Map<string, FoodCatalogItem> | null }
  | { tokenFamily: "identity"; source?: IdentityProfile | null }
  | { tokenFamily: "generic"; source?: FoodCatalogItem | null };

export interface TokenCreationState {
  tokenFamily: TokenTopLevelType;
  step: "select_entity" | "choose_behavior" | "enter_amount" | "preview";
  canQueue: boolean;
  message: string;
  definition?: TokenDefinition;
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
  requirePositiveGrams(item.defaultGrams, "Quick-log amount is required.");
  return buildPassiveRequest(item.itemId, item.itemName, item.itemId.startsWith("recipe:") ? "recipe" : "ingredient", item.defaultGrams);
}

export function quickLogFoodTokenDefinition(food: FoodCatalogItem, grams: number): TokenDefinition {
  requirePositiveGrams(grams, "Set portion amount is required.");
  return buildPassiveRequest(food.id, food.displayName, "ingredient", grams);
}

export function quickLogRecipeTokenDefinition(recipe: Recipe, grams: number): TokenDefinition {
  requirePositiveGrams(grams, "Set portion amount is required.");
  return buildPassiveRequest(`recipe:${recipe.id}`, recipe.name, "recipe", grams);
}

export function resolveTokenCreationState(input: TokenCreationInput): TokenCreationState {
  if (input.tokenFamily === "ingredient") {
    if (!input.source) return { tokenFamily: "ingredient", step: "select_entity", canQueue: false, message: "Select a food or create an ingredient." };
    if (!input.behaviorSubtype) return { tokenFamily: "ingredient", step: "choose_behavior", canQueue: false, message: "Choose how this food token should work." };
    if (input.behaviorSubtype === "set_portion" && !isPositiveGrams(input.amountGrams)) return { tokenFamily: "ingredient", step: "enter_amount", canQueue: false, message: "Enter a set portion amount." };
    return { tokenFamily: "ingredient", step: "preview", canQueue: true, message: "Food token ready to preview.", definition: input.behaviorSubtype === "set_portion" ? quickLogFoodTokenDefinition(input.source, input.amountGrams!) : foodTokenDefinition(input.source) };
  }
  if (input.tokenFamily === "recipe") {
    if (!input.source) return { tokenFamily: "recipe", step: "select_entity", canQueue: false, message: "Select or create a recipe." };
    if (!input.behaviorSubtype) return { tokenFamily: "recipe", step: "choose_behavior", canQueue: false, message: "Choose how this recipe token should work." };
    if (input.behaviorSubtype === "set_portion" && !isPositiveGrams(input.amountGrams)) return { tokenFamily: "recipe", step: "enter_amount", canQueue: false, message: "Enter a set portion amount." };
    const foodsById = input.foodsById ?? new Map<string, FoodCatalogItem>();
    return { tokenFamily: "recipe", step: "preview", canQueue: true, message: "Recipe token ready to preview.", definition: input.behaviorSubtype === "set_portion" ? quickLogRecipeTokenDefinition(input.source, input.amountGrams!) : recipeTokenDefinition(input.source, foodsById) };
  }
  if (input.tokenFamily === "identity") {
    if (!input.source) return { tokenFamily: "identity", step: "select_entity", canQueue: false, message: "Select or add a person." };
    return { tokenFamily: "identity", step: "preview", canQueue: true, message: "Identity token ready to queue.", definition: identityTokenDefinition(input.source) };
  }
  if (!input.source) return { tokenFamily: "generic", step: "select_entity", canQueue: false, message: "Select a generic food token." };
  return { tokenFamily: "generic", step: "preview", canQueue: true, message: "Generic token ready to queue.", definition: foodTokenDefinition(input.source) };
}

export function canCreateToken(input: TokenCreationInput): boolean {
  return resolveTokenCreationState(input).canQueue;
}

export function tokenOptionActionLabel(input: TokenCreationInput): "Add to queue" | "Configure" {
  return resolveTokenCreationState(input).canQueue ? "Add to queue" : "Configure";
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
  validateTokenDefinition(definition);
  return {
    id: id ?? crypto.randomUUID(),
    tokenFamily: definition.tokenFamily,
    tokenType: definition.tokenType,
    behaviorSubtype: definition.behaviorSubtype,
    displayLabel: definition.displayLabel,
    sourceEntityId: definition.sourceEntityId,
    payload: definition.payload,
    payloadVersion: definition.payloadVersion,
    status: "queued",
    behaviorLabel: definition.behaviorLabel,
    amountGrams: definition.amountGrams ?? null,
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
  return { tokenFamily: "ingredient", tokenType: "ingredient", behaviorSubtype: "weighed", entityType: "ingredient", sourceEntityId: sanitizedId, displayLabel: sanitizedName, payload, payloadVersion: TOKEN_PAYLOAD_VERSION, behaviorLabel: "Weighed item", amountGrams: null };
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
        return { tokenFamily: "recipe", tokenType: "recipe", behaviorSubtype: "recipe_workflow", entityType: "recipe", sourceEntityId: sanitizedId, displayLabel: candidateName, payload, payloadVersion: TOKEN_PAYLOAD_VERSION, behaviorLabel: "Recipe workflow", amountGrams: null };
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
  return { tokenFamily: "identity", tokenType: "identity", behaviorSubtype: "person_switch", entityType: "identity", sourceEntityId: sanitizedId, displayLabel: sanitizedName, payload, payloadVersion: TOKEN_PAYLOAD_VERSION, behaviorLabel: "Person switch token", amountGrams: null };
}

function buildPassiveRequest(referenceId: string, displayName: string, tokenType: "ingredient" | "recipe", defaultGrams?: number): TokenDefinition {
  requirePositiveGrams(defaultGrams, "Set portion amount is required.");
  const sanitizedReferenceId = sanitizeField(referenceId);
  const sanitizedDisplayName = sanitizeField(displayName);
  const grams = formatGrams(defaultGrams!);
  const payload = `SS1|payload_version=${TOKEN_PAYLOAD_VERSION}|type=shortcut|token_type=${tokenType}|reference_id=${sanitizedReferenceId}|display_name=${sanitizedDisplayName}|default_grams=${grams}`;
  validatePayloadSize(payload);
  return { tokenFamily: tokenType === "recipe" ? "recipe" : "ingredient", tokenType: "shortcut", behaviorSubtype: "set_portion", entityType: `shortcut_${tokenType}`, sourceEntityId: sanitizedReferenceId, displayLabel: sanitizedDisplayName, payload, payloadVersion: TOKEN_PAYLOAD_VERSION, behaviorLabel: `Set portion - ${grams} g`, amountGrams: Number(defaultGrams) };
}

function validateTokenDefinition(definition: TokenDefinition): void {
  if (!definition.displayLabel.trim()) throw new Error("Token definition requires a label.");
  if (!definition.sourceEntityId.trim()) throw new Error("Token definition requires a source entity.");
  if (!definition.payload.trim()) throw new Error("Token definition requires a payload.");
  if (definition.behaviorSubtype === "set_portion" && !isPositiveGrams(definition.amountGrams)) throw new Error("Set portion tokens require an amount.");
}

function requirePositiveGrams(value: number | null | undefined, message: string): void {
  if (!isPositiveGrams(value)) throw new Error(message);
}

function isPositiveGrams(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
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
