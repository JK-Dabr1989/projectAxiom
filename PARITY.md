# Axiom Web Android Parity Matrix

This matrix was created from the current Android source under `Axiom-Android/android/app/src/main/java/com/smartscale/app/`, using the Android app as behavioural evidence.

The Web App remains isolated in `Axiom-Web-App/`.

## 2026-09-01 In-App Functional Parity Check

Scope: Android app versus Axiom Web, focusing on in-app functionality only. NFC writing and Bluetooth/scale writing are intentionally ignored for this check.

Overall status: the Web App covers the core tester loop, but it is not yet full Android in-app parity. The strongest parity areas are local onboarding, food search, manual logging, day timeline, meal grouping, recipes at a basic level, custom ingredients, review queues, identities at a basic level, backup/restore, CSV export, and PWA/offline shell support. The largest remaining in-app gaps are Android's richer insight ranges, search/favorite/recent behaviour, detail screens, recipe editing depth, generic-token refinement, settings subsections, log export ranges, and more complete people/identity controls.

### 2026-09-01 Parity Implementation Pass

Implemented after the audit:

- Added an IndexedDB `foodPreferences` store for Android-style food preference state, including favourite state, selection counts, and last-selected timestamps.
- Added food search landing sections for favourites and recents, plus favourite toggles and per-100g nutrition detail in the selected food panel.
- Added recipe editing, recipe meal/icon fields, removable recipe ingredients, and recipe favourites.
- Added a first-class generic token library/editor backed by local generic ingredients so tokens participate in search/logging.
- Added log CSV export ranges for all, today, last 7 days, last 30 days, and custom date windows.
- Added Android-adjacent review and people settings for zero-weight cleanup, generic default auto-accept, identity-aware logging, default identity display, and inactivity timeout.
- Extended Web backup/restore to preserve food preferences while continuing to accept older backups that do not contain that section.

Still intentionally constrained or incomplete:

- Dedicated full-screen food, ingredient, recipe, and meal detail routes remain lighter than Android; the web app now uses richer inline panels/cards.
- Today/insight still lacks Android's week/month/year/custom dashboard ranges.
- Generic entry/week refinement and rewrite-warning workflows are not yet fully mirrored.
- Passive quick-log setup still supports food/ingredient shortcuts only; recipe/custom/composite passive item builders remain smaller than Android.
- Hardware communication, NFC, and Bluetooth/scale writing remain out of scope for this parity pass.

### In-App Parity Summary

| Area | Android behaviour found | Web status | Gap priority |
| --- | --- | --- | --- |
| Navigation/app shell | Drawer/menu plus primary screens, overlays, system back handling | Implemented as compact top bar, bottom nav, More sheet, component state screens | Near parity |
| Activation/onboarding | Multi-step onboarding with name, unit, first food, write/sync prompts | Web-specific local-first onboarding with name; no hardware steps | Acceptable because hardware writes excluded |
| Today/insight dashboard | Day/week/month/year/custom insight ranges, day window, attention counts | Today shows current selected day totals and meal groups only | P1 |
| Food search | Group/product/row search modes, browse/manual/tag/recipe/unknown modes, favourites and recents | Ranked search plus favourites/recents landing and preferred-store boost | P2 |
| Food detail | Dedicated detail screen/overlay, favourite toggle, log portion, delete/edit for custom foods | Selection preview with grams, per-100g nutrition, favourite toggle, and meal logging | P2 |
| Manual logging | Search-driven manual log with grams and meal context | Implemented | Near parity |
| Timeline/history | Date window, highlighted groups, meal detail, recipe suggestion, filters | Date-based timeline with grouped entries, gram/meal edit, delete | P1 |
| Meal detail/editing | Dedicated meal detail editor with batch save/remove and recipe creation path | Inline entry edit/delete only | P1 |
| Recipes | Library, detail screen, favourite, edit existing recipe, log portion, add ingredients through search overlay | Create/edit, meal/icon fields, library, favourite, delete, and log portion implemented; full detail route remains lighter | P2 |
| Ingredients | Library modes, favourites/recents, detail screen, manual/OFF creation, edit/delete with in-use blocking | Local custom ingredient create/edit/delete blocking plus barcode/OFF onboarding | P1 |
| Barcode/OFF | ZXing scan, manual barcode lookup, OFF prefill and confirmation | Manual barcode, optional browser BarcodeDetector camera scan, OFF prefill and confirmation | Near parity, browser-dependent |
| Zero-weight review | Dedicated review screen/settings, correction and cleanup rules | Review screen supports correct/keep/remove | P2 |
| Unknown/generic review | Unknown assignment, generic subtype options, entry/week refinement, rewrite warnings | Basic unknown mapping and saved source mapping; no week refinement or rewrite warning | P1 |
| Generic tokens | Library, create/update nutrition, delete with in-use blocking, accepted defaults | Generic token library/editor implemented; accepted defaults and refinement still pending | P2 |
| Passive/quick-log | Identity quick button config, passive items from food/recipe/custom/composite ingredients, edit/delete prompts | Quick-log item from selected food/ingredient with grams and identity; edit grams/remove | P1 |
| Identities/people | Enable/disable identity, shared/default modes, switch user, manage users, identity details, targets, logging prefs, inactivity timeout | Create/rename/switch/delete alternates, targets, some review prefs | P1 |
| Settings | Dedicated sections: connection, scale/sharing, people, logging, data, app prefs, developer, help | Single compact settings screen plus separate Data/Help/People/Scale screens | P1 |
| Preferences | Preferred store, units, auto-connect, zero-weight cleanup, generic review settings, accepted generic defaults | Preferred store, review toggles, cleanup/default settings, and people toggles implemented; preferred unit fixed grams | P2 |
| Data export | Log export range presets/custom dates, backup export/import, developer ingredient CSV | Backup JSON, restore, and ranged logs CSV implemented | Near parity |
| Persistence | Room app state, identities, food preferences, ingredients, logs, recipes, mappings, sync history | IndexedDB settings, logs, recipes, ingredients, identities, source mappings, and food preferences | P2 for sync history/generic refinement |
| Help/setup | Help screen and setup guidance | Implemented Web-specific Help | Near parity |
| PWA/offline | Not applicable to native Android | Implemented Web PWA shell/data caching and update prompt | Web advantage |

### Highest-Value Web Parity Backlog

1. Add Android-style food preferences: favourites, recents, selection counts, and favourite toggles from food/recipe detail.
2. Add dedicated food, ingredient, recipe, and meal detail screens instead of relying only on inline panels.
3. Expand Today into an Android-like insight dashboard with day/week/month/year/custom ranges and attention summary.
4. Bring search closer to Android: grouped/product/row result modes, landing state with favourites/recents, and context-specific search modes.
5. Upgrade recipe flows: edit existing recipes, choose meal label/icon, add ingredients through search, view detail, favourite, and log portion from detail.
6. Add generic-token in-app functionality: generic token library, nutrition edit, accepted defaults, entry/week refinement, and rewrite warnings.
7. Expand passive quick-log to match Android's food, recipe, custom, and composite-item setup paths while continuing to ignore tag writing.
8. Expand people/settings: identity enable/default/shared toggles, default identity controls, inactivity timeout, per-identity logging preferences, and a clearer settings information architecture.
9. Add log export ranges and custom date export instead of all-logs-only CSV.
10. Add IndexedDB migrations for the missing Android-equivalent stores/settings before broadening the UI.

### In-App Parity Verdict

Core tester workflow parity is good enough for manual web validation: a tester can onboard, search foods, log food, review the day, edit/delete logs, create ingredients, create/log recipes, manage identities, handle basic review queues, and back up local data.

Full in-app parity with Android is not complete. The Web App is currently a lean validation client, while Android is the fuller product surface with richer detail screens, settings, preferences, generic refinement, and identity behaviour.

## Android Functionality Audited

Current user-facing Android areas found in code:

- Activation/onboarding
- Today/insight dashboard
- Food search
- Food detail and manual gram entry
- Timeline/history
- Day grouping and meal grouping
- Meal detail editing
- Editing logged weights
- Deleting logged entries
- Recipe library
- Recipe creation/editing
- Recipe detail and recipe logging support
- Ingredient library
- Ingredient detail/editor
- Barcode ingredient onboarding through Open Food Facts
- Unknown/generic entry review
- Zero-weight review
- Passive quick-log and quick-button settings
- Identity/profile switching and management
- People logging behaviour
- Scale connection/sync UI
- Scale ownership/settings/display unit settings
- Data export, backup, restore
- Developer dataset export tooling
- Help/setup guide
- NFC tag write prompts for ingredient, recipe, identity, passive/shortcut tokens

Key Android app-side models found:

- `MacroValues`
- `FoodCatalogItem`, `FoodMacros`, grouped/product/row search results
- `LogEntry`
- `Recipe` and `RecipeIngredient`
- `IdentityProfile`
- `PassiveQuickLogItem`
- `GenericWeekOverride`
- `NfcMapping`
- `AppSnapshot`
- `MealGroup`, `DayPayload`, `LoggedFood`
- `ScaleDeviceStatus`, `ScaleLogRecord`

Persistence evidence:

- Android uses Room entities for app state, identities, food preferences, ingredients, log entries, recipes, recipe ingredients, and NFC mappings.
- Bundled/static food/search data lives in Android assets: `food_catalog.json` and `food_keywords.json`.
- User-created local data includes logs, recipes, identities, ingredient additions, preferences, passive quick-log items, and app settings.
- Scale imports produce local log entries with event-ID/log-hash idempotency.

Business rules mirrored through the current Web build:

- Macro values are per 100g and scale by `grams / 100`.
- Displayed macros are rounded to one decimal place.
- Meal labels are inferred from timestamp windows: breakfast, lunch, dinner, otherwise snacks.
- Manual logs persist locally and remain editable/deletable.
- Scale event IDs are preserved as local log IDs for import idempotency.
- `SMARTSCALE_V3` status and `EVT`/`SHORTCUT` log records are parsed without changing the protocol.
- Custom ingredients are stored separately from the bundled catalog and projected into food search/use.
- Ingredient deletion is blocked in the UI when referenced by logs or recipes.
- Zero-weight correction updates the existing log entry rather than creating a duplicate.
- Unknown/generic review preserves original source identity while mapping to app-side food meaning.
- Recipe portion logging creates manual ingredient logs scaled by ingredient grams over total recipe grams.
- Active identity is saved onto new logs; historical logs keep their stored identity after later identity switches.
- Full backup is versioned JSON and restore uses explicit overwrite semantics after validation.
- Fresh installs use a short local-first onboarding flow and persist completion locally.
- Barcode lookup follows Android's Open Food Facts draft-and-confirm pattern where browser/network support allows it.
- The PWA shell, manifest, icons, bundled catalog, and keyword data are cacheable for offline use after a successful first load.

## Matrix

| Android feature | Web classification | Current Web status |
| --- | --- | --- |
| App shell/main navigation | Implement now | Implemented with compact top bar, Today/Search/Timeline/Recipes bottom nav, and grouped More sheet |
| Activation/onboarding | Implement now | Implemented Web-specific local-first onboarding |
| Today/insight dashboard | Implement now | Implemented daily macro totals and meal groups |
| Food search | Implement now | Implemented against copied Android bundled catalog |
| Food detail/selection | Implement now | Implemented macro preview and gram entry |
| Manual food logging | Implement now | Implemented |
| Timeline/history | Implement now | Implemented date-based timeline |
| Day grouping | Implement now | Implemented |
| Meal grouping | Implement now | Implemented |
| Editing logged entries | Implement now | Implemented gram and meal edits |
| Deleting/correcting logs | Implement now | Implemented delete and gram correction |
| Recipe creation | Implement now | Basic single recipe creation implemented |
| Recipe management | Implement now | Basic library/delete implemented |
| Recipe use/logging | Implement now | Implemented for manual portion logging; scale/batch recipe interaction deferred |
| Ingredient library/editor | Implement now | Implemented for local custom ingredients |
| Barcode ingredient onboarding | Implement now or Open Question | Implemented manual barcode entry, optional camera scan via browser API, OFF lookup, review-before-save |
| Settings/local preferences | Implement now | Partial: preferred store, review toggles, reset with confirmation implemented |
| Passive quick-log configuration | Implement now | Implemented add/view/edit grams/remove with identity association; composite passive recipe-style editor not yet implemented |
| Identity/profile functionality | Implement now | Partial: list/create/rename/switch/delete alternates and target/review preferences implemented; deeper Android people screens still smaller |
| Data export/backup/restore | Implement now | Implemented Web backup JSON, restore validation/overwrite, and logs CSV |
| Unknown/generic entry review | Implement now | Implemented entry mapping and saved source mapping foundation |
| Zero-weight review | Implement now | Implemented correction/keep/remove workflow |
| Scale sync UI | Implement now with local/mock hardware boundary | Implemented unavailable physical transport plus explicit mock import |
| `SMARTSCALE_V3` status parsing | Implement now with local/mock hardware boundary | Implemented |
| Scale log parsing/import | Implement now with local/mock hardware boundary | Implemented for `EVT` and `SHORTCUT` |
| Duplicate/import semantics | Implement now with local/mock hardware boundary | Implemented by event ID set during import |
| Classic Bluetooth SPP | Deferred - requires BLE firmware | Not implemented |
| Web Bluetooth adapter | Deferred - requires BLE firmware | Not implemented |
| Android NFC writing | Deferred - NFC | Not implemented |
| Web NFC | Deferred - NFC | Not implemented |
| Scale-side PN532 tag writing | Deferred - NFC | Not implemented |
| Android-specific developer export tooling | Not applicable to Web validation | Not implemented |

## Hardware-Dependent Parity

The Web App now has an explicit `ScaleTransport` interface and two implementations:

- `UnavailableScaleTransport`: production-safe default that reports physical scale communication is unavailable.
- `MockScaleTransport`: development-only helper that feeds representative `SMARTSCALE_V3` status/log lines into app-side parser/import logic.

No browser code depends directly on `navigator.bluetooth`.

Physical scale communication is not enabled in this Web validation build.

## Current App-Side Parity

Implemented:

- Local ingredient library/editor with per-100g nutrition fields.
- Custom ingredients included in search, recipes, manual logging, timeline display, and exports.
- Zero-weight review with correct/keep/remove actions.
- Unknown/generic review with search-based food mapping, original source preservation, and saved source mappings for repeat imports.
- Identity management with default primary identity, alternate creation, rename, switch, and alternate deletion.
- Recipe portion logging by scaling ingredient grams against total recipe grams.
- Versioned backup JSON and logs CSV export.
- Restore validation with overwrite semantics and no partial restore on malformed input.
- Installable PWA foundation with manifest, app icons, service worker, and update-available reload prompt.
- Web-specific onboarding.
- Barcode ingredient onboarding through optional Open Food Facts lookup with manual fallback and user confirmation.
- Help/setup guidance for install, offline use, backup/restore, scale status, and NFC status.

Partial:

- Passive quick-log configuration supports food/ingredient selection, default grams, identity association, edit grams, removal, backup persistence, and mock shortcut import resolution. Composite passive recipe-style editor remains smaller than Android.
- Identity target metadata and people logging preferences exist, but the people/settings information architecture is smaller than Android.
- Ingredient delete/archive behaviour is implemented as UI blocking for in-use ingredients; deeper archive semantics are not present.

## NFC Parity

All NFC functionality is deferred.

NFC-only Android actions are not represented as working features in the current Axiom Web build.

## Open Questions

- Which framework-level PWA/offline caching approach should be adopted once the first validation build is prepared for an iPhone browser?
- Should passive quick-log configuration be modelled as only shortcut items in Settings, or should it share the full Android passive custom/composite editor?
- Should GitHub deployment live as a sub-project-specific workflow or be handled by the parent repository once hosting ownership is clarified?
