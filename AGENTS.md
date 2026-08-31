# Axiom Web App Agent Instructions

## Purpose

This file governs how contributors and AI agents should behave when working on the Axiom Web App.

This file is not Web App documentation.

This file is not a technical specification.

This file is not a feature list.

It defines contributor behaviour, ownership boundaries, product-validation scope, architecture expectations, quality standards, and change-control rules for the browser/PWA application.

The Axiom Web App exists primarily to:

- provide the Apple/iPhone validation client during the current product-validation phase
- allow rapid iteration without requiring native iOS deployment for every change
- reproduce the relevant Axiom application experience in a browser/PWA environment
- eventually provide a settled behavioural reference for the future native iOS implementation

The Web App is not currently intended to replace the existing Android application.

The Android application already exists and remains its own independent native client.

Native iOS remains the eventual production direction.

## Scope

These instructions apply only to work inside:

```text
Axiom-Web-App/
```

Treat other project areas as outside Web App scope unless the user explicitly requests cross-project work.

## Web App Ownership

The Web App owns:

- browser/PWA implementation
- Web App UI and interaction code
- Web App local application state
- Web App validation workflows
- Web App hardware-transport abstractions
- Web App tests and local development tooling
- browser-specific compatibility notes

The Web App does not own:

- Android app code
- Apple/iOS app code
- Project Axiom public website
- ESP32 firmware
- shared tooling outside the Web App
- repository-wide technical specifications
- shared styling definitions
- master assets

## Hard Project Boundary

When working inside the Web App project, do not modify:

- Android app code
- Apple/iOS app code
- Project Axiom public website
- ESP32 firmware
- shared tooling outside the Web App
- repository-wide technical specifications

unless the user or task explicitly authorises changes outside `Axiom-Web-App/`.

If a Web App task appears to require a firmware, Android, iOS, website, shared tooling, or repository-wide specification change:

- stop at the boundary
- implement everything possible inside `Axiom-Web-App/`
- clearly report the external change required
- do not silently edit another sub-project

This separation is intentional.

## Product Position

The immediate product priority is:

1. Apple validation through the Web App
2. preserving the existing Android native app
3. eventual native iOS implementation after workflows stabilise

Web functionality may naturally work on other platforms, and that is acceptable.

Do not spend effort trying to replace the existing Android application.

Do not port the Android UI line-for-line simply because it already exists.

The Android implementation is useful behavioural and reference evidence, not a command to reproduce every implementation detail.

## Relationship To Existing Axiom Contracts

The Web App should eventually consume the same established Axiom product contracts rather than creating incompatible alternatives.

Relevant existing architecture includes:

- SmartScale V3 firmware
- `SMARTSCALE_V3` protocol family
- compact `SS1|...` NFC token format
- app-side ownership of richer food and nutrition meaning
- device-side ownership of raw captured weighing and log events
- local-first operation
- event-ID-based idempotent log imports

These are existing product concepts.

Do not casually invent replacement schemas or protocols.

Where implementation work later exposes a genuine need to change a shared contract, surface that explicitly for review.

## Local-First Principle

Axiom Web should be designed as a local-first application.

Core user data should eventually remain usable without a mandatory Axiom cloud account or mandatory remote database.

Do not assume that "web application" means "cloud application."

External or network functionality may be additive where appropriate, but the existing Axiom local-first philosophy remains the default.

Do not implement storage architecture unless explicitly requested by the user.

## NFC Direction

The Web App will not depend on direct browser NFC access for the core tag-writing workflow.

The intended validation architecture is:

```text
Web App
-> Bluetooth/BLE
-> AxiomScale ESP32
-> built-in PN532
-> NFC tag
```

The scale will eventually be able to write and verify Axiom NFC tags on behalf of the Web App.

This is an additional NFC-writing route.

It does not mean direct phone NFC writing should disappear from native applications.

Long-term native clients may still support direct phone NFC writing where the platform allows it.

Do not implement NFC functionality unless explicitly requested by the user.

## Bluetooth Direction

The existing firmware currently uses Classic Bluetooth SPP.

The intended future Web App hardware path is BLE/Web Bluetooth.

However:

- firmware modification is outside this sub-project
- BLE firmware work must be separately authorised
- the Web App should eventually use an isolated transport abstraction so browser/device communication is not scattered throughout UI code

Do not implement Bluetooth functionality unless explicitly requested by the user.

## Documentation Hierarchy

Before beginning significant Web App work, contributors should review:

1. `Axiom-Web-App/AGENTS.md`
2. `Axiom-Web-App/README.md`, if present
3. `Axiom-Web-App/CHANGELOG.md`, if present

When styling decisions are involved:

- consult `Axiom-Styles/`
- treat styling guidance as authoritative
- do not modify style-system documents unless explicitly instructed

When existing application behaviour is involved:

- consult Android and iOS only as behavioural references
- preserve intended product behaviour unless Web App validation requires a clearly identified difference
- do not modify Android or iOS code without explicit authorisation

When firmware contracts are involved:

- consult firmware documentation
- preserve documented contracts
- do not modify firmware or protocol documents without explicit authorisation

If implementation, documentation, style guidance, firmware contracts, or platform expectations disagree:

- identify the conflict
- explain the options
- ask for direction

Do not silently choose a winner.

## Architecture Expectations

Prefer:

- small vertical slices
- preserving known product behaviour before redesigning it
- rapid validation
- simple architecture
- maintainability
- explicit interfaces around hardware communication
- local-first behaviour
- testable business logic
- avoiding unnecessary backend infrastructure
- avoiding premature native-platform abstractions
- browser-appropriate patterns

Avoid:

- wholesale Android code translation
- monolithic views
- duplicated business logic
- tightly coupled hardware communication in UI code
- hidden dependencies
- backend-first assumptions
- direct browser NFC as a required core workflow
- architecture created purely for theoretical future needs

Architecture changes should solve a real current problem.

## Code Cleanliness

Code changes must leave the Web App project cleaner.

When modifying code:

- remove obsolete implementations
- remove abandoned experiments
- remove dead code
- remove unused imports
- remove duplicate implementations
- remove temporary debug patches once no longer needed
- avoid leaving commented-out old code

Do not keep old implementations "just in case."

Do not leave multiple competing solutions in the codebase.

If removing old code may be risky, explain the risk and ask before removal.

## Experimental Code

Experimental code is allowed only when necessary for validation.

Experimental code must be:

- clearly identified
- isolated where practical
- documented when meaningful

Experimental code must not silently become production code.

Once a final implementation exists, temporary experimental paths should normally be removed.

## Parallel System Prevention

Before creating:

- new services
- new repositories
- new managers
- new sync systems
- new storage systems
- new navigation systems
- new UI component systems
- new styling systems

first determine whether an existing Web App system should be extended.

Avoid creating competing implementations for the same responsibility.

Do not create parallel systems unless the user explicitly approves the split.

## Change Control

Meaningful Web App changes require updating:

```text
Axiom-Web-App/CHANGELOG.md
```

before the task is considered complete.

If the changelog does not yet exist, create it when performing the first meaningful Web App change.

Do not rely on chat history as the change record.

## Temporary Work Area

Use this project's `_workbench/` folder for temporary files, scratch outputs, investigation notes, generated previews, and one-off analysis artefacts.

Do not scatter temporary files through the project.

Do not reference `_workbench/` from production code, public pages, builds, or canonical documentation.

Promote anything valuable to the correct permanent location before completing the task.

Clean `_workbench/` regularly.
