import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Camera, Database, Ellipsis, HelpCircle, History, Home, Search, Settings, Scale, Tags, Trash2, UserRound, X } from "lucide-react";
import type { AppSettings, FoodCatalogItem, IdentityProfile, LogEntry, Recipe, RecipeIngredient, SourceMapping, UserIngredient } from "../domain/models";
import { entriesForDate, groupEntriesByMeal } from "../domain/grouping";
import { macrosForFood, recipeTotals } from "../domain/nutrition";
import { ingredientToCatalogItem, loadFoodCatalog, searchFoods } from "../data/foodService";
import { buildBackup, decodeBackup, downloadText, logsToCsv } from "../data/backup";
import { lookupOpenFoodFacts, normalizeBarcode, type OpenFoodFactsDraft } from "../data/openFoodFacts";
import { registerServiceWorker } from "../pwa";
import { applyPassiveShortcutConfig, applySourceMappings, isUnknownUnresolved, isZeroWeightUnresolved, resolveUnknownEntry, resolveZeroWeight, sourceKeyForEntry } from "../domain/review";
import { recipePortionLogs } from "../domain/recipes";
import {
  deleteIngredient,
  deleteIdentity,
  deleteLog,
  deleteRecipe,
  getIdentities,
  getIngredients,
  getLogs,
  getRecipes,
  getSettings,
  getSourceMappings,
  replaceAllData,
  resetLocalData,
  saveSettings,
  upsertIdentity,
  upsertIngredient,
  upsertLog,
  upsertRecipe,
  upsertSourceMapping,
} from "../persistence/db";
import { UnavailableScaleTransport } from "../hardware/ScaleTransport";
import { parseRawLogLines, parseStatusBlock, scaleRecordToLogEntry } from "../protocol/smartScaleProtocol";

type Screen = "today" | "search" | "timeline" | "recipes" | "ingredients" | "barcode" | "passive" | "review" | "identities" | "data" | "help" | "settings" | "scale";

type NavItem = { screen: Screen; label: string; icon: typeof Home };

const primaryNavItems: NavItem[] = [
  { screen: "today", label: "Today", icon: Home },
  { screen: "search", label: "Search", icon: Search },
  { screen: "timeline", label: "Timeline", icon: History },
  { screen: "recipes", label: "Recipes", icon: BookOpen },
];

const moreGroups: Array<{ title: string; items: NavItem[] }> = [
  { title: "Libraries", items: [
    { screen: "ingredients", label: "Ingredients", icon: Tags },
    { screen: "barcode", label: "Barcode", icon: Camera },
    { screen: "passive", label: "Quick-log", icon: Scale },
  ] },
  { title: "Review & People", items: [
    { screen: "review", label: "Review", icon: AlertTriangle },
    { screen: "identities", label: "People", icon: UserRound },
  ] },
  { title: "Device", items: [
    { screen: "scale", label: "Scale", icon: Scale },
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
  const [settings, setSettingsState] = useState<AppSettings | null>(null);
  const [screen, setScreen] = useState<Screen>("today");
  const [query, setQuery] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [grams, setGrams] = useState(100);
  const [date, setDate] = useState(todayIso());
  const [message, setMessage] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

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
    const [loadedCatalog, loadedIngredients, loadedLogs, loadedRecipes, loadedSettings, loadedIdentities, loadedMappings] = await Promise.all([
      loadFoodCatalog(),
      getIngredients(),
      getLogs(),
      getRecipes(),
      getSettings(),
      getIdentities(),
      getSourceMappings(),
    ]);
    setBaseCatalog(loadedCatalog);
    setIngredients(loadedIngredients);
    setLogs(loadedLogs.map((entry) => applyPassiveShortcutConfig(applySourceMappings(entry, loadedMappings), loadedSettings.passiveQuickLogItems)));
    setRecipes(loadedRecipes);
    setSettingsState(loadedSettings);
    setIdentities(loadedIdentities);
    setSourceMappings(loadedMappings);
  }

  const catalog = useMemo(() => [...ingredients.map(ingredientToCatalogItem), ...baseCatalog], [ingredients, baseCatalog]);
  const foodsById = useMemo(() => new Map(catalog.map((food) => [food.id, food])), [catalog]);
  const selectedFood = selectedFoodId ? foodsById.get(selectedFoodId) : undefined;
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
    await upsertLog(entry);
    await loadAll();
    setMessage(`Logged ${Math.round(amount)}g ${food.displayName}`);
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
        {screen === "search" && <SearchScreen query={query} setQuery={setQuery} results={searchResults} selectedFood={selectedFood} grams={grams} setGrams={setGrams} onSelect={(food) => setSelectedFoodId(food.id)} onLog={logFood} />}
        {screen === "timeline" && <TimelineScreen date={date} setDate={setDate} groups={groups} onUpdate={async (entry, nextGrams, meal) => { await upsertLog({ ...entry, grams: nextGrams, zeroWeightFlag: nextGrams === 0, mealLabelOverride: meal }); await loadAll(); }} onDelete={async (entryId) => { await deleteLog(entryId); await loadAll(); }} />}
        {screen === "recipes" && <RecipesScreen catalog={catalog} foodsById={foodsById} recipes={recipes} settings={settings} onSave={async (recipe) => { await upsertRecipe(recipe); await loadAll(); }} onDelete={async (recipeId) => { await deleteRecipe(recipeId); await loadAll(); }} onLog={async (entries) => { for (const entry of entries) await upsertLog(entry); await loadAll(); setScreen("today"); setMessage("Recipe logged"); }} />}
        {screen === "ingredients" && <IngredientsScreen ingredients={ingredients} logs={logs} recipes={recipes} onSave={async (ingredient) => { await upsertIngredient(ingredient); await loadAll(); }} onDelete={async (id) => { await deleteIngredient(id); await loadAll(); }} />}
        {screen === "barcode" && <BarcodeScreen onSave={async (ingredient) => { await upsertIngredient(ingredient); await loadAll(); setScreen("ingredients"); setMessage("Barcode ingredient saved"); }} />}
        {screen === "passive" && <PassiveScreen settings={settings} identities={identities} catalog={catalog} onSave={async (nextSettings, ingredient) => { if (ingredient) await upsertIngredient(ingredient); await setSettings(nextSettings); }} />}
        {screen === "review" && <ReviewScreen zeroWeightEntries={zeroWeightEntries} unknownEntries={unknownEntries} foodsById={foodsById} searchResults={searchResults} query={query} setQuery={setQuery} onResolveZero={async (entry, nextGrams) => { await upsertLog(resolveZeroWeight(entry, nextGrams)); await loadAll(); }} onDelete={async (id) => { await deleteLog(id); await loadAll(); }} onResolveUnknown={async (entry, foodId) => { const resolved = resolveUnknownEntry(entry, foodId); await upsertLog(resolved); const key = sourceKeyForEntry(entry); if (key) await upsertSourceMapping({ sourceKey: key, foodId, displayName: foodsById.get(foodId)?.displayName ?? foodId, updatedAt: new Date().toISOString() }); await loadAll(); }} />}
        {screen === "identities" && <IdentitiesScreen identities={identities} settings={settings} onSave={async (identity) => { await upsertIdentity(identity); await loadAll(); }} onDelete={async (id) => { await deleteIdentity(id); if (settings.activeIdentityId === id) await saveSettings({ ...settings, activeIdentityId: "default", activeIdentityName: "Default" }); await loadAll(); }} onSwitch={async (identity) => setSettings({ ...settings, activeIdentityId: identity.identityId, activeIdentityName: identity.identityName })} />}
        {screen === "data" && <DataScreen settings={settings} logs={logs} recipes={recipes} ingredients={ingredients} identities={identities} sourceMappings={sourceMappings} foodsById={foodsById} onRestored={loadAll} />}
        {screen === "help" && <HelpScreen />}
        {screen === "settings" && <SettingsScreen settings={settings} setSettings={setSettings} onReset={async () => { if (!window.confirm("Reset local Axiom data on this device? Export a backup first if you want to keep it.")) return; await resetLocalData(); await loadAll(); setMessage("Local app data reset"); }} />}
        {screen === "scale" && <ScaleScreen existingLogs={logs} mappings={sourceMappings} passiveItems={settings.passiveQuickLogItems} onImport={async (entries) => { for (const entry of entries) await upsertLog(entry); await loadAll(); }} />}
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

function SearchScreen(props: { query: string; setQuery: (value: string) => void; results: ReturnType<typeof searchFoods>; selectedFood?: FoodCatalogItem; grams: number; setGrams: (value: number) => void; onSelect: (food: FoodCatalogItem) => void; onLog: (food: FoodCatalogItem, grams: number, mealLabel?: string) => void }) {
  const preview = props.selectedFood ? macrosForFood(props.selectedFood, props.grams) : null;
  return <section className="split"><FoodResultPanel query={props.query} setQuery={props.setQuery} results={props.results} onSelect={props.onSelect} /><div className="panel sticky">{props.selectedFood ? <><h2>{props.selectedFood.displayName}</h2><p className="muted">{[props.selectedFood.brandName, props.selectedFood.storeName, props.selectedFood.uxCategory].filter(Boolean).join(" | ")}</p><label>Grams<input type="number" min="0" step="1" value={props.grams} onChange={(event) => props.setGrams(Number(event.target.value))} /></label>{preview ? <MacroStrip macros={preview} /> : null}<div className="button-row">{["breakfast", "lunch", "dinner", "snacks"].map((meal) => <button key={meal} onClick={() => props.onLog(props.selectedFood!, props.grams, meal)}>{meal}</button>)}</div></> : <p className="muted">Select a food to preview macros and log it manually.</p>}</div></section>;
}

function FoodResultPanel({ query, setQuery, results, onSelect }: { query: string; setQuery: (value: string) => void; results: ReturnType<typeof searchFoods>; onSelect: (food: FoodCatalogItem) => void }) {
  return <div className="panel"><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foods and ingredients" /><div className="result-list">{results.map(({ food, score }) => <button key={food.id} className="result-row" onClick={() => onSelect(food)}><span className="thumb">{food.thumbnailLabel || food.displayName.slice(0, 2)}</span><span><strong>{food.displayName}</strong><small>{[food.brandName, food.storeName, food.stateCandidate].filter(Boolean).join(" | ")}</small></span><em>{score}</em></button>)}</div></div>;
}

function TimelineScreen({ date, setDate, groups, onUpdate, onDelete }: { date: string; setDate: (value: string) => void; groups: ReturnType<typeof groupEntriesByMeal>; onUpdate: (entry: LogEntry, grams: number, meal: string) => void; onDelete: (entryId: string) => void }) {
  return <section className="stack"><input className="date-input" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><MealGroups groups={groups} editable onUpdate={onUpdate} onDelete={onDelete} /></section>;
}

function IngredientsScreen({ ingredients, logs, recipes, onSave, onDelete }: { ingredients: UserIngredient[]; logs: LogEntry[]; recipes: Recipe[]; onSave: (ingredient: UserIngredient) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<UserIngredient | null>(null);
  const usedIds = new Set([...logs.map((log) => log.foodId), ...recipes.flatMap((recipe) => recipe.ingredients.map((item) => item.foodId))]);
  return <section className="split"><IngredientForm ingredient={editing} onSave={(ingredient) => { onSave(ingredient); setEditing(null); }} /><div className="panel"><h2>Ingredient library</h2>{ingredients.map((ingredient) => <article className="recipe-card" key={ingredient.id}><div><h3>{ingredient.displayName}</h3><p>{ingredient.brandName || "User ingredient"} | {ingredient.kcal100g} kcal/100g</p></div><div className="button-row"><button onClick={() => setEditing(ingredient)}>Edit</button><button disabled={usedIds.has(ingredient.id)} title={usedIds.has(ingredient.id) ? "Used by logs or recipes" : "Delete"} onClick={() => onDelete(ingredient.id)}><Trash2 size={16} /></button></div></article>)}</div></section>;
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

function PassiveScreen({ settings, identities, catalog, onSave }: { settings: AppSettings; identities: IdentityProfile[]; catalog: FoodCatalogItem[]; onSave: (settings: AppSettings, ingredient?: UserIngredient) => void }) {
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
  return <section className="split"><div className="panel"><h2>Add quick-log item</h2><label>Display name<input value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder={selectedFood?.displayName ?? "Quick-log name"} /></label><label>Food<select value={foodId} onChange={(event) => setFoodId(event.target.value)}><option value="">Choose food or ingredient</option>{catalog.slice(0, 700).map((food) => <option key={food.id} value={food.id}>{food.displayName}</option>)}</select></label><label>Default grams<input type="number" min="1" value={defaultGrams} onChange={(event) => setDefaultGrams(Number(event.target.value))} /></label><label>Identity<select value={identityId} onChange={(event) => setIdentityId(event.target.value)}>{identities.map((identity) => <option key={identity.identityId} value={identity.identityId}>{identity.identityName}</option>)}</select></label><button className="primary" disabled={!foodId || defaultGrams <= 0} onClick={save}>Save quick-log item</button></div><div className="panel"><h2>Configured quick-log</h2>{settings.passiveQuickLogItems.map((item) => <article className="recipe-card" key={`${item.identityId}-${item.itemId}`}><div><h3>{item.itemName}</h3><p>{item.defaultGrams}g | {item.identityName} | {item.linkedFoodId}</p></div><div className="button-row"><button onClick={() => { const next = Number(prompt("Default grams", item.defaultGrams.toString())); if (Number.isFinite(next) && next > 0) onSave({ ...settings, passiveQuickLogItems: settings.passiveQuickLogItems.map((candidate) => candidate === item ? { ...candidate, defaultGrams: next } : candidate) }); }}>Edit grams</button><button onClick={() => onSave({ ...settings, passiveQuickLogItems: settings.passiveQuickLogItems.filter((candidate) => candidate !== item) })}><Trash2 size={16} /></button></div></article>)}</div></section>;
}

function IngredientForm({ ingredient, onSave }: { ingredient: UserIngredient | null; onSave: (ingredient: UserIngredient) => void }) {
  const [draft, setDraft] = useState<UserIngredient>(ingredient ?? blankIngredient());
  useEffect(() => setDraft(ingredient ?? blankIngredient()), [ingredient]);
  return <div className="panel"><h2>{ingredient ? "Edit ingredient" : "Create ingredient"}</h2><label>Name<input value={draft.displayName} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} /></label><label>Brand<input value={draft.brandName} onChange={(event) => setDraft({ ...draft, brandName: event.target.value })} /></label><label>Classification<input value={draft.classification} onChange={(event) => setDraft({ ...draft, classification: event.target.value })} /></label><div className="macro-edit"><label>kcal<input type="number" value={draft.kcal100g} onChange={(event) => setDraft({ ...draft, kcal100g: Number(event.target.value) })} /></label><label>Protein<input type="number" value={draft.protein100g} onChange={(event) => setDraft({ ...draft, protein100g: Number(event.target.value) })} /></label><label>Carbs<input type="number" value={draft.carbs100g} onChange={(event) => setDraft({ ...draft, carbs100g: Number(event.target.value) })} /></label><label>Fat<input type="number" value={draft.fat100g} onChange={(event) => setDraft({ ...draft, fat100g: Number(event.target.value) })} /></label></div><button className="primary" disabled={!draft.displayName.trim()} onClick={() => onSave({ ...draft, id: draft.id || `custom:${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`, updatedAt: new Date().toISOString() })}>Save ingredient</button></div>;
}

function RecipesScreen({ catalog, foodsById, recipes, settings, onSave, onDelete, onLog }: { catalog: FoodCatalogItem[]; foodsById: Map<string, FoodCatalogItem>; recipes: Recipe[]; settings: AppSettings; onSave: (recipe: Recipe) => void; onDelete: (recipeId: string) => void; onLog: (entries: LogEntry[]) => void }) {
  const [name, setName] = useState("");
  const [foodId, setFoodId] = useState("");
  const [grams, setGrams] = useState(100);
  const [portion, setPortion] = useState(300);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  return <section className="split"><div className="panel"><h2>Create recipe</h2><label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Recipe name" /></label><div className="inline-form"><select value={foodId} onChange={(event) => setFoodId(event.target.value)}><option value="">Choose ingredient</option>{catalog.slice(0, 600).map((food) => <option key={food.id} value={food.id}>{food.displayName}</option>)}</select><input type="number" value={grams} min="0" onChange={(event) => setGrams(Number(event.target.value))} /><button onClick={() => foodId && setIngredients([...ingredients, { foodId, grams }])}>Add</button></div><ul className="plain-list">{ingredients.map((ingredient, index) => <li key={`${ingredient.foodId}-${index}`}>{foodsById.get(ingredient.foodId)?.displayName ?? ingredient.foodId} - {ingredient.grams}g</li>)}</ul><button className="primary" disabled={!name || ingredients.length === 0} onClick={() => { onSave({ id: crypto.randomUUID(), name, type: "SINGLE", mealLabel: "dinner", iconName: "", ingredients, createdAt: new Date().toISOString(), lastWrittenTagId: null }); setName(""); setIngredients([]); }}>Save recipe</button></div><div className="panel"><h2>Recipe library</h2><label>Manual portion grams<input type="number" min="1" value={portion} onChange={(event) => setPortion(Number(event.target.value))} /></label>{recipes.map((recipe) => <article className="recipe-card" key={recipe.id}><div><h3>{recipe.name}</h3><p>{recipe.ingredients.length} ingredients | {Math.round(recipeTotals(recipe, foodsById).kcal)} kcal total</p></div><div className="button-row"><button onClick={() => onLog(recipePortionLogs(recipe, portion, todayIso(), settings.activeIdentityId, settings.activeIdentityName, recipe.mealLabel))}>Log portion</button><button title="Delete recipe" onClick={() => onDelete(recipe.id)}><Trash2 size={16} /></button></div></article>)}</div></section>;
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

function IdentitiesScreen({ identities, settings, onSave, onDelete, onSwitch }: { identities: IdentityProfile[]; settings: AppSettings; onSave: (identity: IdentityProfile) => void; onDelete: (id: string) => void; onSwitch: (identity: IdentityProfile) => void }) {
  const [name, setName] = useState("");
  return <section className="panel"><h2>People</h2><div className="inline-form"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="New identity name" /><button className="primary" disabled={!name.trim()} onClick={() => { onSave({ ...blankIdentity(), identityId: `identity:${crypto.randomUUID().slice(0, 8)}`, identityName: name, profileType: "secondary" }); setName(""); }}>Create</button></div>{identities.map((identity) => <IdentityCard key={identity.identityId} identity={identity} active={settings.activeIdentityId === identity.identityId} onSave={onSave} onDelete={onDelete} onSwitch={onSwitch} />)}</section>;
}

function IdentityCard({ identity, active, onSave, onDelete, onSwitch }: { identity: IdentityProfile; active: boolean; onSave: (identity: IdentityProfile) => void; onDelete: (id: string) => void; onSwitch: (identity: IdentityProfile) => void }) {
  const [open, setOpen] = useState(false);
  return <article className="recipe-card identity-card"><div><h3>{identity.identityName}</h3><p>{identity.profileType}{active ? " | active" : ""}</p></div><div className="button-row"><button onClick={() => onSwitch(identity)}>Use</button><button onClick={() => setOpen(!open)}>Details</button><button disabled={identity.profileType === "primary"} onClick={() => { if (window.confirm(`Remove ${identity.identityName}? Historical logs will keep their saved identity name.`)) onDelete(identity.identityId); }}><Trash2 size={16} /></button></div>{open ? <div className="identity-detail"><label>Name<input value={identity.identityName} onChange={(event) => onSave({ ...identity, identityName: event.target.value })} /></label><div className="macro-edit"><label>Daily kcal<input type="number" value={identity.dailyCaloriesTarget ?? ""} onChange={(event) => onSave({ ...identity, dailyCaloriesTarget: numberOrNull(event.target.value) })} /></label><label>Protein target<input type="number" value={identity.proteinTarget ?? ""} onChange={(event) => onSave({ ...identity, proteinTarget: numberOrNull(event.target.value) })} /></label><label>Carbs target<input type="number" value={identity.carbsTarget ?? ""} onChange={(event) => onSave({ ...identity, carbsTarget: numberOrNull(event.target.value) })} /></label><label>Fat target<input type="number" value={identity.fatTarget ?? ""} onChange={(event) => onSave({ ...identity, fatTarget: numberOrNull(event.target.value) })} /></label></div><label><input type="checkbox" checked={identity.zeroWeightReviewEnabled} onChange={(event) => onSave({ ...identity, zeroWeightReviewEnabled: event.target.checked })} /> Zero-weight review</label><label><input type="checkbox" checked={identity.genericReviewEnabled} onChange={(event) => onSave({ ...identity, genericReviewEnabled: event.target.checked })} /> Generic entry review</label></div> : null}</article>;
}

function DataScreen({ settings, logs, recipes, ingredients, identities, sourceMappings, foodsById, onRestored }: { settings: AppSettings; logs: LogEntry[]; recipes: Recipe[]; ingredients: UserIngredient[]; identities: IdentityProfile[]; sourceMappings: SourceMapping[]; foodsById: Map<string, FoodCatalogItem>; onRestored: () => void }) {
  const [error, setError] = useState("");
  const backup = () => buildBackup({ settings, logs, recipes, ingredients, identities, sourceMappings });
  return <section className="panel settings-grid"><button onClick={() => downloadText(`axiom_web_backup_${todayIso()}.json`, JSON.stringify(backup(), null, 2), "application/json")}>Download backup JSON</button><button onClick={() => downloadText(`axiom_web_logs_${todayIso()}.csv`, logsToCsv(logs, (id) => foodsById.get(id)?.displayName ?? id), "text/csv")}>Download logs CSV</button><label>Restore backup<input type="file" accept="application/json" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { const parsed = decodeBackup(await file.text()); if (!window.confirm("Restore this backup and overwrite local Axiom data on this device?")) return; await replaceAllData(parsed.data); await onRestored(); setError("Backup restored with overwrite semantics."); } catch (restoreError) { setError(restoreError instanceof Error ? restoreError.message : "Restore failed."); } }} /></label>{error ? <p className="toast">{error}</p> : null}</section>;
}

function HelpScreen() {
  return <section className="panel help"><h2>Help and setup</h2><h3>Install</h3><p>Add Axiom Web to your Home Screen from the browser share menu after the app has loaded once.</p><h3>Local data</h3><p>Your logs, recipes, ingredients, quick-log items, mappings, and people profiles are stored locally in this browser.</p><h3>Offline use</h3><p>After a successful first load, the app shell and bundled food catalog are cached for offline use. Open Food Facts barcode lookup is optional and needs network access.</p><h3>Backup and restore</h3><p>Use Data to download a backup before resetting, changing devices, or restoring. Restore validates the backup before overwriting local data.</p><h3>Scale and NFC</h3><p>This validation build does not communicate with the physical scale and does not write NFC tags. Manual logging and review workflows are available now.</p><h3>Build</h3><p>Version {__APP_VERSION__} · {__BUILD_SHA__} · {new Date(__BUILD_TIME__).toLocaleString()}</p></section>;
}

function SettingsScreen({ settings, setSettings, onReset }: { settings: AppSettings; setSettings: (settings: AppSettings) => void; onReset: () => void }) {
  return <section className="panel settings-grid"><label>Preferred store<input value={settings.preferredStoreName ?? ""} onChange={(event) => setSettings({ ...settings, preferredStoreName: event.target.value || null })} /></label><label><input type="checkbox" checked={settings.zeroWeightReviewEnabled} onChange={(event) => setSettings({ ...settings, zeroWeightReviewEnabled: event.target.checked })} /> Zero-weight review</label><label><input type="checkbox" checked={settings.genericReviewEnabled} onChange={(event) => setSettings({ ...settings, genericReviewEnabled: event.target.checked })} /> Generic entry review</label><button className="danger" onClick={onReset}>Reset local data</button></section>;
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
  return <section className="panel"><h2>Scale sync</h2><div className="status-pill">Hardware unavailable until BLE firmware exists</div><p className="muted">{status}</p><p className="muted">Manual logging, review, recipes, backup, and offline use are available now. Physical scale communication will be added behind the existing transport boundary in a later authorised build.</p><div className="button-row"><button onClick={tryUnavailable}>Check physical transport</button>{import.meta.env.DEV ? <><label><input type="checkbox" checked={mockEnabled} onChange={(event) => setMockEnabled(event.target.checked)} /> Development mock</label><button disabled={!mockEnabled} onClick={importMock}>Import mock log block</button></> : null}</div></section>;
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

function titleFor(screen: Screen): string {
  return { today: "Today", search: "Food search", timeline: "Timeline", recipes: "Recipes", ingredients: "Ingredients", barcode: "Barcode", passive: "Quick-log", review: "Review", identities: "People", data: "Data", help: "Help", settings: "Settings", scale: "Scale sync" }[screen];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
