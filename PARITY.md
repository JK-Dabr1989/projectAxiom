# Axiom Web Android Parity Matrix

This matrix was created from the current Android source under `Axiom-Android/android/app/src/main/java/com/smartscale/app/`, using the Android app as behavioural evidence.

The Web App remains isolated in `Axiom-Web-App/`.

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
| App shell/main navigation | Implement now | Implemented with Today, Search, Timeline, Recipes, Scale, Settings |
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
