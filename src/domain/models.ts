export type LogSource = "SCALE" | "MANUAL";
export type TagMode = "SPECIFIC" | "GENERIC" | "PASSIVE" | "IDENTITY";
export type RecipeType = "SINGLE";
export type IdentityResolutionState = "RESOLVED" | "PENDING" | "FALLBACK_ASSIGNED" | "MIGRATED";
export type IdentitySource = "EXPLICIT" | "FALLBACK" | "MIGRATION" | "UNKNOWN";

export interface MacroValues {
  kcal: number;
  carbs: number;
  fat: number;
  protein: number;
}

export interface FoodCatalogItem {
  id: string;
  displayName: string;
  displayNameNormalized: string;
  productConcept: string;
  productConceptKey: string;
  brandName: string;
  brandNameNormalized: string;
  storeName: string;
  searchAnchor: string;
  stateCandidate: string;
  uxCategory: string;
  iconName?: string;
  searchKey?: string;
  anchorFood?: string;
  anchorFamily?: string;
  searchGroup?: string;
  variantType?: string;
  isDefaultChoice?: number;
  trackingImportance?: number;
  trackingConfidence?: number;
  mealContext?: string;
  densityClass?: string;
  kcal100g: number;
  protein100g: number;
  fat100g: number;
  carbs100g: number;
  source: string;
  sourceRank: number;
  thumbnailLabel: string;
  tokens: string[];
  headTokens: string[];
}

export interface FoodPreference {
  foodId: string;
  isFavorite: boolean;
  selectionCount: number;
  lastSelectedAt?: string | null;
}

export interface UserIngredient {
  id: string;
  displayName: string;
  brandName: string;
  classification: string;
  kcal100g: number;
  protein100g: number;
  carbs100g: number;
  fat100g: number;
  sourceKind: "user" | "open_food_facts" | "passive" | "generic";
  iconName: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  foodId: string;
  grams: number;
}

export interface Recipe {
  id: string;
  name: string;
  type: RecipeType;
  mealLabel: string;
  iconName: string;
  ingredients: RecipeIngredient[];
  createdAt: string;
  lastWrittenTagId?: string | null;
}

export interface IdentityProfile {
  identityId: string;
  identityName: string;
  profileType: string;
  dailyCaloriesTarget?: number | null;
  proteinTarget?: number | null;
  carbsTarget?: number | null;
  fatTarget?: number | null;
  zeroWeightReviewEnabled: boolean;
  zeroWeightYellowIndicatorEnabled: boolean;
  genericReviewEnabled: boolean;
  genericWeekRefinementEnabled: boolean;
  quickLogIngredientId?: string | null;
  quickLogDisplayName?: string | null;
  quickLogIconName?: string | null;
  quickLogDefaultGrams?: number | null;
}

export interface PassiveQuickLogItem {
  itemId: string;
  itemName: string;
  identityId: string;
  identityName: string;
  linkedFoodId?: string | null;
  defaultGrams: number;
  ingredients: RecipeIngredient[];
}

export interface LogEntry {
  id: string;
  foodId: string;
  grams: number;
  timestamp: string;
  source: LogSource;
  zeroWeightFlag: boolean;
  identityId?: string | null;
  identityName?: string | null;
  mealLabelOverride?: string | null;
  scaleSource?: string | null;
  scaleItemName?: string | null;
  scaleRecipeId?: string | null;
  scaleRecipeName?: string | null;
  scaleStepIndex?: number | null;
  scaleExtraFlag?: boolean;
  scaleIdentityId?: string | null;
  scaleIdentityName?: string | null;
  scaleEventType?: string | null;
  scaleIntakeEvent?: boolean;
  scaleRawLine?: string | null;
  placeholderUnresolved?: boolean;
  placeholderType?: string | null;
  placeholderTokenId?: string | null;
  placeholderTokenLabel?: string | null;
  sourceTagMode?: TagMode | null;
  sourceTagId?: string | null;
  originalFoodId?: string | null;
  refinementUpdatedAt?: string | null;
  refinementScope?: string | null;
  identityResolutionState: IdentityResolutionState;
  identitySource: IdentitySource;
  logHash?: string | null;
}

export interface AppSettings {
  activationComplete: boolean;
  appInstanceId: string;
  activeIdentityId: string;
  activeIdentityName: string;
  preferredStoreName?: string | null;
  preferredUnit: "grams";
  autoConnectEnabled: boolean;
  zeroWeightReviewEnabled: boolean;
  zeroWeightYellowIndicatorEnabled: boolean;
  genericReviewEnabled: boolean;
  genericWeekRefinementEnabled: boolean;
  genericYellowIndicatorEnabled: boolean;
  autoZeroWeightCleanupEnabled: boolean;
  autoZeroWeightCleanupDays: number;
  genericAutoAcceptEnabled: boolean;
  genericAutoAcceptDays: number;
  identityEnabled: boolean;
  showDefaultIdentity: boolean;
  identityInactivityTimeoutMinutes: number;
  fatButtonItemId: string;
  fatButtonItemName: string;
  fatButtonFixed: boolean;
  fatButtonGrams: number;
  passiveQuickLogItems: PassiveQuickLogItem[];
}

export interface SourceMapping {
  sourceKey: string;
  foodId: string;
  displayName: string;
  updatedAt: string;
}

export interface AxiomBackup {
  version: "axiom-web-backup-v1";
  exportedAt: string;
  data: {
    settings: AppSettings;
    logs: LogEntry[];
    recipes: Recipe[];
    ingredients: UserIngredient[];
    identities: IdentityProfile[];
    sourceMappings: SourceMapping[];
    foodPreferences: FoodPreference[];
  };
}

export interface LoggedFood {
  entry: LogEntry;
  food?: FoodCatalogItem;
  name: string;
  brandName: string;
  mealLabel: string;
  macros: MacroValues;
  caloriesRounded: number;
  unresolvedPlaceholder: boolean;
  reviewReasons: string[];
}

export interface MealGroup {
  groupId: string;
  label: string;
  timeRangeLabel: string;
  entries: LoggedFood[];
  kcalTotal: number;
  unresolvedCount: number;
  zeroWeightCount: number;
}
