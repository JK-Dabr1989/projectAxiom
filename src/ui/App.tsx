import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, BookOpen, Camera, Database, Edit3, Ellipsis, HelpCircle, History, Home, Play, RefreshCcw, Search, Settings, SkipForward, Scale, Star, Tags, Trash2, UserRound, X } from "lucide-react";
import type { AppSettings, FoodCatalogItem, FoodPreference, IdentityProfile, LogEntry, Recipe, RecipeIngredient, SourceMapping, UserIngredient } from "../domain/models";
import { entriesForDate, groupEntriesByMeal } from "../domain/grouping";
import { macrosForFood, recipeTotals } from "../domain/nutrition";
import { ingredientToCatalogItem, loadFoodCatalog, searchFoods } from "../data/foodService";
import { buildBackup, decodeBackup, downloadText, logsToCsv } from "../data/backup";
import { lookupOpenFoodFacts, normalizeBarcode, type OpenFoodFactsDraft } from "../data/openFoodFacts";
import { registerServiceWorker } from "../pwa";
import { applyPassiveShortcutConfig, applySourceMappings, isUnknownUnresolved, isZeroWeightUnresolved, resolveUnknownEntry, resolveZeroWeight, sourceKeyForEntry } from "../domain/review";
import { recipePortionLogs } from "../domain/recipes";
import { DEFAULT_GENERIC_FOODS, TOKEN_CATEGORY_METADATA, WRITE_TOKENS_SCREEN_ID, addTokenToQueue, currentSessionItem, failCurrentToken, foodTokenDefinition, identityTokenDefinition, isGenericFoodId, markCurrentWritten, markCurrentWriting, moveQueueItem, recipeTokenDefinition, removeQueueItem, resolveTokenCreationState, retryCurrentToken, shortcutTokenDefinition, skipCurrentToken, startWritingSession, tokenCategoryMetadata, tokenOptionActionLabel, tokenPreviewSummary, type TokenDefinition, type TokenTopLevelType, type TokenWriteQueueItem, type TokenWritingSession } from "../domain/tokenWriting";
import {
  deleteIngredient,
  deleteIdentity,
  deleteLog,
  deleteRecipe,
  getFoodPreferences,
  getIdentities,
  getIngredients,
  getLogs,
  getRecipes,
  getSettings,
  getSourceMappings,
  replaceAllData,
  resetLocalData,
  saveSettings,
  recordFoodSelection,
  toggleFoodFavorite,
  upsertIdentity,
  upsertIngredient,
  upsertLog,
  upsertRecipe,
  upsertSourceMapping,
} from "../persistence/db";
import { UnavailableScaleTransport } from "../hardware/ScaleTransport";
import { UnavailableTokenWriter } from "../hardware/TokenWriter";
import { parseRawLogLines, parseStatusBlock, scaleRecordToLogEntry } from "../protocol/smartScaleProtocol";

type Screen = "today" | "search" | "timeline" | "recipes" | "ingredients" | "generic" | "barcode" | "passive" | "review" | "identities" | "data" | "help" | "settings" | "scale" | typeof WRITE_TOKENS_SCREEN_ID;

type NavItem = { screen: Screen; label: string; icon: typeof Home };
type TokenWriterSeed =
  | { tokenFamily: "ingredient"; food: FoodCatalogItem }
  | { tokenFamily: "recipe"; recipe: Recipe }
  | { tokenFamily: "identity"; identity: IdentityProfile }
  | { tokenFamily: "generic"; food: FoodCatalogItem }
  | { tokenFamily: "shortcut"; item: AppSettings["passiveQuickLogItems"][number] };

const primaryNavItems: NavItem[] = [
  { screen: "today", label: "Today", icon: Home },
  { screen: "search", label: "Search", icon: Search },
  { screen: "timeline", label: "Timeline", icon: History },
  { screen: "recipes", label: "Recipes", icon: BookOpen },
];

const moreGroups: Array<{ title: string; items: NavItem[] }> = [
  { title: "Libraries", items: [
    { screen: "ingredients", label: "Ingredients", icon: Tags },
    { screen: "generic", label: "Generic", icon: HelpCircle },
    { screen: "barcode", label: "Barcode", icon: Camera },
    { screen: "passive", label: "Quick-log", icon: Scale },
  ] },
  { title: "Review & People", items: [
    { screen: "review", label: "Review", icon: AlertTriangle },
    { screen: "identities", label: "People", icon: UserRound },
  ] },
  { title: "Device", items: [
    { screen: "scale", label: "Scale", icon: Scale },
    { screen: WRITE_TOKENS_SCREEN_ID, label: "Write Tokens", icon: Tags },
  ] },
  { title: "App", items: [
    { screen: "data", label: "Data", icon: Database },
    { screen: "settings", label: "Settings", icon: Settings },
    { screen: "help", label: "Help", icon: HelpCircle },
  ] },
];

export function App() {
  const [baseCatalog, setBaseCatalog] = useState<FoodCatalogItem[]>([]);
  const [ingredients, setIngredients] = useState<UserIngredient[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [identities, setIdentities] = useState<IdentityProfile[]>([]);
  const [sourceMappings, setSourceMappings] = useState<SourceMapping[]>([]);
  const [foodPreferences, setFoodPreferences] = useState<FoodPreference[]>([]);
  const [settings, setSettingsState] = useState<AppSettings | null>(null);
  const [screen, setScreen] = useState<Screen>("today");
  const [query, setQuery] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [grams, setGrams] = useState(100);
  const [date, setDate] = useState(todayIso());
  const [message, setMessage] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [tokenQueue, setTokenQueue] = useState<TokenWriteQueueItem[]>([]);
  const [tokenWriterSeed, setTokenWriterSeed] = useState<TokenWriterSeed | null>(null);

  useEffect(() => {
    loadAll();
    registerServiceWorker(() => setUpdateAvailable(true));
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [moreOpen]);

  async function loadAll() {
    const [loadedCatalog, loadedIngredients, loadedLogs, loadedRecipes, loadedSettings, loadedIdentities, loadedMappings, loadedPreferences] = await Promise.all([
      loadFoodCatalog(),
      getIngredients(),
      getLogs(),
      getRecipes(),
      getSettings(),
      getIdentities(),
      getSourceMappings(),
      getFoodPreferences(),
    ]);
    setBaseCatalog(loadedCatalog);
    setIngredients(loadedIngredients);
    setLogs(loadedLogs.map((entry) => applyPassiveShortcutConfig(applySourceMappings(entry, loadedMappings), loadedSettings.passiveQuickLogItems)));
    setRecipes(loadedRecipes);
    setSettingsState(loadedSettings);
    setIdentities(loadedIdentities);
    setSourceMappings(loadedMappings);
    setFoodPreferences(loadedPreferences);
  }

  const catalog = useMemo(() => [...ingredients.map(ingredientToCatalogItem), ...baseCatalog], [ingredients, baseCatalog]);
  const foodsById = useMemo(() => new Map(catalog.map((food) => [food.id, food])), [catalog]);
  const selectedFood = selectedFoodId ? foodsById.get(selectedFoodId) : undefined;
  const favoriteIds = useMemo(() => new Set(foodPreferences.filter((preference) => preference.isFavorite).map((preference) => preference.foodId)), [foodPreferences]);
  const favoriteFoods = useMemo(() => catalog.filter((food) => favoriteIds.has(food.id)).slice(0, 12), [catalog, favoriteIds]);
  const recentFoods = useMemo(() => foodPreferences.filter((preference) => preference.lastSelectedAt && foodsById.has(preference.foodId)).sort((a, b) => (b.lastSelectedAt ?? "").localeCompare(a.lastSelectedAt ?? "")).map((preference) => foodsById.get(preference.foodId)!).slice(0, 12), [foodPreferences, foodsById]);
  const favoriteRecipeIds = useMemo(() => new Set(foodPreferences.filter((preference) => preference.isFavorite && preference.foodId.startsWith("recipe:")).map((preference) => preference.foodId.slice("recipe:".length))), [foodPreferences]);
  const visibleDateLogs = useMemo(() => entriesForDate(logs, date), [logs, date]);
  const groups = useMemo(() => groupEntriesByMeal(visibleDateLogs, foodsById), [visibleDateLogs, foodsById]);
  const searchResults = useMemo(() => searchFoods(catalog, query, settings?.preferredStoreName), [catalog, query, settings?.preferredStoreName]);
  const totals = groups.flatMap((group) => group.entries).reduce(
    (sum, item) => ({ kcal: sum.kcal + item.macros.kcal, carbs: sum.carbs + item.macros.carbs, fat: sum.fat + item.macros.fat, protein: sum.protein + item.macros.protein }),
    { kcal: 0, carbs: 0, fat: 0, protein: 0 },
  );
  const zeroWeightEntries = logs.filter(isZeroWeightUnresolved);
  const unknownEntries = logs.filter(isUnknownUnresolved);

  async function setSettings(next: AppSettings) {
    await saveSettings(next);
    await loadAll();
  }

  async function rememberFood(foodId: string) {
    await recordFoodSelection(foodId);
    await loadAll();
  }

  async function toggleFavorite(foodId: string) {
    await toggleFoodFavorite(foodId);
    await loadAll();
  }

  function enqueueToken(definition: TokenDefinition) {
    setTokenQueue((queue) => addTokenToQueue(queue, definition));
    setMessage(`${definition.displayLabel} added to Write Tokens`);
    navigate(WRITE_TOKENS_SCREEN_ID);
  }

  function tryEnqueueToken(createDefinition: () => TokenDefinition) {
    try {
      enqueueToken(createDefinition());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Token could not be prepared");
    }
  }

  function openTokenWriter(seed: TokenWriterSeed) {
    setTokenWriterSeed(seed);
    navigate(WRITE_TOKENS_SCREEN_ID);
  }

  async function logFood(food: FoodCatalogItem, amount: number, mealLabelOverride?: string) {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      foodId: food.id,
      grams: amount,
      timestamp: new Date().toISOString(),
      source: "MANUAL",
      zeroWeightFlag: amount === 0,
      identityId: settings?.activeIdentityId ?? "default",
      identityName: settings?.activeIdentityName ?? "Default",
      mealLabelOverride,
      originalFoodId: food.id,
      identityResolutionState: "RESOLVED",
      identitySource: "EXPLICIT",
      logHash: null,
    };
    await recordFoodSelection(food.id);
    await upsertLog(entry);
    await loadAll();
    setMessage(`Logged ${Math.round(amount)}g ${food.displayName}`);
    setSelectedFoodId(null);
    setScreen("today");
  }

  function navigate(nextScreen: Screen) {
    setScreen(nextScreen);
    setMoreOpen(false);
  }

  if (!settings) return <main className="boot">Loading Axiom Web</main>;
  if (!settings.activationComplete) {
    return <OnboardingScreen settings={settings} onComplete={async (name) => {
      const identity = { ...blankIdentity(), identityId: "default", identityName: name || "Default", profileType: "primary" };
      await upsertIdentity(identity);
      await setSettings({ ...settings, activationComplete: true, activeIdentityId: identity.identityId, activeIdentityName: identity.identityName });
    }} />;
  }

  return (
    <div className="app">
      <header className="app-bar">
        <div className="brand"><span className="mark">AX</span><span>Axiom Web</span></div>
        <div className="app-bar-status">
          <span>{titleFor(screen)}</span>
          <small>Scale pending</small>
        </div>
      </header>
      <main className="content">
        {updateAvailable ? <div className="update-banner"><span>A newer Axiom build is ready.</span><button onClick={() => window.location.reload()}>Reload</button></div> : null}
        {message ? <p className="toast">{message}</p> : null}
        {screen === "today" && <TodayScreen groups={groups} totals={totals} onLog={() => navigate("search")} reviewCount={zeroWeightEntries.length + unknownEntries.length} onReview={() => navigate("review")} />}
        {screen === "search" && <SearchScreen query={query} setQuery={setQuery} results={searchResults} selectedFood={selectedFood} grams={grams} setGrams={setGrams} favoriteFoods={favoriteFoods} recentFoods={recentFoods} isFavorite={(foodId) => favoriteIds.has(foodId)} onToggleFavorite={toggleFavorite} onSelect={(food) => { setSelectedFoodId(food.id); void rememberFood(food.id); }} onClose={() => setSelectedFoodId(null)} onWriteToken={(food) => openTokenWriter({ tokenFamily: "ingredient", food })} onLog={logFood} />}
        {screen === "timeline" && <TimelineScreen date={date} setDate={setDate} groups={groups} onUpdate={async (entry, nextGrams, meal) => { await upsertLog({ ...entry, grams: nextGrams, zeroWeightFlag: nextGrams === 0, mealLabelOverride: meal }); await loadAll(); }} onDelete={async (entryId) => { await deleteLog(entryId); await loadAll(); }} />}
        {screen === "recipes" && <RecipesScreen catalog={catalog} foodsById={foodsById} recipes={recipes} settings={settings} favoriteRecipeIds={favoriteRecipeIds} onToggleFavorite={(recipeId) => toggleFavorite(`recipe:${recipeId}`)} onWriteToken={(recipe) => openTokenWriter({ tokenFamily: "recipe", recipe })} onSave={async (recipe) => { await upsertRecipe(recipe); await loadAll(); }} onDelete={async (recipeId) => { await deleteRecipe(recipeId); await loadAll(); }} onLog={async (entries) => { for (const entry of entries) await upsertLog(entry); await loadAll(); setScreen("today"); setMessage("Recipe logged"); }} />}
        {screen === "ingredients" && <IngredientsScreen ingredients={ingredients} logs={logs} recipes={recipes} onWriteToken={(ingredient) => openTokenWriter({ tokenFamily: "ingredient", food: ingredientToCatalogItem(ingredient) })} onSave={async (ingredient) => { await upsertIngredient(ingredient); await loadAll(); }} onDelete={async (id) => { await deleteIngredient(id); await loadAll(); }} />}
        {screen === "generic" && <GenericTokensScreen ingredients={ingredients} logs={logs} onWriteToken={(food) => openTokenWriter({ tokenFamily: "generic", food })} onSave={async (ingredient) => { await upsertIngredient(ingredient); await loadAll(); }} onDelete={async (id) => { await deleteIngredient(id); await loadAll(); }} />}
        {screen === "barcode" && <BarcodeScreen onSave={async (ingredient) => { await upsertIngredient(ingredient); await loadAll(); setScreen("ingredients"); setMessage("Barcode ingredient saved"); }} />}
        {screen === "passive" && <PassiveScreen settings={settings} identities={identities} catalog={catalog} onWriteToken={(item) => openTokenWriter({ tokenFamily: "shortcut", item })} onSave={async (nextSettings, ingredient) => { if (ingredient) await upsertIngredient(ingredient); await setSettings(nextSettings); }} />}
        {screen === "review" && <ReviewScreen zeroWeightEntries={zeroWeightEntries} unknownEntries={unknownEntries} foodsById={foodsById} searchResults={searchResults} query={query} setQuery={setQuery} onResolveZero={async (entry, nextGrams) => { await upsertLog(resolveZeroWeight(entry, nextGrams)); await loadAll(); }} onDelete={async (id) => { await deleteLog(id); await loadAll(); }} onResolveUnknown={async (entry, foodId) => { const resolved = resolveUnknownEntry(entry, foodId); await upsertLog(resolved); const key = sourceKeyForEntry(entry); if (key) await upsertSourceMapping({ sourceKey: key, foodId, displayName: foodsById.get(foodId)?.displayName ?? foodId, updatedAt: new Date().toISOString() }); await loadAll(); }} />}
        {screen === "identities" && <IdentitiesScreen identities={identities} settings={settings} onWriteToken={(identity) => openTokenWriter({ tokenFamily: "identity", identity })} onSave={async (identity) => { await upsertIdentity(identity); await loadAll(); }} onDelete={async (id) => { await deleteIdentity(id); if (settings.activeIdentityId === id) await saveSettings({ ...settings, activeIdentityId: "default", activeIdentityName: "Default" }); await loadAll(); }} onSwitch={async (identity) => setSettings({ ...settings, activeIdentityId: identity.identityId, activeIdentityName: identity.identityName })} />}
        {screen === "data" && <DataScreen settings={settings} logs={logs} recipes={recipes} ingredients={ingredients} identities={identities} sourceMappings={sourceMappings} foodPreferences={foodPreferences} foodsById={foodsById} onRestored={loadAll} />}
        {screen === "help" && <HelpScreen />}
        {screen === "settings" && <SettingsScreen settings={settings} setSettings={setSettings} onReset={async () => { if (!window.confirm("Reset local Axiom data on this device? Export a backup first if you want to keep it.")) return; await resetLocalData(); await loadAll(); setMessage("Local app data reset"); }} />}
        {screen === "scale" && <ScaleScreen existingLogs={logs} mappings={sourceMappings} passiveItems={settings.passiveQuickLogItems} onImport={async (entries) => { for (const entry of entries) await upsertLog(entry); await loadAll(); }} />}
        {screen === WRITE_TOKENS_SCREEN_ID && <WriteTokensScreen catalog={catalog} foodsById={foodsById} recipes={recipes} identities={identities} initialSeed={tokenWriterSeed} onConsumedInitialSeed={() => setTokenWriterSeed(null)} queue={tokenQueue} setQueue={setTokenQueue} onAddToken={(definition) => setTokenQueue((queue) => addTokenToQueue(queue, definition))} onSaveIngredient={async (ingredient) => { await upsertIngredient(ingredient); await loadAll(); }} onSaveRecipe={async (recipe) => { await upsertRecipe(recipe); await loadAll(); }} onSaveIdentity={async (identity) => { await upsertIdentity(identity); await loadAll(); }} />}
      </main>
      <BottomNav currentScreen={screen} moreOpen={moreOpen} onNavigate={navigate} onMore={() => setMoreOpen((open) => !open)} />
      <MoreSheet currentScreen={screen} open={moreOpen} onClose={() => setMoreOpen(false)} onNavigate={navigate} />
    </div>
  );
}

function BottomNav({ currentScreen, moreOpen, onNavigate, onMore }: { currentScreen: Screen; moreOpen: boolean; onNavigate: (screen: Screen) => void; onMore: () => void }) {
  const moreActive = moreOpen || !primaryNavItems.some((item) => item.screen === currentScreen);
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {primaryNavItems.map((item) => <NavButton key={item.screen} item={item} active={currentScreen === item.screen} onClick={() => onNavigate(item.screen)} />)}
      <button className={moreActive ? "nav-action active" : "nav-action"} onClick={onMore} aria-haspopup="dialog" aria-expanded={moreOpen} title="More">
        <Ellipsis size={20} />
        <span>More</span>
      </button>
    </nav>
  );
}

function MoreSheet({ currentScreen, open, onClose, onNavigate }: { currentScreen: Screen; open: boolean; onClose: () => void; onNavigate: (screen: Screen) => void }) {
  if (!open) return null;
  return (
    <div className="more-backdrop" role="presentation" onClick={onClose}>
      <section className="more-sheet" role="dialog" aria-modal="true" aria-label="More destinations" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-grabber" />
        <header className="sheet-header">
          <div>
            <p className="eyebrow">More</p>
            <h2>Destinations</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </header>
        <div className="more-groups">
          {moreGroups.map((group) => (
            <section className="more-group" key={group.title}>
              <h3>{group.title}</h3>
              <div className="more-grid">
                {group.items.map((item) => <NavButton key={item.screen} item={item} active={currentScreen === item.screen} onClick={() => onNavigate(item.screen)} />)}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return <button className={active ? "nav-action active" : "nav-action"} onClick={onClick} title={item.label}><Icon size={19} /><span>{item.label}</span></button>;
}

function OnboardingScreen({ settings, onComplete }: { settings: AppSettings; onComplete: (name: string) => void }) {
  const [name, setName] = useState(settings.activeIdentityName === "Default" ? "" : settings.activeIdentityName);
  return <main className="onboarding"><section className="panel onboarding-card"><div className="brand"><span className="mark">AX</span><span>Axiom Web</span></div><h1>Set up Axiom Web</h1><p className="muted">Axiom stores your food logs, recipes, ingredients, settings, and profiles locally on this device. You can use the app manually without a cloud account.</p><p className="muted">This validation build does not connect to the physical scale yet, and NFC writing is not enabled here.</p><label>Primary user name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Default" /></label><button className="primary" onClick={() => onComplete(name.trim() || "Default")}>Start using Axiom</button></section></main>;
}

function TodayScreen({ groups, totals, reviewCount, onLog, onReview }: { groups: ReturnType<typeof groupEntriesByMeal>; totals: { kcal: number; carbs: number; fat: number; protein: number }; reviewCount: number; onLog: () => void; onReview: () => void }) {
  return <section className="stack"><div className="metrics"><Metric label="Calories" value={Math.round(totals.kcal).toString()} unit="kcal" /><Metric label="Protein" value={totals.protein.toFixed(1)} unit="g" /><Metric label="Carbs" value={totals.carbs.toFixed(1)} unit="g" /><Metric label="Fat" value={totals.fat.toFixed(1)} unit="g" /></div><div className="button-row"><button className="primary" onClick={onLog}>Log food</button><button onClick={onReview}>Review {reviewCount}</button></div><MealGroups groups={groups} editable={false} /></section>;
}

function WriteTokensScreen({ catalog, foodsById, recipes, identities, initialSeed, onConsumedInitialSeed, queue, setQueue, onAddToken, onSaveIngredient, onSaveRecipe, onSaveIdentity }: { catalog: FoodCatalogItem[]; foodsById: Map<string, FoodCatalogItem>; recipes: Recipe[]; identities: IdentityProfile[]; initialSeed: TokenWriterSeed | null; onConsumedInitialSeed: () => void; queue: TokenWriteQueueItem[]; setQueue: (queue: TokenWriteQueueItem[]) => void; onAddToken: (definition: TokenDefinition) => void; onSaveIngredient: (ingredient: UserIngredient) => Promise<void> | void; onSaveRecipe: (recipe: Recipe) => Promise<void> | void; onSaveIdentity: (identity: IdentityProfile) => Promise<void> | void }) {
  const [category, setCategory] = useState<TokenTopLevelType | null>(null);
  const [query, setQuery] = useState("");
  const [recipeQuery, setRecipeQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodCatalogItem | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [quickLogGrams, setQuickLogGrams] = useState(100);
  const [preview, setPreview] = useState<TokenDefinition | null>(null);
  const [creationMode, setCreationMode] = useState<TokenTopLevelType | null>(null);
  const [session, setSession] = useState<TokenWritingSession | null>(null);
  const [writerMessage, setWriterMessage] = useState(new UnavailableTokenWriter().getStatus().message);
  const [queueMessage, setQueueMessage] = useState("");
  const customGenericTokens = catalog.filter((food) => isGenericFoodId(food.id) && !DEFAULT_GENERIC_FOODS.some((item) => item.id === food.id));
  const genericTokens = [...DEFAULT_GENERIC_FOODS, ...customGenericTokens];
  const foodResults = searchFoods(category === "generic" ? genericTokens : catalog, query);
  const recipeResults = recipes.filter((recipe) => recipe.name.toLowerCase().includes(recipeQuery.trim().toLowerCase()));
  const current = session ? currentSessionItem(session) : null;
  const writtenCount = (session?.items ?? queue).filter((item) => item.status === "written").length;
  const meta = category ? tokenCategoryMetadata(category) : null;
  useEffect(() => {
    if (!initialSeed) return;
    if (initialSeed.tokenFamily === "ingredient") {
      chooseCategory("ingredient");
      setSelectedFood(initialSeed.food);
    } else if (initialSeed.tokenFamily === "recipe") {
      chooseCategory("recipe");
      setSelectedRecipe(initialSeed.recipe);
    } else if (initialSeed.tokenFamily === "generic") {
      chooseCategory("generic");
      addResolved(resolveTokenCreationState({ tokenFamily: "generic", source: initialSeed.food }));
    } else if (initialSeed.tokenFamily === "identity") {
      chooseCategory("identity");
      addResolved(resolveTokenCreationState({ tokenFamily: "identity", source: initialSeed.identity }));
    } else {
      chooseCategory(initialSeed.item.itemId.startsWith("recipe:") ? "recipe" : "ingredient");
      addDefinition(shortcutTokenDefinition(initialSeed.item));
    }
    onConsumedInitialSeed();
  }, [initialSeed, onConsumedInitialSeed]);
  function chooseCategory(next: TokenTopLevelType) {
    setCategory(next);
    setPreview(null);
    setQueueMessage("");
    setCreationMode(null);
    setQuery("");
    setRecipeQuery("");
    setSelectedFood(null);
    setSelectedRecipe(null);
  }
  function previewResolved(state: ReturnType<typeof resolveTokenCreationState>) {
    if (state.canQueue && state.definition) {
      setPreview(state.definition);
      setQueueMessage("");
      return;
    }
    setPreview(null);
    setWriterMessage(state.message);
  }
  function addResolved(state: ReturnType<typeof resolveTokenCreationState>) {
    if (state.canQueue && state.definition) {
      addDefinition(state.definition);
      return;
    }
    setPreview(null);
    setQueueMessage("");
    setWriterMessage(state.message);
  }
  function addDefinition(definition: TokenDefinition) {
    onAddToken(definition);
    setPreview(null);
    setQueueMessage(`${definition.displayLabel} added to queue.`);
  }
  function addPreview() {
    if (!preview) return;
    addDefinition(preview);
  }
  async function connectScale() {
    try {
      await new UnavailableTokenWriter().connectScale();
    } catch (error) {
      setWriterMessage(error instanceof Error ? error.message : new UnavailableTokenWriter().getStatus().message);
    }
  }
  async function saveCreatedIngredient(ingredient: UserIngredient) {
    await onSaveIngredient(ingredient);
    setCreationMode(null);
    chooseCategory("ingredient");
    setSelectedFood(ingredientToCatalogItem(ingredient));
  }
  async function saveCreatedGeneric(ingredient: UserIngredient) {
    await onSaveIngredient(ingredient);
    setCreationMode(null);
    chooseCategory("generic");
    addDefinition(foodTokenDefinition(ingredientToCatalogItem(ingredient)));
  }
  async function saveCreatedRecipe(recipe: Recipe) {
    await onSaveRecipe(recipe);
    setCreationMode(null);
    chooseCategory("recipe");
    setSelectedRecipe(recipe);
  }
  async function saveCreatedIdentity(identity: IdentityProfile) {
    await onSaveIdentity(identity);
    setCreationMode(null);
    chooseCategory("identity");
    addDefinition(identityTokenDefinition(identity));
  }
  if (session?.mode === "complete") {
    return <section className="stack write-tokens"><div className="panel completion-panel"><p className="eyebrow">Write Tokens</p><h1>{writtenCount} tokens written</h1><div className="result-list">{session.items.map((item) => <article className="queue-row" key={item.id}><span className="thumb">{queueTokenTypeLabel(item).slice(0, 2)}</span><div><strong>{item.displayLabel}</strong><small>{queueTokenTypeLabel(item)} | {item.behaviorLabel} | {item.status}</small></div></article>)}</div><div className="button-row"><button className="primary" onClick={() => { setQueue([]); setSession(null); }}>Done</button><button onClick={() => { setQueue([]); setSession(null); }}>Write more tokens</button></div></div></section>;
  }
  if (session?.mode === "writing" && current) {
    return <section className="stack write-tokens"><div className="panel session-panel"><p className="eyebrow">Write Tokens</p><h1>{session.currentIndex + 1} of {session.items.length}</h1><div className="progress-track"><span style={{ width: `${Math.max(4, ((session.currentIndex + 1) / session.items.length) * 100)}%` }} /></div><div className="current-token"><span className="thumb">{queueTokenTypeLabel(current).slice(0, 2)}</span><div><p className="eyebrow">Current token</p><h2>{current.displayLabel}</h2><p className="muted">{queueTokenTypeLabel(current)} | {current.behaviorLabel}</p></div></div><div className={current.status === "failed" ? "status-pill danger-pill" : "status-pill"}>{current.status === "failed" ? current.error : writerMessage}</div><p className="muted">{current.status === "failed" ? "Retry this token or skip it before continuing." : "Place a blank NFC token on the scale when token write mode is available."}</p><div className="button-row"><button onClick={() => setSession(null)}>Back to queue</button><button onClick={() => setSession(null)}>Cancel session</button><button onClick={() => setSession(skipCurrentToken(session))}><SkipForward size={16} /> Skip current token</button>{current.status === "failed" ? <button onClick={() => setSession(retryCurrentToken(session))}><RefreshCcw size={16} /> Retry failed token</button> : null}{import.meta.env.DEV ? <><button onClick={() => setSession(markCurrentWriting(session))}>Dev writing</button><button onClick={() => setSession(markCurrentWritten(session))}>Dev written</button><button onClick={() => setSession(failCurrentToken(session, "Development simulated write failure."))}>Dev fail</button></> : null}</div></div></section>;
  }
  return <section className="stack write-tokens"><div className="panel write-hero"><p className="eyebrow">Write Tokens</p><h1>Write Tokens</h1><p>Create Axiom NFC tokens using the NFC reader/writer built into your scale.</p></div><div className="split"><div className="panel token-picker"><h2>What do you want to write?</h2><div className="token-choice-grid">{TOKEN_CATEGORY_METADATA.map((item) => <button key={item.tokenType} className={category === item.tokenType ? "token-choice active" : "token-choice"} onClick={() => chooseCategory(item.tokenType)}><span className="eyebrow">{item.eyebrow}</span><strong>{item.label}</strong><small>{item.description}</small></button>)}</div>{queueMessage ? <p className="status-pill">{queueMessage}</p> : null}{meta ? <div className="token-selector"><div className="title-row"><div><p className="eyebrow">{meta.eyebrow}</p><h2>{meta.label}</h2></div>{category !== "generic" ? <button onClick={() => category && setCreationMode(category)}>{meta.emptyAction}</button> : <button onClick={() => setCreationMode("generic")}>Create generic token</button>}</div>{creationMode === "ingredient" ? <IngredientForm ingredient={null} onSave={saveCreatedIngredient} /> : null}{creationMode === "generic" ? <GenericTokenForm token={null} onSave={saveCreatedGeneric} /> : null}{creationMode === "recipe" ? <RecipeCreator catalog={catalog} foodsById={foodsById} onSave={saveCreatedRecipe} /> : null}{creationMode === "identity" ? <IdentityCreator onSave={saveCreatedIdentity} /> : null}{!creationMode && category === "ingredient" && !selectedFood ? <div className="stack"><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foods and ingredients" /><div className="result-list">{foodResults.map(({ food }) => <button key={food.id} className="result-row" onClick={() => { setSelectedFood(food); setPreview(null); setQueueMessage(""); }}><span className="thumb">{food.thumbnailLabel || food.displayName.slice(0, 2)}</span><span><strong>{food.displayName}</strong><small>{[food.brandName, food.storeName, food.stateCandidate].filter(Boolean).join(" | ")}</small></span><em>{tokenOptionActionLabel({ tokenFamily: "ingredient", source: food })}</em></button>)}</div>{foodResults.length === 0 ? <EmptyTokenState title="No matching foods yet." action="Create ingredient" onCreate={() => setCreationMode("ingredient")} /> : null}</div> : null}{!creationMode && category === "ingredient" && selectedFood ? <FoodBehaviorChooser food={selectedFood} grams={quickLogGrams} setGrams={setQuickLogGrams} onBack={() => { setSelectedFood(null); setPreview(null); }} onWeighed={() => previewResolved(resolveTokenCreationState({ tokenFamily: "ingredient", source: selectedFood, behaviorSubtype: "weighed" }))} onQuickLog={() => previewResolved(resolveTokenCreationState({ tokenFamily: "ingredient", source: selectedFood, behaviorSubtype: "set_portion", amountGrams: quickLogGrams }))} /> : null}{!creationMode && category === "recipe" && !selectedRecipe ? <div className="stack"><input className="search-input" value={recipeQuery} onChange={(event) => setRecipeQuery(event.target.value)} placeholder="Search recipes" />{recipeResults.length === 0 ? <EmptyTokenState title="No recipes available." action="Create recipe" onCreate={() => setCreationMode("recipe")} /> : <div className="result-list">{recipeResults.map((recipe) => <button key={recipe.id} className="result-row" onClick={() => { setSelectedRecipe(recipe); setPreview(null); setQueueMessage(""); }}><span className="thumb">{recipe.iconName || recipe.name.slice(0, 2)}</span><span><strong>{recipe.name}</strong><small>{recipe.ingredients.length} ingredients | {recipe.mealLabel}</small></span><em>{tokenOptionActionLabel({ tokenFamily: "recipe", source: recipe })}</em></button>)}</div>}</div> : null}{!creationMode && category === "recipe" && selectedRecipe ? <RecipeBehaviorChooser recipe={selectedRecipe} grams={quickLogGrams} setGrams={setQuickLogGrams} onBack={() => { setSelectedRecipe(null); setPreview(null); }} onRecipe={() => previewResolved(resolveTokenCreationState({ tokenFamily: "recipe", source: selectedRecipe, behaviorSubtype: "recipe_workflow", foodsById }))} onQuickLog={() => previewResolved(resolveTokenCreationState({ tokenFamily: "recipe", source: selectedRecipe, behaviorSubtype: "set_portion", amountGrams: quickLogGrams }))} /> : null}{!creationMode && category === "generic" ? <div className="stack"><div className="result-list">{genericTokens.map((food) => <button key={food.id} className="result-row" onClick={() => addResolved(resolveTokenCreationState({ tokenFamily: "generic", source: food }))}><span className="thumb">{food.thumbnailLabel || food.displayName.slice(0, 2)}</span><span><strong>{food.displayName}</strong><small>Generic food token</small></span><em>{tokenOptionActionLabel({ tokenFamily: "generic", source: food })}</em></button>)}</div></div> : null}{!creationMode && category === "identity" ? <div className="stack">{identities.length === 0 ? <EmptyTokenState title="No people are set up yet." action="Add person" onCreate={() => setCreationMode("identity")} /> : <div className="result-list">{identities.map((identity) => <button key={identity.identityId} className="result-row" onClick={() => addResolved(resolveTokenCreationState({ tokenFamily: "identity", source: identity }))}><span className="thumb">{identity.identityName.slice(0, 2)}</span><span><strong>{identity.identityName}</strong><small>{identity.profileType === "primary" ? "Primary person" : "Household person"}</small></span><em>{tokenOptionActionLabel({ tokenFamily: "identity", source: identity })}</em></button>)}</div>}<button onClick={() => setCreationMode("identity")}>Add person</button></div> : null}{preview ? <TokenPreview definition={preview} onAdd={addPreview} onCancel={() => setPreview(null)} /> : null}</div> : <p className="muted">Choose a token type to select what the token represents, then choose how it should behave.</p>}</div><QueuePanel queue={queue} setQueue={setQueue} writerMessage={writerMessage} connectScale={connectScale} startSession={() => setSession(startWritingSession(queue))} /></div></section>;
}

function EmptyTokenState({ title, action, onCreate }: { title: string; action: string; onCreate: () => void }) {
  return <div className="empty token-empty"><strong>{title}</strong><span>Make one here and return to this Write Tokens queue.</span><button className="primary" onClick={onCreate}>{action}</button></div>;
}

function FoodBehaviorChooser({ food, grams, setGrams, onBack, onWeighed, onQuickLog }: { food: FoodCatalogItem; grams: number; setGrams: (value: number) => void; onBack: () => void; onWeighed: () => void; onQuickLog: () => void }) {
  const canUseQuickLog = Number.isFinite(grams) && grams > 0;
  return <div className="token-behavior"><div className="title-row"><div><p className="eyebrow">Selected food</p><h3>{food.displayName}</h3></div><button onClick={onBack}>Change</button></div><h2>How should this token work?</h2><div className="token-choice-grid"><button className="token-choice" onClick={onWeighed}><strong>Weighed item</strong><small>Scan the token, place food on the scale, and log the measured weight.</small></button><div className="token-choice behavior-form"><strong>Quick log</strong><small>Scan the token to log a predefined amount without weighing.</small><label>Grams<input type="number" min="1" value={grams} onChange={(event) => setGrams(Number(event.target.value))} /></label><button className="primary" disabled={!canUseQuickLog} onClick={onQuickLog}>Use quick log</button></div></div></div>;
}

function RecipeBehaviorChooser({ recipe, grams, setGrams, onBack, onRecipe, onQuickLog }: { recipe: Recipe; grams: number; setGrams: (value: number) => void; onBack: () => void; onRecipe: () => void; onQuickLog: () => void }) {
  const canUseQuickLog = Number.isFinite(grams) && grams > 0;
  return <div className="token-behavior"><div className="title-row"><div><p className="eyebrow">Selected recipe</p><h3>{recipe.name}</h3></div><button onClick={onBack}>Change</button></div><h2>How should this token work?</h2><div className="token-choice-grid"><button className="token-choice" onClick={onRecipe}><strong>Recipe workflow</strong><small>Use the saved recipe workflow supported by the current Web recipe model.</small></button><div className="token-choice behavior-form"><strong>Quick log</strong><small>Scan the token to log a predefined recipe amount.</small><label>Grams<input type="number" min="1" value={grams} onChange={(event) => setGrams(Number(event.target.value))} /></label><button className="primary" disabled={!canUseQuickLog} onClick={onQuickLog}>Use quick log</button></div></div></div>;
}

function TokenPreview({ definition, onAdd, onCancel }: { definition: TokenDefinition; onAdd: () => void; onCancel: () => void }) {
  return <article className="token-preview"><p className="eyebrow">Token preview</p><h3>{definition.displayLabel}</h3><p>{definitionTokenTypeLabel(definition)} token</p><p className="muted">{tokenPreviewSummary(definition)}</p>{import.meta.env.DEV ? <details><summary>Payload</summary><code>{definition.payload}</code></details> : null}<div className="button-row"><button className="primary" onClick={onAdd}>Add to queue</button><button onClick={onCancel}>Choose another</button></div></article>;
}

function QueuePanel({ queue, setQueue, writerMessage, connectScale, startSession }: { queue: TokenWriteQueueItem[]; setQueue: (queue: TokenWriteQueueItem[]) => void; writerMessage: string; connectScale: () => void; startSession: () => void }) {
  return <div className="panel queue-panel"><div className="title-row"><div><h2>Queue</h2><p className="muted">{queue.length} token{queue.length === 1 ? "" : "s"}</p></div><button disabled={queue.length === 0} onClick={() => setQueue([])}>Clear queue</button></div>{queue.length === 0 ? <div className="empty">Add foods, recipes, people, or generic tokens to build a mixed writing queue.</div> : <div className="result-list">{queue.map((item, index) => <article className="queue-row" key={item.id}><span className="thumb">{queueTokenTypeLabel(item).slice(0, 2)}</span><div><strong>{item.displayLabel}</strong><small>{queueTokenTypeLabel(item)} | {item.behaviorLabel} | {item.status}</small></div><div className="log-actions"><button title="Move up" disabled={index === 0} onClick={() => setQueue(moveQueueItem(queue, item.id, -1))}><ArrowUp size={16} /></button><button title="Move down" disabled={index === queue.length - 1} onClick={() => setQueue(moveQueueItem(queue, item.id, 1))}><ArrowDown size={16} /></button><button title="Remove token" onClick={() => setQueue(removeQueueItem(queue, item.id))}><Trash2 size={16} /></button></div></article>)}</div>}<div className="settings-section ready-write"><h2>Ready to write</h2><p className="muted">{queue.length} token{queue.length === 1 ? "" : "s"} queued</p><ol><li>Connect your AxiomScale.</li><li>Put the scale into Token Write mode.</li><li>Place the requested blank token on the NFC area.</li><li>Wait for confirmation.</li><li>Replace it with the next token.</li></ol><div className="status-pill">Not connected</div><p className="muted">{writerMessage}</p><div className="button-row"><button onClick={connectScale}>Connect scale</button><button disabled>Enable token write mode on AxiomScale</button></div></div><button className="primary start-writing" disabled={queue.length === 0} onClick={startSession}><Play size={16} /> Start writing</button></div>;
}

function RecipeCreator({ catalog, foodsById, onSave }: { catalog: FoodCatalogItem[]; foodsById: Map<string, FoodCatalogItem>; onSave: (recipe: Recipe) => void }) {
  const [name, setName] = useState("");
  const [mealLabel, setMealLabel] = useState("dinner");
  const [iconName, setIconName] = useState("");
  const [foodId, setFoodId] = useState("");
  const [grams, setGrams] = useState(100);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  function save() {
    onSave({ id: crypto.randomUUID(), name: name.trim(), type: "SINGLE", mealLabel, iconName, ingredients, createdAt: new Date().toISOString(), lastWrittenTagId: null });
  }
  return <div className="panel inline-creator"><h2>Create recipe</h2><label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Recipe name" /></label><div className="form-grid two"><label>Meal<select value={mealLabel} onChange={(event) => setMealLabel(event.target.value)}>{["breakfast", "lunch", "dinner", "snacks"].map((meal) => <option key={meal}>{meal}</option>)}</select></label><label>Icon<input value={iconName} onChange={(event) => setIconName(event.target.value)} placeholder="Optional label" /></label></div><div className="inline-form"><select value={foodId} onChange={(event) => setFoodId(event.target.value)}><option value="">Choose ingredient</option>{catalog.slice(0, 800).map((food) => <option key={food.id} value={food.id}>{food.displayName}</option>)}</select><input type="number" value={grams} min="0" onChange={(event) => setGrams(Number(event.target.value))} /><button onClick={() => foodId && setIngredients([...ingredients, { foodId, grams }])}>Add</button></div><ul className="plain-list">{ingredients.map((ingredient, index) => <li key={`${ingredient.foodId}-${index}`} className="plain-row"><span>{foodsById.get(ingredient.foodId)?.displayName ?? ingredient.foodId} - {ingredient.grams}g</span><button title="Remove ingredient" onClick={() => setIngredients(ingredients.filter((_, itemIndex) => itemIndex !== index))}><X size={16} /></button></li>)}</ul><button className="primary" disabled={!name.trim() || ingredients.length === 0} onClick={save}>Save recipe</button></div>;
}

function IdentityCreator({ onSave }: { onSave: (identity: IdentityProfile) => void }) {
  const [name, setName] = useState("");
  return <div className="panel inline-creator"><h2>Add person</h2><label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Person name" /></label><button className="primary" disabled={!name.trim()} onClick={() => onSave({ ...blankIdentity(), identityId: `identity:${crypto.randomUUID().slice(0, 8)}`, identityName: name.trim(), profileType: "secondary" })}>Save person</button></div>;
}

function SearchScreen(props: { query: string; setQuery: (value: string) => void; results: ReturnType<typeof searchFoods>; selectedFood?: FoodCatalogItem; grams: number; setGrams: (value: number) => void; favoriteFoods: FoodCatalogItem[]; recentFoods: FoodCatalogItem[]; isFavorite: (foodId: string) => boolean; onToggleFavorite: (foodId: string) => void; onSelect: (food: FoodCatalogItem) => void; onClose: () => void; onWriteToken: (food: FoodCatalogItem) => void; onLog: (food: FoodCatalogItem, grams: number, mealLabel?: string) => void }) {
  const preview = props.selectedFood ? macrosForFood(props.selectedFood, props.grams) : null;
  useEffect(() => {
    if (!props.selectedFood) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [props]);
  return <section><FoodResultPanel query={props.query} setQuery={props.setQuery} results={props.results} favoriteFoods={props.favoriteFoods} recentFoods={props.recentFoods} onSelect={props.onSelect} />{props.selectedFood ? <div className="modal-backdrop" role="presentation" onClick={props.onClose}><section className="panel log-modal" role="dialog" aria-modal="true" aria-label={`Log ${props.selectedFood.displayName}`} onClick={(event) => event.stopPropagation()}><div className="title-row"><h2>{props.selectedFood.displayName}</h2><div className="button-row compact"><button className={props.isFavorite(props.selectedFood.id) ? "icon-button favorite active" : "icon-button favorite"} title="Favorite" onClick={() => props.onToggleFavorite(props.selectedFood!.id)}><Star size={19} /></button><button className="icon-button" title="Close" onClick={props.onClose}><X size={19} /></button></div></div><p className="muted">{[props.selectedFood.brandName, props.selectedFood.storeName, props.selectedFood.uxCategory].filter(Boolean).join(" | ")}</p><p className="muted">{Math.round(props.selectedFood.kcal100g)} kcal/100g | P {props.selectedFood.protein100g.toFixed(1)}g | C {props.selectedFood.carbs100g.toFixed(1)}g | F {props.selectedFood.fat100g.toFixed(1)}g</p><label>Grams<input type="number" min="0" step="1" value={props.grams} autoFocus onChange={(event) => props.setGrams(Number(event.target.value))} /></label>{preview ? <MacroStrip macros={preview} /> : null}<div className="button-row"><button onClick={() => props.onWriteToken(props.selectedFood!)}>Write token</button></div><div className="meal-actions">{["breakfast", "lunch", "dinner", "snacks"].map((meal) => <button key={meal} className="primary" onClick={() => props.onLog(props.selectedFood!, props.grams, meal)}>{meal}</button>)}</div></section></div> : null}</section>;
}

function FoodResultPanel({ query, setQuery, results, favoriteFoods = [], recentFoods = [], onSelect }: { query: string; setQuery: (value: string) => void; results: ReturnType<typeof searchFoods>; favoriteFoods?: FoodCatalogItem[]; recentFoods?: FoodCatalogItem[]; onSelect: (food: FoodCatalogItem) => void }) {
  const showLanding = query.trim().length === 0 && (favoriteFoods.length > 0 || recentFoods.length > 0);
  return <div className="panel"><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foods and ingredients" />{showLanding ? <div className="quick-pick-stack">{favoriteFoods.length > 0 ? <QuickPickSection title="Favorites" foods={favoriteFoods} onSelect={onSelect} /> : null}{recentFoods.length > 0 ? <QuickPickSection title="Recent" foods={recentFoods} onSelect={onSelect} /> : null}</div> : null}<div className="result-list">{results.map(({ food, score }) => <button key={food.id} className="result-row" onClick={() => onSelect(food)}><span className="thumb">{food.thumbnailLabel || food.displayName.slice(0, 2)}</span><span><strong>{food.displayName}</strong><small>{[food.brandName, food.storeName, food.stateCandidate].filter(Boolean).join(" | ")}</small></span><em>{score}</em></button>)}</div></div>;
}

function QuickPickSection({ title, foods, onSelect }: { title: string; foods: FoodCatalogItem[]; onSelect: (food: FoodCatalogItem) => void }) {
  return <section><h3>{title}</h3><div className="quick-picks">{foods.map((food) => <button key={food.id} onClick={() => onSelect(food)}><span className="thumb">{food.thumbnailLabel || food.displayName.slice(0, 2)}</span><span>{food.displayName}</span></button>)}</div></section>;
}

function TimelineScreen({ date, setDate, groups, onUpdate, onDelete }: { date: string; setDate: (value: string) => void; groups: ReturnType<typeof groupEntriesByMeal>; onUpdate: (entry: LogEntry, grams: number, meal: string) => void; onDelete: (entryId: string) => void }) {
  return <section className="stack"><input className="date-input" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><MealGroups groups={groups} editable onUpdate={onUpdate} onDelete={onDelete} /></section>;
}

function IngredientsScreen({ ingredients, logs, recipes, onWriteToken, onSave, onDelete }: { ingredients: UserIngredient[]; logs: LogEntry[]; recipes: Recipe[]; onWriteToken: (ingredient: UserIngredient) => void; onSave: (ingredient: UserIngredient) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<UserIngredient | null>(null);
  const usedIds = new Set([...logs.map((log) => log.foodId), ...recipes.flatMap((recipe) => recipe.ingredients.map((item) => item.foodId))]);
  return <section className="split"><IngredientForm ingredient={editing} onSave={(ingredient) => { onSave(ingredient); setEditing(null); }} /><div className="panel"><h2>Ingredient library</h2>{ingredients.map((ingredient) => <article className="recipe-card" key={ingredient.id}><div><h3>{ingredient.displayName}</h3><p>{ingredient.brandName || "User ingredient"} | {ingredient.kcal100g} kcal/100g</p></div><div className="button-row"><button onClick={() => setEditing(ingredient)}>Edit</button><button onClick={() => onWriteToken(ingredient)}>Write token</button><button disabled={usedIds.has(ingredient.id)} title={usedIds.has(ingredient.id) ? "Used by logs or recipes" : "Delete"} onClick={() => onDelete(ingredient.id)}><Trash2 size={16} /></button></div></article>)}</div></section>;
}

function BarcodeScreen({ onSave }: { onSave: (ingredient: UserIngredient) => void }) {
  const [barcode, setBarcode] = useState("");
  const [draft, setDraft] = useState<OpenFoodFactsDraft | null>(null);
  const [status, setStatus] = useState("Manual entry works everywhere. Camera scanning uses the browser BarcodeDetector API when available.");
  async function lookup(code = barcode) {
    setStatus("Looking up Open Food Facts...");
    const result = await lookupOpenFoodFacts(code);
    if (result.kind === "found") {
      setDraft(result.draft);
      setStatus("Review the ingredient before saving it locally.");
    } else if (result.kind === "not-found") {
      setStatus(`No product found for barcode ${result.barcode}.`);
    } else if (result.kind === "invalid") {
      setStatus(result.reason);
    } else {
      setStatus(result.message);
    }
  }
  async function scanCamera() {
    const BarcodeDetectorCtor = (window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector;
    if (!BarcodeDetectorCtor || !navigator.mediaDevices?.getUserMedia) {
      setStatus("Camera barcode scanning is not supported in this browser. Enter the barcode manually.");
      return;
    }
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();
      const detector = new BarcodeDetectorCtor({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
      const started = Date.now();
      while (Date.now() - started < 7000) {
        const codes = await detector.detect(video);
        const value = normalizeBarcode(codes[0]?.rawValue ?? "");
        if (value) {
          setBarcode(value);
          await lookup(value);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      setStatus("No barcode detected. Try manual entry or better light.");
    } catch {
      setStatus("Camera access was not available. Enter the barcode manually.");
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
    }
  }
  const ingredient = draftToIngredient(draft);
  return <section className="split"><div className="panel"><h2>Barcode ingredient</h2><p className="muted">{status}</p><label>Barcode<input inputMode="numeric" value={barcode} onChange={(event) => setBarcode(normalizeBarcode(event.target.value))} placeholder="8 to 14 digits" /></label><div className="button-row"><button onClick={() => lookup()}>Look up</button><button onClick={scanCamera}>Scan with camera</button></div></div><div className="panel">{draft && ingredient ? <><h2>Review before saving</h2><IngredientForm ingredient={ingredient} onSave={onSave} /></> : <p className="muted">Open Food Facts is optional. Axiom remains usable offline with manual ingredient creation.</p>}</div></section>;
}

function PassiveScreen({ settings, identities, catalog, onWriteToken, onSave }: { settings: AppSettings; identities: IdentityProfile[]; catalog: FoodCatalogItem[]; onWriteToken: (item: AppSettings["passiveQuickLogItems"][number]) => void; onSave: (settings: AppSettings, ingredient?: UserIngredient) => void }) {
  const [itemName, setItemName] = useState("");
  const [foodId, setFoodId] = useState("");
  const [identityId, setIdentityId] = useState(settings.activeIdentityId);
  const [defaultGrams, setDefaultGrams] = useState(100);
  const selectedFood = catalog.find((food) => food.id === foodId);
  function save() {
    if (!selectedFood || defaultGrams <= 0) return;
    const identity = identities.find((candidate) => candidate.identityId === identityId) ?? identities[0];
    const itemId = `custom:${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
    const linkedFoodId = selectedFood.id.startsWith("custom:") || selectedFood.id.startsWith("passive:") ? selectedFood.id : `passive:${itemId}`;
    const ingredient = linkedFoodId === selectedFood.id ? undefined : {
      id: linkedFoodId,
      displayName: itemName.trim() || selectedFood.displayName,
      brandName: "Quick log",
      classification: "passive_custom",
      kcal100g: selectedFood.kcal100g,
      protein100g: selectedFood.protein100g,
      carbs100g: selectedFood.carbs100g,
      fat100g: selectedFood.fat100g,
      sourceKind: "passive" as const,
      iconName: selectedFood.iconName ?? "",
      updatedAt: new Date().toISOString(),
    };
    onSave({
      ...settings,
      passiveQuickLogItems: [
        ...settings.passiveQuickLogItems,
        {
          itemId,
          itemName: itemName.trim() || selectedFood.displayName,
          identityId: identity.identityId,
          identityName: identity.identityName,
          linkedFoodId,
          defaultGrams,
          ingredients: [],
        },
      ],
    }, ingredient);
    setItemName("");
    setFoodId("");
    setDefaultGrams(100);
  }
  return <section className="split"><div className="panel"><h2>Add quick-log item</h2><label>Display name<input value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder={selectedFood?.displayName ?? "Quick-log name"} /></label><label>Food<select value={foodId} onChange={(event) => setFoodId(event.target.value)}><option value="">Choose food or ingredient</option>{catalog.slice(0, 700).map((food) => <option key={food.id} value={food.id}>{food.displayName}</option>)}</select></label><label>Default grams<input type="number" min="1" value={defaultGrams} onChange={(event) => setDefaultGrams(Number(event.target.value))} /></label><label>Identity<select value={identityId} onChange={(event) => setIdentityId(event.target.value)}>{identities.map((identity) => <option key={identity.identityId} value={identity.identityId}>{identity.identityName}</option>)}</select></label><button className="primary" disabled={!foodId || defaultGrams <= 0} onClick={save}>Save quick-log item</button></div><div className="panel"><h2>Configured quick-log</h2>{settings.passiveQuickLogItems.map((item) => <article className="recipe-card" key={`${item.identityId}-${item.itemId}`}><div><h3>{item.itemName}</h3><p>{item.defaultGrams}g | {item.identityName} | {item.linkedFoodId}</p></div><div className="button-row"><button onClick={() => onWriteToken(item)}>Write token</button><button onClick={() => { const next = Number(prompt("Default grams", item.defaultGrams.toString())); if (Number.isFinite(next) && next > 0) onSave({ ...settings, passiveQuickLogItems: settings.passiveQuickLogItems.map((candidate) => candidate === item ? { ...candidate, defaultGrams: next } : candidate) }); }}>Edit grams</button><button onClick={() => onSave({ ...settings, passiveQuickLogItems: settings.passiveQuickLogItems.filter((candidate) => candidate !== item) })}><Trash2 size={16} /></button></div></article>)}</div></section>;
}

function IngredientForm({ ingredient, onSave }: { ingredient: UserIngredient | null; onSave: (ingredient: UserIngredient) => void }) {
  const [draft, setDraft] = useState<UserIngredient>(ingredient ?? blankIngredient());
  useEffect(() => setDraft(ingredient ?? blankIngredient()), [ingredient]);
  return <div className="panel"><h2>{ingredient ? "Edit ingredient" : "Create ingredient"}</h2><label>Name<input value={draft.displayName} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} /></label><label>Brand<input value={draft.brandName} onChange={(event) => setDraft({ ...draft, brandName: event.target.value })} /></label><label>Classification<input value={draft.classification} onChange={(event) => setDraft({ ...draft, classification: event.target.value })} /></label><div className="macro-edit"><label>kcal<input type="number" value={draft.kcal100g} onChange={(event) => setDraft({ ...draft, kcal100g: Number(event.target.value) })} /></label><label>Protein<input type="number" value={draft.protein100g} onChange={(event) => setDraft({ ...draft, protein100g: Number(event.target.value) })} /></label><label>Carbs<input type="number" value={draft.carbs100g} onChange={(event) => setDraft({ ...draft, carbs100g: Number(event.target.value) })} /></label><label>Fat<input type="number" value={draft.fat100g} onChange={(event) => setDraft({ ...draft, fat100g: Number(event.target.value) })} /></label></div><button className="primary" disabled={!draft.displayName.trim()} onClick={() => onSave({ ...draft, id: draft.id || `custom:${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`, updatedAt: new Date().toISOString() })}>Save ingredient</button></div>;
}

function GenericTokensScreen({ ingredients, logs, onWriteToken, onSave, onDelete }: { ingredients: UserIngredient[]; logs: LogEntry[]; onWriteToken: (food: FoodCatalogItem) => void; onSave: (ingredient: UserIngredient) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<UserIngredient | null>(null);
  const customGenericTokens = ingredients.filter((ingredient) => ingredient.sourceKind === "generic").map(ingredientToCatalogItem);
  const genericTokens = [...DEFAULT_GENERIC_FOODS, ...customGenericTokens.filter((ingredient) => !DEFAULT_GENERIC_FOODS.some((defaultToken) => defaultToken.id === ingredient.id))];
  const usedIds = new Set(logs.map((log) => log.foodId));
  return <section className="split"><GenericTokenForm token={editing} onSave={(token) => { onSave(token); setEditing(null); }} /><div className="panel"><h2>Generic food tokens</h2>{genericTokens.map((token) => { const custom = token.id.startsWith("generic:"); return <article className="recipe-card" key={token.id}><span className="thumb">{token.thumbnailLabel || "G"}</span><div><h3>{token.displayName}</h3><p>{token.uxCategory} | {token.kcal100g} kcal/100g</p></div><div className="button-row"><button onClick={() => onWriteToken(token)}>Write token</button>{custom ? <button title="Edit token" onClick={() => setEditing(ingredients.find((ingredient) => ingredient.id === token.id) ?? null)}><Edit3 size={16} /></button> : null}<button disabled={!custom || usedIds.has(token.id)} title={!custom ? "Built-in generic tokens cannot be deleted" : usedIds.has(token.id) ? "Used by logs" : "Delete token"} onClick={() => onDelete(token.id)}><Trash2 size={16} /></button></div></article>; })}</div></section>;
}

function GenericTokenForm({ token, onSave }: { token: UserIngredient | null; onSave: (ingredient: UserIngredient) => void }) {
  const [draft, setDraft] = useState<UserIngredient>(token ?? blankGenericToken());
  useEffect(() => setDraft(token ?? blankGenericToken()), [token]);
  return <div className="panel"><h2>{token ? "Edit generic token" : "Create generic token"}</h2><label>Name<input value={draft.displayName} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} placeholder="Unknown cereal, shared snack, oil splash" /></label><div className="form-grid two"><label>Classification<input value={draft.classification} onChange={(event) => setDraft({ ...draft, classification: event.target.value })} /></label><label>Icon<input value={draft.iconName} onChange={(event) => setDraft({ ...draft, iconName: event.target.value })} /></label></div><div className="macro-edit"><label>kcal<input type="number" value={draft.kcal100g} onChange={(event) => setDraft({ ...draft, kcal100g: Number(event.target.value) })} /></label><label>Protein<input type="number" value={draft.protein100g} onChange={(event) => setDraft({ ...draft, protein100g: Number(event.target.value) })} /></label><label>Carbs<input type="number" value={draft.carbs100g} onChange={(event) => setDraft({ ...draft, carbs100g: Number(event.target.value) })} /></label><label>Fat<input type="number" value={draft.fat100g} onChange={(event) => setDraft({ ...draft, fat100g: Number(event.target.value) })} /></label></div><button className="primary" disabled={!draft.displayName.trim()} onClick={() => onSave({ ...draft, id: draft.id || `generic:${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`, brandName: draft.brandName || "Generic", sourceKind: "generic", updatedAt: new Date().toISOString() })}>Save generic token</button></div>;
}

function RecipesScreen({ catalog, foodsById, recipes, settings, favoriteRecipeIds, onToggleFavorite, onWriteToken, onSave, onDelete, onLog }: { catalog: FoodCatalogItem[]; foodsById: Map<string, FoodCatalogItem>; recipes: Recipe[]; settings: AppSettings; favoriteRecipeIds: Set<string>; onToggleFavorite: (recipeId: string) => void; onWriteToken: (recipe: Recipe) => void; onSave: (recipe: Recipe) => void; onDelete: (recipeId: string) => void; onLog: (entries: LogEntry[]) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mealLabel, setMealLabel] = useState("dinner");
  const [iconName, setIconName] = useState("");
  const [foodId, setFoodId] = useState("");
  const [grams, setGrams] = useState(100);
  const [portion, setPortion] = useState(300);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  function clearEditor() {
    setEditingId(null);
    setName("");
    setMealLabel("dinner");
    setIconName("");
    setIngredients([]);
  }
  function editRecipe(recipe: Recipe) {
    setEditingId(recipe.id);
    setName(recipe.name);
    setMealLabel(recipe.mealLabel || "dinner");
    setIconName(recipe.iconName || "");
    setIngredients(recipe.ingredients);
  }
  function saveRecipe() {
    const existing = recipes.find((recipe) => recipe.id === editingId);
    onSave({ id: existing?.id ?? crypto.randomUUID(), name: name.trim(), type: "SINGLE", mealLabel, iconName, ingredients, createdAt: existing?.createdAt ?? new Date().toISOString(), lastWrittenTagId: existing?.lastWrittenTagId ?? null });
    clearEditor();
  }
  return <section className="split"><div className="panel"><div className="title-row"><h2>{editingId ? "Edit recipe" : "Create recipe"}</h2>{editingId ? <button onClick={clearEditor}>New</button> : null}</div><label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Recipe name" /></label><div className="form-grid two"><label>Meal<select value={mealLabel} onChange={(event) => setMealLabel(event.target.value)}>{["breakfast", "lunch", "dinner", "snacks"].map((meal) => <option key={meal}>{meal}</option>)}</select></label><label>Icon<input value={iconName} onChange={(event) => setIconName(event.target.value)} placeholder="Optional label" /></label></div><div className="inline-form"><select value={foodId} onChange={(event) => setFoodId(event.target.value)}><option value="">Choose ingredient</option>{catalog.slice(0, 800).map((food) => <option key={food.id} value={food.id}>{food.displayName}</option>)}</select><input type="number" value={grams} min="0" onChange={(event) => setGrams(Number(event.target.value))} /><button onClick={() => foodId && setIngredients([...ingredients, { foodId, grams }])}>Add</button></div><ul className="plain-list">{ingredients.map((ingredient, index) => <li key={`${ingredient.foodId}-${index}`} className="plain-row"><span>{foodsById.get(ingredient.foodId)?.displayName ?? ingredient.foodId} - {ingredient.grams}g</span><button title="Remove ingredient" onClick={() => setIngredients(ingredients.filter((_, itemIndex) => itemIndex !== index))}><X size={16} /></button></li>)}</ul><button className="primary" disabled={!name.trim() || ingredients.length === 0} onClick={saveRecipe}>Save recipe</button></div><div className="panel"><h2>Recipe library</h2><label>Manual portion grams<input type="number" min="1" value={portion} onChange={(event) => setPortion(Number(event.target.value))} /></label>{recipes.map((recipe) => <article className="recipe-card" key={recipe.id}><span className="thumb">{recipe.iconName || recipe.name.slice(0, 2)}</span><div><h3>{recipe.name}</h3><p>{recipe.ingredients.length} ingredients | {recipe.mealLabel} | {Math.round(recipeTotals(recipe, foodsById).kcal)} kcal total</p></div><div className="button-row"><button className={favoriteRecipeIds.has(recipe.id) ? "icon-button favorite active" : "icon-button favorite"} title="Favorite recipe" onClick={() => onToggleFavorite(recipe.id)}><Star size={17} /></button><button title="Edit recipe" onClick={() => editRecipe(recipe)}><Edit3 size={16} /></button><button onClick={() => onWriteToken(recipe)}>Write token</button><button onClick={() => onLog(recipePortionLogs(recipe, portion, todayIso(), settings.activeIdentityId, settings.activeIdentityName, recipe.mealLabel))}>Log portion</button><button title="Delete recipe" onClick={() => onDelete(recipe.id)}><Trash2 size={16} /></button></div></article>)}</div></section>;
}

function ReviewScreen({ zeroWeightEntries, unknownEntries, foodsById, searchResults, query, setQuery, onResolveZero, onDelete, onResolveUnknown }: { zeroWeightEntries: LogEntry[]; unknownEntries: LogEntry[]; foodsById: Map<string, FoodCatalogItem>; searchResults: ReturnType<typeof searchFoods>; query: string; setQuery: (value: string) => void; onResolveZero: (entry: LogEntry, grams: number) => void; onDelete: (id: string) => void; onResolveUnknown: (entry: LogEntry, foodId: string) => void }) {
  const [target, setTarget] = useState<LogEntry | null>(null);
  const [grams, setGrams] = useState(100);
  return <section className="split"><div className="panel"><h2>Zero-weight review</h2>{zeroWeightEntries.map((entry) => <ReviewRow key={entry.id} entry={entry} foodsById={foodsById}><input type="number" value={grams} onChange={(event) => setGrams(Number(event.target.value))} /><button onClick={() => onResolveZero(entry, grams)}>Correct</button><button onClick={() => onResolveZero(entry, 0)}>Keep 0g</button><button onClick={() => onDelete(entry.id)}>Remove</button></ReviewRow>)}<h2>Unknown/generic review</h2>{unknownEntries.map((entry) => <ReviewRow key={entry.id} entry={entry} foodsById={foodsById}><button onClick={() => setTarget(entry)}>Map food</button></ReviewRow>)}</div><div className="panel">{target ? <><h2>Map source</h2><p className="muted">{target.scaleItemName ?? target.placeholderTokenLabel ?? target.foodId}</p><FoodResultPanel query={query} setQuery={setQuery} results={searchResults} onSelect={(food) => { onResolveUnknown(target, food.id); setTarget(null); }} /></> : <p className="muted">Choose an unresolved entry to map it to a known food or ingredient.</p>}</div></section>;
}

function ReviewRow({ entry, foodsById, children }: { entry: LogEntry; foodsById: Map<string, FoodCatalogItem>; children: React.ReactNode }) {
  const food = foodsById.get(entry.foodId);
  return <article className="log-row"><span className="thumb">{food?.thumbnailLabel ?? "?"}</span><div><strong>{food?.displayName ?? entry.scaleItemName ?? "Unresolved entry"}</strong><small>{entry.timestamp} | {entry.grams}g | {entry.source}</small></div><div className="log-actions">{children}</div></article>;
}

function IdentitiesScreen({ identities, settings, onWriteToken, onSave, onDelete, onSwitch }: { identities: IdentityProfile[]; settings: AppSettings; onWriteToken: (identity: IdentityProfile) => void; onSave: (identity: IdentityProfile) => void; onDelete: (id: string) => void; onSwitch: (identity: IdentityProfile) => void }) {
  const [name, setName] = useState("");
  return <section className="panel"><h2>People</h2><div className="inline-form"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="New identity name" /><button className="primary" disabled={!name.trim()} onClick={() => { onSave({ ...blankIdentity(), identityId: `identity:${crypto.randomUUID().slice(0, 8)}`, identityName: name, profileType: "secondary" }); setName(""); }}>Create</button></div>{identities.map((identity) => <IdentityCard key={identity.identityId} identity={identity} active={settings.activeIdentityId === identity.identityId} onWriteToken={onWriteToken} onSave={onSave} onDelete={onDelete} onSwitch={onSwitch} />)}</section>;
}

function IdentityCard({ identity, active, onWriteToken, onSave, onDelete, onSwitch }: { identity: IdentityProfile; active: boolean; onWriteToken: (identity: IdentityProfile) => void; onSave: (identity: IdentityProfile) => void; onDelete: (id: string) => void; onSwitch: (identity: IdentityProfile) => void }) {
  const [open, setOpen] = useState(false);
  return <article className="recipe-card identity-card"><div><h3>{identity.identityName}</h3><p>{identity.profileType}{active ? " | active" : ""}</p></div><div className="button-row"><button onClick={() => onSwitch(identity)}>Use</button><button onClick={() => onWriteToken(identity)}>Write token</button><button onClick={() => setOpen(!open)}>Details</button><button disabled={identity.profileType === "primary"} onClick={() => { if (window.confirm(`Remove ${identity.identityName}? Historical logs will keep their saved identity name.`)) onDelete(identity.identityId); }}><Trash2 size={16} /></button></div>{open ? <div className="identity-detail"><label>Name<input value={identity.identityName} onChange={(event) => onSave({ ...identity, identityName: event.target.value })} /></label><div className="macro-edit"><label>Daily kcal<input type="number" value={identity.dailyCaloriesTarget ?? ""} onChange={(event) => onSave({ ...identity, dailyCaloriesTarget: numberOrNull(event.target.value) })} /></label><label>Protein target<input type="number" value={identity.proteinTarget ?? ""} onChange={(event) => onSave({ ...identity, proteinTarget: numberOrNull(event.target.value) })} /></label><label>Carbs target<input type="number" value={identity.carbsTarget ?? ""} onChange={(event) => onSave({ ...identity, carbsTarget: numberOrNull(event.target.value) })} /></label><label>Fat target<input type="number" value={identity.fatTarget ?? ""} onChange={(event) => onSave({ ...identity, fatTarget: numberOrNull(event.target.value) })} /></label></div><label><input type="checkbox" checked={identity.zeroWeightReviewEnabled} onChange={(event) => onSave({ ...identity, zeroWeightReviewEnabled: event.target.checked })} /> Zero-weight review</label><label><input type="checkbox" checked={identity.genericReviewEnabled} onChange={(event) => onSave({ ...identity, genericReviewEnabled: event.target.checked })} /> Generic entry review</label></div> : null}</article>;
}

function DataScreen({ settings, logs, recipes, ingredients, identities, sourceMappings, foodPreferences, foodsById, onRestored }: { settings: AppSettings; logs: LogEntry[]; recipes: Recipe[]; ingredients: UserIngredient[]; identities: IdentityProfile[]; sourceMappings: SourceMapping[]; foodPreferences: FoodPreference[]; foodsById: Map<string, FoodCatalogItem>; onRestored: () => void }) {
  const [error, setError] = useState("");
  const [range, setRange] = useState("all");
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState(todayIso());
  const backup = () => buildBackup({ settings, logs, recipes, ingredients, identities, sourceMappings, foodPreferences });
  const exportLogs = filteredLogs(logs, range, startDate, endDate);
  return <section className="panel settings-grid"><button onClick={() => downloadText(`axiom_web_backup_${todayIso()}.json`, JSON.stringify(backup(), null, 2), "application/json")}>Download backup JSON</button><div className="settings-section"><h2>Logs CSV</h2><label>Range<select value={range} onChange={(event) => setRange(event.target.value)}><option value="all">All logs</option><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="custom">Custom dates</option></select></label>{range === "custom" ? <div className="form-grid two"><label>Start<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label><label>End<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label></div> : null}<button onClick={() => downloadText(`axiom_web_logs_${todayIso()}.csv`, logsToCsv(exportLogs, (id) => foodsById.get(id)?.displayName ?? id), "text/csv")}>Download logs CSV ({exportLogs.length})</button></div><label>Restore backup<input type="file" accept="application/json" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const parsed = decodeBackup(await file.text()); if (!window.confirm("Restore this backup and overwrite local Axiom data on this device?")) return; await replaceAllData(parsed.data); await onRestored(); setError("Backup restored with overwrite semantics."); } catch (restoreError) { setError(restoreError instanceof Error ? restoreError.message : "Restore failed."); } }} /></label>{error ? <p className="toast">{error}</p> : null}</section>;
}

function HelpScreen() {
  return <section className="panel help"><h2>Help and setup</h2><h3>Install</h3><p>Add Axiom Web to your Home Screen from the browser share menu after the app has loaded once.</p><h3>Local data</h3><p>Your logs, recipes, ingredients, quick-log items, mappings, and people profiles are stored locally in this browser.</p><h3>Offline use</h3><p>After a successful first load, the app shell and bundled food catalog are cached for offline use. Open Food Facts barcode lookup is optional and needs network access.</p><h3>Backup and restore</h3><p>Use Data to download a backup before resetting, changing devices, or restoring. Restore validates the backup before overwriting local data.</p><h3>Write Tokens</h3><p>Use Write Tokens to prepare a mixed token queue for foods, recipes, people, and generic foods. Food and recipe tokens can be configured as weighed items or quick logs. Scale-side writing will become available when your scale supports Web App connection.</p><h3>Build</h3><p>Version {__APP_VERSION__} · {__BUILD_SHA__} · {new Date(__BUILD_TIME__).toLocaleString()}</p></section>;
}

function SettingsScreen({ settings, setSettings, onReset }: { settings: AppSettings; setSettings: (settings: AppSettings) => void; onReset: () => void }) {
  return <section className="panel settings-grid"><label>Preferred store<input value={settings.preferredStoreName ?? ""} onChange={(event) => setSettings({ ...settings, preferredStoreName: event.target.value || null })} /></label><div className="settings-section"><h2>Review</h2><label><input type="checkbox" checked={settings.zeroWeightReviewEnabled} onChange={(event) => setSettings({ ...settings, zeroWeightReviewEnabled: event.target.checked })} /> Zero-weight review</label><label><input type="checkbox" checked={settings.autoZeroWeightCleanupEnabled} onChange={(event) => setSettings({ ...settings, autoZeroWeightCleanupEnabled: event.target.checked })} /> Auto-clear unchanged zero-weight entries</label><label>Zero-weight retention days<input type="number" min="1" value={settings.autoZeroWeightCleanupDays} onChange={(event) => setSettings({ ...settings, autoZeroWeightCleanupDays: Number(event.target.value) })} /></label><label><input type="checkbox" checked={settings.genericReviewEnabled} onChange={(event) => setSettings({ ...settings, genericReviewEnabled: event.target.checked })} /> Generic entry review</label><label><input type="checkbox" checked={settings.genericAutoAcceptEnabled} onChange={(event) => setSettings({ ...settings, genericAutoAcceptEnabled: event.target.checked })} /> Auto-accept unchanged generic defaults</label><label>Generic default retention days<input type="number" min="1" value={settings.genericAutoAcceptDays} onChange={(event) => setSettings({ ...settings, genericAutoAcceptDays: Number(event.target.value) })} /></label></div><div className="settings-section"><h2>People</h2><label><input type="checkbox" checked={settings.identityEnabled} onChange={(event) => setSettings({ ...settings, identityEnabled: event.target.checked })} /> Identity-aware logging</label><label><input type="checkbox" checked={settings.showDefaultIdentity} onChange={(event) => setSettings({ ...settings, showDefaultIdentity: event.target.checked })} /> Show default identity</label><label>Identity inactivity timeout minutes<input type="number" min="1" value={settings.identityInactivityTimeoutMinutes} onChange={(event) => setSettings({ ...settings, identityInactivityTimeoutMinutes: Number(event.target.value) })} /></label></div><button className="danger" onClick={onReset}>Reset local data</button></section>;
}

function ScaleScreen({ existingLogs, mappings, passiveItems, onImport }: { existingLogs: LogEntry[]; mappings: SourceMapping[]; passiveItems: AppSettings["passiveQuickLogItems"]; onImport: (entries: LogEntry[]) => void }) {
  const [status, setStatus] = useState("No compatible physical transport is available yet.");
  const [mockEnabled, setMockEnabled] = useState(false);
  async function tryUnavailable() { try { await new UnavailableScaleTransport().connect(); } catch (error) { setStatus(error instanceof Error ? error.message : "Scale transport unavailable."); } }
  async function importMock() {
    if (!import.meta.env.DEV) return;
    const { MockScaleTransport } = await import("../hardware/MockScaleTransport");
    const transport = new MockScaleTransport();
    await transport.connect();
    const deviceStatus = parseStatusBlock(await transport.sendCommand("STATUS"));
    const existingIds = new Set(existingLogs.map((entry) => entry.id));
    const entries = parseRawLogLines(await transport.sendCommand("LOGS")).map((record) => scaleRecordToLogEntry(record, existingIds)).filter((entry): entry is LogEntry => Boolean(entry)).map((entry) => applyPassiveShortcutConfig(applySourceMappings(entry, mappings), passiveItems));
    await onImport(entries);
    setStatus(`Mock ${deviceStatus.protocolVersion} import complete: ${entries.length} new event(s).`);
  }
  return <section className="panel"><h2>Scale sync</h2><div className="status-pill">Scale connection pending</div><p className="muted">{status}</p><p className="muted">Manual logging, review, recipes, backup, offline use, and token queue preparation are available now. Scale connection will become available when your scale supports Web App connection.</p><div className="button-row"><button onClick={tryUnavailable}>Check scale connection</button>{import.meta.env.DEV ? <><label><input type="checkbox" checked={mockEnabled} onChange={(event) => setMockEnabled(event.target.checked)} /> Development mock</label><button disabled={!mockEnabled} onClick={importMock}>Import mock log block</button></> : null}</div></section>;
}

function MealGroups({ groups, editable, onUpdate, onDelete }: { groups: ReturnType<typeof groupEntriesByMeal>; editable: boolean; onUpdate?: (entry: LogEntry, grams: number, meal: string) => void; onDelete?: (entryId: string) => void }) {
  if (groups.length === 0) return <div className="empty">No logs for this day.</div>;
  return <div className="stack">{groups.map((group) => <section className="panel" key={group.groupId}><h2>{group.label} <small>{group.timeRangeLabel}</small></h2>{group.entries.map((item) => <article className="log-row" key={item.entry.id}><span className="thumb">{item.food?.thumbnailLabel ?? "?"}</span><div><strong>{item.entry.scaleRecipeName ? `${item.entry.scaleRecipeName}: ${item.name}` : item.name}</strong><small>{item.entry.grams}g | {item.caloriesRounded} kcal | {item.reviewReasons.join(", ")}</small></div>{editable ? <div className="log-actions"><input type="number" defaultValue={item.entry.grams} onBlur={(event) => onUpdate?.(item.entry, Number(event.target.value), item.mealLabel)} /><select defaultValue={item.mealLabel} onChange={(event) => onUpdate?.(item.entry, item.entry.grams, event.target.value)}>{["breakfast", "lunch", "dinner", "snacks"].map((meal) => <option key={meal}>{meal}</option>)}</select><button title="Delete log" onClick={() => onDelete?.(item.entry.id)}><Trash2 size={16} /></button></div> : null}</article>)}</section>)}</div>;
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{unit}</small></div>;
}

function MacroStrip({ macros }: { macros: { kcal: number; carbs: number; fat: number; protein: number } }) {
  return <div className="macro-strip"><Metric label="Calories" value={Math.round(macros.kcal).toString()} unit="kcal" /><Metric label="Protein" value={macros.protein.toFixed(1)} unit="g" /><Metric label="Carbs" value={macros.carbs.toFixed(1)} unit="g" /><Metric label="Fat" value={macros.fat.toFixed(1)} unit="g" /></div>;
}

function blankIngredient(): UserIngredient {
  return { id: "", displayName: "", brandName: "", classification: "Ingredient", kcal100g: 0, protein100g: 0, carbs100g: 0, fat100g: 0, sourceKind: "user", iconName: "", updatedAt: new Date().toISOString() };
}

function blankGenericToken(): UserIngredient {
  return { id: "", displayName: "", brandName: "Generic", classification: "generic_token", kcal100g: 0, protein100g: 0, carbs100g: 0, fat100g: 0, sourceKind: "generic", iconName: "G", updatedAt: new Date().toISOString() };
}

function blankIdentity(): IdentityProfile {
  return { identityId: "", identityName: "", profileType: "secondary", zeroWeightReviewEnabled: true, zeroWeightYellowIndicatorEnabled: true, genericReviewEnabled: true, genericWeekRefinementEnabled: true };
}

function draftToIngredient(draft: OpenFoodFactsDraft | null): UserIngredient | null {
  if (!draft) return null;
  return {
    id: `off:${draft.barcode}`,
    displayName: draft.displayName,
    brandName: draft.brandName,
    classification: "ingredient",
    kcal100g: draft.kcal100g ?? 0,
    protein100g: draft.protein100g ?? 0,
    carbs100g: draft.carbs100g ?? 0,
    fat100g: draft.fat100g ?? 0,
    sourceKind: "open_food_facts",
    iconName: "",
    updatedAt: new Date().toISOString(),
  };
}

function numberOrNull(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function tokenTypeLabel(type: TokenDefinition["tokenType"]): string {
  return { ingredient: "Ingredient", recipe: "Recipe", identity: "Identity", shortcut: "Quick-log", generic: "Generic" }[type];
}

function definitionTokenTypeLabel(definition: TokenDefinition): string {
  if (definition.tokenType === "shortcut") return definition.entityType === "shortcut_recipe" ? "Recipe" : "Food";
  if (definition.tokenType === "ingredient") return "Food";
  if (definition.tokenType === "generic") return "Generic food";
  return tokenTypeLabel(definition.tokenType);
}

function queueTokenTypeLabel(item: TokenWriteQueueItem): string {
  if (item.tokenType === "shortcut") return item.sourceEntityId.startsWith("recipe:") ? "Recipe" : "Food";
  if (item.tokenType === "ingredient") return "Food";
  if (item.tokenType === "generic") return "Generic food";
  return tokenTypeLabel(item.tokenType);
}

function filteredLogs(logs: LogEntry[], range: string, startDate: string, endDate: string): LogEntry[] {
  if (range === "all") return logs;
  const today = todayIso();
  if (range === "today") return logs.filter((entry) => entry.timestamp.slice(0, 10) === today);
  if (range === "7d" || range === "30d") {
    const days = range === "7d" ? 7 : 30;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    const startIso = start.toISOString().slice(0, 10);
    return logs.filter((entry) => {
      const date = entry.timestamp.slice(0, 10);
      return date >= startIso && date <= today;
    });
  }
  return logs.filter((entry) => {
    const date = entry.timestamp.slice(0, 10);
    return date >= startDate && date <= endDate;
  });
}

function titleFor(screen: Screen): string {
  return { today: "Today", search: "Food search", timeline: "Timeline", recipes: "Recipes", ingredients: "Ingredients", generic: "Generic tokens", barcode: "Barcode", passive: "Quick-log", review: "Review", identities: "People", data: "Data", help: "Help", settings: "Settings", scale: "Scale sync", writeTokens: "Write Tokens" }[screen];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
