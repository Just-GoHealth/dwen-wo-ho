# Agent Instructions

## ⚠️ This Is Not the Next.js You Know

This codebase runs a version of Next.js with **breaking changes** — APIs, routing conventions,
and file structure may differ significantly from your training data.

**Before writing any code:**

- Read the relevant guide in `node_modules/next/dist/docs/`
- Respect all deprecation notices
- Do not assume compatibility with standard Next.js patterns

---

## Agent Skills

Before starting any task, check `.agents/` for available skills and use them.

---

## Architecture Contract _(Mandatory)_

This repository enforces a **strict layered architecture**. Every contribution — human or agent —
must comply with the rules below. No exceptions.

### Layer Ownership

| Layer          | Path             | Responsibility                                        |
| -------------- | ---------------- | ----------------------------------------------------- |
| Routes         | `app/`           | Route composition only                                |
| Presentation   | `components/`    | UI rendering only (except `components/ui` primitives) |
| Orchestration  | `hooks/`         | React state/effects; calls services                   |
| Business Logic | `services/`      | Business logic and API/data access                    |
| Utilities      | `lib/utils/`     | Pure, reusable helpers                                |
| Types          | `lib/types/`     | Interfaces, type aliases, enums                       |
| Constants      | `lib/constants/` | Static values                                         |
| Scripts        | `lib/scripts/`   | Automation/ops only — not runtime logic               |
| Shared         | `lib/`           | Root namespace for setup and shared modules           |

### Required Data Flow

```
Component → Hook → Service → External / API
```

No layer may bypass this chain.

### File Placement

| What                    | Where                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| Subcomponent prop types | `lib/types/components/<feature>/`                                   |
| UI-specific hooks       | `hooks/components/<area>/`                                          |
| Presentational splits   | `components/<feature>/<part>.tsx` or `<part>/index.tsx` (see below) |
| shadcn `cva` variants   | `components/ui/*-variants.ts` (non-component exports)               |
| Shared a11y helpers     | `lib/utils/a11y.ts`                                                 |

### Component Folder Structure _(Mandatory)_

Every directory under `components/` must be **homogeneous** at each level — pick one shape and stick to it:

| Level contents      | Valid? | When to use                                                                       |
| ------------------- | ------ | --------------------------------------------------------------------------------- |
| **Files only**      | Yes    | Sibling components with no sub-structure (e.g. `provider-details/*.tsx`)          |
| **Folders only**    | Yes    | Each child is its own unit (`index.tsx` entry) or grouping (`tabs/`, `overlays/`) |
| **Files + folders** | **No** | Never — this is the only violation                                                |

**Do not** convert a files-only directory into folders just for consistency. Folder-per-component is required only when you would otherwise **mix** a loose file with a subfolder at the same level.

Run `pnpm components:audit` before large component PRs.

#### Naming (folders)

| Suffix / pattern      | Use for                                                         |
| --------------------- | --------------------------------------------------------------- |
| `*-wizard/`           | Multi-step create/edit flows                                    |
| `*-picker/`           | Selection overlays (school, item, etc.)                         |
| `*-host/`             | Renders a set of overlays from parent state                     |
| `*-button/`, `*-tab/` | Focused workspace controls and tab panels                       |
| `editor/`             | Main in-page workspace body (tab content + inline controls)     |
| `overlays/`           | Modal/wizard/picker siblings for a feature                      |
| `workspace/`          | In-page UI siblings (`editor/`, `overlay-host/`, `tabs/`, etc.) |

Use **kebab-case** for folder and file names that describe the UI role, not PascalCase filenames or legacy prefixes (`curator-pages-*`, `content-pages-*`). React component **symbols** stay PascalCase (`export function ProviderProfileCard`).

#### Examples

**Files only** — no subfolders, nothing to fix:

```
components/curator/provider-details/
  details-header.tsx
  profile-card.tsx
  specialties-card.tsx
  action-buttons.tsx
  status-display.tsx
  index.ts
```

**Folders only** — parent has multiple units; each child is a folder:

```
components/curator/content-pages/
  overlays/
    add-cover-page-wizard/      # files only inside (index + steps)
      index.tsx
      slogan-step.tsx
  workspace/
    editor/
      index.tsx
    tabs/
      cover-page-tab/
        index.tsx
```

**Violation** — loose file alongside folders (fix by folderizing the loose file(s)):

```
components/curator/create/
  create-launcher.tsx           # ← move to create-launcher/index.tsx
  member-create-modal/
  school-create-modal/
```

Import folder entries by path: `@/components/curator/content-pages/workspace/editor`. Import file siblings normally: `@/components/curator/provider-details`.

Types for a feature domain live in **one** `lib/types/components/<domain>/<feature>.ts` module — not one micro-file per component.

### Hook Folder Structure _(Mandatory)_

Mirror **Component Folder Structure** homogeneity rules under `src/hooks/`:

| Level contents      | Valid? | When to use                                                               |
| ------------------- | ------ | ------------------------------------------------------------------------- |
| **Files only**      | Yes    | Sibling hooks with no sub-structure (e.g. `hooks/queries/use-curator.ts`) |
| **Folders only**    | Yes    | Each child is its own unit (`layout/`, `dashboard/`, `signup/bio-step/`)  |
| **Files + folders** | **No** | Never — folderize loose hook files                                        |

Run `pnpm hooks:audit` before large hook PRs. UI hooks under `hooks/components/<area>/` must mirror the matching `components/<area>/` feature paths.

#### Naming (hook files)

| Rule                           | Example                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| **`use-` prefix** + kebab-case | `use-layout.ts`, not `layout.ts`                                    |
| **No redundant parent prefix** | `hooks/curator/layout/use-layout.ts`, not `use-curator-layout.ts`   |
| **No legacy prefixes**         | `content-pages/`, not `curator-content-pages/`                      |
| **UI-role suffixes**           | `use-panel-data.ts` for panel UI, not `use-*-modal-*`               |
| **Barrel compositors**         | `index.ts` allowed (`useCuratorContentPages`, `useProviderDetails`) |

**Cross-domain exceptions:** `hooks/queries/` keeps entity prefix (`use-curator.ts`) for disambiguation. `hooks/auth/use-provider-signin.ts` keeps role prefix when crossing domains.

**Root layout:** `hooks/shared/` (generic utilities), `hooks/realtime/` (websocket/stomp), domain folders (`curator/`, `provider/`, `patient/`, `queries/`, `forms/`, `components/`).

**Symbols:** exported hook names stay PascalCase after `use` (`useCuratorLayout`). Path renames first; rename symbols only when components already migrated (`Modal` → `Panel`).

Use `pnpm hooks:reorg` / `pnpm hooks:reorg:apply` with `src/lib/scripts/hooks-reorg.manifest.json` for bulk moves.

### Constants Folder Structure _(Mandatory)_

Mirror **Component Folder Structure** homogeneity rules under `src/lib/constants/`:

| Level contents      | Valid? | When to use                                                                                   |
| ------------------- | ------ | --------------------------------------------------------------------------------------------- |
| **Files only**      | Yes    | Sibling constant modules with no sub-structure (e.g. `infra/routes.ts`, `patient/lock-in.ts`) |
| **Folders only**    | Yes    | Each child is its own unit (`infra/`, `components/`, `curator/schools/`)                      |
| **Files + folders** | **No** | Never — folderize loose constant files                                                        |

**Root rule:** `src/lib/constants/` must be **folders-only** — `infra/` and `components/` only. No loose `.ts` files at the root (no `index.ts` barrel).

Run `pnpm constants:audit` before large constants PRs. Constant paths under `lib/constants/components/<domain>/` must stay aligned with matching `components/<domain>/` and `hooks/<domain>/` paths.

#### Placement

| What                  | Where                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Feature UI constants  | `lib/constants/components/<domain>/` — copy, routes in content objects, variant maps, config — **not** `className` / Tailwind strings (see **No style constants**) |
| Infra / cross-cutting | `lib/constants/infra/` — `routes.ts`, `endpoints.ts`, `query-keys.ts`, `app.ts` (nav items, notification action enums)                                             |
| Cross-role UI config  | `lib/constants/components/shared/` — e.g. `auth-flow.ts` (signup/recover step labels shared by patient + provider)                                                 |
| Legal / policy copy   | `lib/constants/components/legal/` — static policy metadata (e.g. `policy.ts` last-updated date)                                                                    |
| Domain modules        | Merge micro-files (≤20 lines, ≤2 exports) into one module per folder (`school-forms.ts`, `auth-copy.ts`, `overlays.ts`)                                            |

**Do not** create standalone root files for tiny one-offs (`z-index.ts`, `legal.ts`, `mock-data.ts`). Put layering in `globals.css`, domain copy under `components/<domain>/`, and shared form enums beside the feature they serve.

#### Naming

| Rule                           | Example                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Kebab-case filenames**       | `school-forms.ts`, `create-launcher.ts`, `auth-flow.ts`                                                |
| **No redundant parent prefix** | `curator/schools/school-forms.ts`, not `schools-school-forms.ts`                                       |
| **UI-role suffixes**           | `create-launcher`, `provider-details-panel`, `school-edit-panel`, `pending-approval-modal/content.ts`  |
| **Export symbols**             | `SCREAMING_SNAKE` for static objects; rename when UI role changes (`CREATE_LAUNCHER_ITEMS_CONFIG`)     |
| **`.tsx` only for JSX**        | Search configs that export icon elements (e.g. `school-details/search.tsx`)                            |
| **No root barrel**             | Import `@/lib/constants/infra/routes`, `@/lib/constants/infra/app`, etc. — no `lib/constants/index.ts` |

#### No style constants _(Mandatory)_

**Never** export Tailwind classes, CSS values, easing curves, animation utility strings, or
`className` arrays from `lib/constants/` for styling.

| Put it here                       | Use for                                                                                                                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`className` on the component**  | Normal presentational styling (Tailwind). Put classes **directly on JSX** — see **No Tailwind class constants** below.                                                                 |
| **`globals.css`** (or scoped CSS) | `@keyframes`, shell/layout hooks on root markers, z-index layering utilities (e.g. `.z-sticky-chrome`), and classes toggled by JS animation state (e.g. `.is-visible`, `.is-dropped`). |
| **`components/ui/*-variants.ts`** | shadcn `cva` variant definitions.                                                                                                                                                      |

**Only exception — DRY map objects:** a constant **object/map** whose keys are semantic
variants and whose values are class strings, consumed by **multiple** components or a `.map()`
over options. Examples: accent/badge variant maps, status chip configs, launcher item configs.
The map must eliminate real duplication — not wrap a single element's classes.

```ts
// ✅ Allowed — variant map drives repeated UI
export const CARD_ACCENTS = {
  sand: { badgeClassName: "...", iconClassName: "..." },
  info: { badgeClassName: "...", iconClassName: "..." },
} as const;

// ❌ Forbidden — style dumping ground
export const HERO_CLASSES = "text-white opacity-0 translate-y-4 ...";
export const BODY_SHELL_CLASSES = [
  "h-full",
  "w-full",
  "overflow-hidden",
] as const;
export const EASE_SMOOTH = "ease-[cubic-bezier(0.22,1,0.36,1)]";
```

#### No Tailwind class constants _(Mandatory)_

**Never** hoist Tailwind/`className` strings into module-level constants in `.tsx` files — including
`const fooClassName = "..."`, `cn(...)` bundles at file top, or re-exports from `lib/constants/`.

| Put it here                         | Use for                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| **`className` on the element**      | Normal one-off styling — inline on JSX                                                            |
| **`components/ui/*-variants.ts`**   | shadcn `cva` variant definitions                                                                  |
| **Variant map in `lib/constants/`** | DRY map consumed by **multiple** components or `.map()` over options (see **No style constants**) |
| **`globals.css` utilities**         | Cross-cutting hooks (e.g. `.scrollbar-hide`, `.z-sticky-chrome`)                                  |

```tsx
// ❌ Forbidden — module-level class dumping
const footerButtonClassName = cn("h-10", "rounded-full", "px-8");

// ✅ Allowed — inline on the element
<Button className="h-10 rounded-full px-8 shadow-lg" />;

// ✅ Allowed — cva variants file
// components/ui/button-variants.ts

// ✅ Allowed — map driving repeated UI across components
CARD_ACCENTS.sand.badgeClassName;
```

Use `pnpm constants:reorg` / `pnpm constants:reorg:apply` with `src/lib/scripts/constants-reorg.manifest.json` for bulk moves and consolidations.

### Types Folder Structure _(Mandatory)_

Mirror **Component Folder Structure** homogeneity rules under `src/lib/types/`:

| Level contents      | Valid? | When to use                                                              |
| ------------------- | ------ | ------------------------------------------------------------------------ |
| **Files only**      | Yes    | Sibling type modules with no sub-structure                               |
| **Folders only**    | Yes    | Each child is its own unit (`entities/`, `api/`, `components/<domain>/`) |
| **Files + folders** | **No** | Never — folderize loose type files                                       |

Run `pnpm types:audit` before large type PRs. Paths under `lib/types/components/<domain>/` must stay aligned with matching `components/<domain>/`, `hooks/<domain>/`, and `lib/constants/components/<domain>/`.

#### Placement

| What                  | Where                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| **UI prop types**     | `lib/types/components/<domain>/` — mirror `components/<domain>/`                                      |
| **Entities / DTOs**   | `lib/types/entities/` (domain shapes) or `lib/types/api/` (API contracts)                             |
| **Infra**             | `lib/types/api/`, `lib/types/auth/` root only                                                         |
| **Hook-shaped props** | Feature module under `components/<domain>/` or co-located with hook types — not loose in entity files |

#### Naming

| Rule                           | Example                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| **Kebab-case `.ts` only**      | `patient-dashboard.ts`, `overlay-host.ts` — no `.tsx` in `lib/types/`                      |
| **No redundant parent prefix** | `patient-dashboard.ts` exports `PatientActionsPanelProps`, not a micro-file per card       |
| **UI-role symbols**            | `*OverlayHostProps`, `*PanelProps`, `*WizardProps` — reserve `*ModalProps` for true modals |
| **One module per feature**     | `curator/patient-dashboard.ts` not seven micro-files in `patient-dashboard/`               |
| **Consolidation**              | Micro-module: ≤20 lines **and** ≤2 exported types; merge when ≥3 siblings in same folder   |

Use `pnpm types:reorg` / `pnpm types:reorg:apply` with `src/lib/scripts/types-reorg.manifest.json` for bulk moves and consolidations.

### Utils Folder Structure _(Mandatory)_

Mirror **Component Folder Structure** homogeneity rules under `src/lib/utils/`:

| Level contents      | Valid?     | When to use                                                                  |
| ------------------- | ---------- | ---------------------------------------------------------------------------- |
| **Files only**      | No at root | Root `lib/utils/` must be **folders-only** after domain split                |
| **Folders only**    | Yes        | `shared/`, `auth/`, `provider/`, `curator/`, `patient/`, `notifications/`, … |
| **Files + folders** | **No**     | Never — folderize loose util files                                           |

| What                      | Where                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| **`cn()` only**           | `lib/utils.ts` — shadcn convention; no feature helpers or constant re-exports |
| **Cross-cutting helpers** | `lib/utils/shared/` (`a11y.ts`, `time-ago.ts`, `search-query.ts`, …)          |
| **Domain helpers**        | `lib/utils/<domain>/` — mirror `components/<domain>/` paths                   |
| **Types**                 | `lib/types/` only — not in utils files                                        |

#### Naming

| Rule                     | Example                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| **Kebab-case filenames** | `get-user-type.ts`, `time-ago.ts` — no `timeAgo.ts`                  |
| **No `-utils` suffix**   | `shared/color-hex.ts`, not `color-utils.ts`                          |
| **Pure functions**       | No React, hooks, or service imports                                  |
| **Consolidation**        | Micro-file: ≤20 lines **and** ≤2 exports; merge siblings             |
| **Dedup**                | One implementation per algorithm (`time-ago`, provider display name) |

Run `pnpm utils:audit` before large utils PRs. Paths under `lib/utils/<domain>/` must stay aligned with matching `components/`, `hooks/`, `constants/`, and `types/`.

Use `pnpm utils:reorg` / `pnpm utils:reorg:apply` with `src/lib/scripts/utils-reorg.manifest.json` for bulk moves and consolidations.

### Service Folder Structure _(Mandatory)_

Mirror **Component Folder Structure** homogeneity rules under `src/services/`:

| Level contents      | Valid?     | When to use                                                                                    |
| ------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| **Files only**      | No at root | Root `src/services/` must be **folders-only** (`shared/`, `curator/`, `provider/`, `patient/`) |
| **Folders only**    | Yes        | Domain folders mirror `hooks/<domain>/`                                                        |
| **Files + folders** | **No**     | Never — folderize loose service files                                                          |

**Domain-root exception:** `shared/`, `curator/`, `provider/`, and `patient/` may contain sibling module files plus one infra/feature subfolder (e.g. `curator/providers/`, `shared/websocket/`, `provider/dashboard/`). Deeper levels must stay homogeneous.

| What                | Where                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Cross-role API**  | `services/shared/` (`auth.ts`, `patients.ts`, `specialties.ts`, `unified-notifications.ts`)                                                                                                      |
| **Realtime infra**  | `services/shared/websocket/` (`stomp-client.ts`, `subscription-manager.ts`, `subscription-message-handlers.ts`, `provider-id.ts`) — not `*Service` names; split by lifecycle vs message dispatch |
| **Curator domain**  | `services/curator/` (`index.ts`, `partners.ts`, `schools.ts`, `providers/`)                                                                                                                      |
| **Provider domain** | `services/provider/dashboard/` (`index.ts` + sub-modules)                                                                                                                                        |
| **Patient domain**  | `services/patient/` (`lock-ins.ts`)                                                                                                                                                              |

#### Naming

| Rule                             | Example                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| **Kebab-case filenames**         | `lock-ins.ts`, not `lockins.ts`                                                             |
| **No parent-prefix in filename** | `curator/providers/list.ts`, not `providers.ts`                                             |
| **No legacy compound folders**   | `curator/providers/`, not `curator-providers/`                                              |
| **No root shims**                | Delete one-line `foo.ts` beside `foo/index.ts`                                              |
| **Facade barrels**               | One composed `*Service` per feature (`curatorProvidersService`, `providerDashboardService`) |
| **Short sub-exports**            | `listService`, `schoolsService` inside folders — not `curatorProviderListService`           |
| **Hooks import facades**         | `@/services/curator/providers`, not sub-paths like `.../schools`                            |

Run `pnpm services:audit` before large service PRs. Paths under `services/<domain>/` must stay aligned with matching `hooks/<domain>/`, `components/<domain>/`, `constants/`, `types/`, and `utils/`.

Use `pnpm services:reorg` / `pnpm services:reorg:apply` with `src/lib/scripts/services-reorg.manifest.json` for bulk moves and import rewrites.

### `lib/` root infra _(Mandatory)_

After utils domain split, `src/lib/` root holds **infra folders** plus the shadcn `utils.ts` entry — not feature helpers or services.

| Path                  | Responsibility                                                        |
| --------------------- | --------------------------------------------------------------------- |
| `lib/utils.ts`        | **`cn()` only** — do not move                                         |
| `lib/api/`            | HTTP client (`api()`); services import `@/lib/api`                    |
| `lib/auth/session.ts` | Token refresh, logout, session expiry (impure; not `lib/utils/auth/`) |
| `lib/metadata/`       | Next.js `getMetadata()` / site SEO defaults                           |
| `lib/query/`          | TanStack Query client registration for non-React consumers            |
| `lib/utils/`          | Pure helpers only — see Utils Folder Structure                        |
| `src/services/`       | Domain API/business logic — hooks call services, not `api()` directly |

**Do not** place API-calling modules at `lib/` root (`school-api-utils` pattern). **`processBatch`** and similar pure async helpers belong in `lib/utils/shared/`.

---

## Auth & Navigation _(Client)_

Auth tokens live in **`localStorage`**, not httpOnly cookies. This is an intentional constraint until a future cookie-based auth migration.

- **Mount-time guards** in hooks that read `localStorage` or URL search params and call `router.replace()` / `router.push()` are expected (e.g. signup guards, curator layout, password-reset prerequisites). Do not relocate these to middleware or server redirects without migrating auth storage first — server code cannot read `localStorage`.
- **Post-action navigation** (login success, form submit) belongs in **handlers** (`onSuccess`, `onSubmit`), not `useEffect`.
- **Do not module-cache** token reads (`getUserType`, `hasValidToken`, etc.). Tokens mutate at runtime; caching causes stale-auth bugs.

When a guard must stay client-side, add a one-line comment explaining why.

---

## Non-Negotiable Rules

- **Single responsibility** — one clear purpose per file, always.
- **No API calls** in `components/` or `app/`.
- **Routes compose only** — `app/**/page.tsx` wires metadata + feature components; no `view.tsx` or other UI modules under `app/`.
- **Components and routes** must not import directly from `services/` (use hooks).
- **Services** must not import React, Next.js routing, components, or hooks.
- **`.tsx` files** must not declare interfaces or type aliases.
- **No inline definitions** — do not define constants, types, or utilities inside feature `.tsx` files.
- **No style constants** — never export Tailwind/CSS classes from `lib/constants/` except DRY variant maps (see **No style constants** under Constants Folder Structure).
- **No Tailwind class constants** — never hoist `className` / `cn(...)` strings to module scope in `.tsx` except `cva` variant files or DRY variant maps (see **No Tailwind class constants**).
- **No micro-files** — do not add a file for a single export; merge into the feature module (see **No micro-files** under File Size & Modularity).
- **No circular imports** or cross-layer leakage.

---

## DRY Principles

Adhere to DRY (Don't Repeat Yourself) at all times. Before creating a new utility, hook, type,
or constant, verify one does not already exist.

---

## Frontend Best Practices

### Core Principles

- **Simplicity over cleverness.** Prefer the boring, obvious solution. Three similar lines beat a premature abstraction — don't build a helper, config object, or generic component for a single call site.
- **Match the existing pattern.** Before writing new code, find how the codebase already solves this class of problem (a similar hook, a similar card component, a similar service function) and follow it. Consistency beats local optimization.
- **Reuse before you build.** Check `src/components/ui/` and `src/components/shared/` before creating a new primitive. A new badge variant, table row, or card almost always belongs as an addition to an existing component (`*-variants.ts`, accessor file) rather than a parallel implementation.
- **Delete, don't deprecate.** If a component/hook/util is confirmed unused, remove it outright — no `_unused` suffixes, no commented-out code, no re-export shims for "just in case."

### Component Design

- Presentational components take props and render; they don't know where their data comes from.
- Prefer composition (children, slots) over a component that grows a new boolean prop for every variant. When a component's prop list is mostly booleans toggling entire sub-trees, it's usually two components.

### State Management — pick the right tool

| Need                                                                                             | Use                                                                                                    |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| UI-local state (open/closed, active tab, form draft)                                             | `useState`/`useReducer` in the component or a `hooks/components/<area>` hook                           |
| Server data (patients, schools, profile)                                                         | TanStack Query via a `hooks/queries/*` or domain hook — never `fetch`/`api()` directly in a component  |
| Cross-component client state that outlives a single tree (signup wizard progress, schools cache) | Jotai atom in `src/atoms/`                                                                             |
| Derived values                                                                                   | Compute in render or `useMemo` — don't mirror props/query data into `useState` and sync with an effect |

### Data Fetching (TanStack Query)

- Query keys live in `lib/constants/infra/query-keys.ts` — reuse existing key builders, don't invent ad hoc key arrays.
- Destructure only the fields a component actually uses from a query result; don't pass the whole query object down through props.
- Loading/error states are handled where the query is consumed, using the existing `Spinner`/`LoadingOverlay`/skeleton components — don't invent a new loading pattern per screen.

### Type Safety

- No `any`. If a type is genuinely unknown at a boundary (API response), model it explicitly and narrow it — don't escape-hatch past the compiler.
- Prefer a union of literal types over a loose `string` for anything with a fixed set of states (status, variant, role).

### Testing

- Test behavior a user or caller can observe (renders X, calls Y on click, redirects on Z) — not internal implementation details.
- When touching auth/redirect/guard logic, run the existing suite (`provider-finish-signup.test.ts`, `provider-sign-in-session.test.ts`, `provider-post-login-redirect.test.ts`, etc.) — these are regression tripwires for exactly the kind of client-side navigation bugs this app is prone to (see **Auth & Navigation** above).

### Before Calling UI Work Done

1. `pnpm typecheck` and `pnpm lint` — zero tolerance, not "pre-existing issues."
2. `pnpm test` for anything touching hooks/services/auth.
3. Run `pnpm dev` and actually click through the change in a browser — type-checking and unit tests verify correctness, not that the feature works or looks right.
4. For a new/changed screen, walk the **shape → craft → critique → polish** loop from the **UI Design Workflow** above, checked against `PRODUCT.md` and `DESIGN.md` — don't skip straight to code.
5. Run the relevant `pnpm *:audit` script (components/hooks/constants/types/utils/services) before a large PR.

---

## File Size & Modularity

- Application source files should generally stay **under 250 lines**.
- When a file grows beyond this limit, split it by concern: logic, UI, types, hooks, utilities.
- **Route pages (`app/`):** compose hooks + feature components only. Splitting route files is behavior-sensitive — requires manual QA of the live flow.
- **Feature UI:** follow **Component Folder Structure** above — homogeneous directories, `index.tsx` entries, `overlays/` vs `workspace/` split; shared shell in `components/overlays/shared/`.
- **Heavy UI logic:** extract to `hooks/components/...`; keep `.tsx` presentational.
- **No `renderX()` helpers** called in JSX — use `let content: ReactNode` + `switch`, or a keyed child component.
- **shadcn primitives:** colocated subcomponents are acceptable (`input-otp`, `input-group`). Move `cva` variants to sibling `*-variants.ts` so component files export components only.
- **Justified exception:** files with strong internal cohesion where splitting would harm readability.
- **Excluded from this rule:** generated files, config files, framework boilerplate, lockfiles,
  build artifacts, `node_modules`, `.next`, generated SDKs, migration snapshots, and package manifests.

### No micro-files _(Mandatory)_

Do **not** create files whose only job is a single export (one type, one constant object, one
10-line helper, one wrapper component). That is not modularity — it is noise.

| Layer          | Rule                                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Types**      | One module per feature/domain (`lib/types/components/patient/onboarding.ts`), not `onboarding-footer.ts` with one interface                                                     |
| **Constants**  | Merge ≤20-line / ≤2-export siblings into one module per folder (`auth-copy.ts`, `onboarding.ts`)                                                                                |
| **Utils**      | One algorithm per file is fine when the file has real logic; do not split a single pure function into its own file                                                              |
| **Components** | No folder that only wraps `index.tsx` with one export when it could be a sibling file under `workspace/` or merged into the parent; no shared micro-primitives for one callsite |

**Before adding a file**, ask: does this export stand alone with meaningful size (typically **>20 lines** or **≥3 related exports**), or am I fragmenting for appearance? Prefer extending an existing feature module.

Micro-module consolidation thresholds (types, constants, utils): **≤20 lines and ≤2 exports** → merge with siblings in the same folder. Run the matching `pnpm *:audit` before large PRs.

---

## React & Hooks Conventions

Effects are for **subscriptions and browser APIs**. State transitions belong in **handlers** unless the value is genuinely external.

| Situation                | Prefer                                                                                    | Avoid                                     |
| ------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| Prop → state sync        | `<Component key={id} />`, `useMemo`, or prev-prop tracking via **`useRef`** during render | Mirroring props into state in `useEffect` |
| Values that never render | `useRef`                                                                                  | `useState` read only inside effects       |
| Editable list keys       | Stable ids in hook data model (`{ id, value }[]`)                                         | Array index as React `key`                |
| Default props / options  | Module-level constants                                                                    | Inline `{}` / `[]` in parameter defaults  |
| Chained effect updates   | Single handler or ref-based transition tracking                                           | `setA` in effect → re-run → `setB`        |

Functional updates: use `setState((prev) => ...)` when the next value depends on the previous one.

---

## Performance Defaults

- **Motion:** import `m` from `motion/react`, not `motion`. The app is wrapped in `MotionProvider` (`LazyMotion` + `domMax`).
- **Styles:** hoist static `style` objects to module scope. Avoid `transition: all`, long durations, permanent `will-change`, and animating large blurs.
- **Listeners:** use `{ passive: true }` on `touchstart` when not calling `preventDefault`.
- **TanStack Query:** mutations that change server state must call **`invalidateQueries`** in `onSuccess`. Destructure only fields used from query results.
- **Parallel async:** use `Promise.all` for independent awaits. Keep sequential `await` in loops when batching semantics require it — add a brief comment explaining why.

---

## UI Design Workflow _(Impeccable)_

This project uses [Impeccable](https://impeccable.style/docs/) as its design system layer.
Two files define the design context and must be read before any UI work:

| File         | Purpose                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| `PRODUCT.md` | Product context — users, goals, tone, anti-patterns                      |
| `DESIGN.md`  | Visual system — colors, typography, spacing, components, do's and don'ts |

### Trigger

Apply this workflow automatically whenever a task involves any of the following:

> creating a page or screen · modifying a UI component · building a form or dashboard ·
> redesigning a layout · any task mentioning UI, page, screen, form, flow, or component

### Required Sequence

Every UI task must follow this loop in order. Do not skip phases.

```
shape → craft → critique → polish
```

| Phase        | What to do                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------ |
| **shape**    | Define UX first — screens, user flow, layout structure, hierarchy. No code yet.                  |
| **craft**    | Implement the UI. Follow `DESIGN.md` strictly. Produce clean, modular component structure.       |
| **critique** | Review the result — hierarchy, spacing, alignment, accessibility, consistency with `PRODUCT.md`. |
| **polish**   | Finalize to production quality — reduce visual noise, tighten typography, enforce design system. |

### Rules

- Always read `PRODUCT.md` before any design decision.
- Always enforce `DESIGN.md` constraints during implementation.
- Never skip **shape** when creating a new screen or feature.
- Never mark UI work complete without running **critique** and **polish**.
- When something looks off but is hard to describe, generate 2–3 visual variants and select the strongest.

### Specialized Passes _(use when relevant)_

| Pass         | When to apply                                                       |
| ------------ | ------------------------------------------------------------------- |
| **typeset**  | Typography feels inconsistent — font scale, hierarchy, line heights |
| **layout**   | Spacing or alignment feels off — rhythm, grouping, structure        |
| **colorize** | Color usage is inconsistent or lacks contrast strategy              |
| **audit**    | Before shipping — accessibility, performance, quality check         |

### Accessibility

- Prefer native `<button>` / `<a>`. All `<button>` elements need explicit **`type="button"`** unless submitting a form.
- When a wrapper must be clickable and contains other controls (cards, modal backdrops), use **`role="button"`**, `tabIndex={0}`, and **`activateOnKeyboard()`** from `lib/utils/a11y.ts`.
- Status messages: prefer `<output>` over `role="status"`.
- React Doctor may still flag `prefer-tag-over-role` on composite clickable regions — that is an accepted trade-off when a native `<button>` would produce invalid HTML.
- Apply a11y fixes through **critique → polish**, not drive-by `role` additions.

---

## Documented Exceptions

Some React Doctor rules and Fallow findings conflict with deliberate architecture. Do **not** "fix" these to chase score — add a **one-line rationale comment** at the site (React Doctor) or model them in `.fallowrc.json` (Fallow).

| Category               | Examples                                                                        | Why kept                                           |
| ---------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------- |
| Client auth guards     | `nextjs-no-client-side-redirect` in guard hooks                                 | `localStorage` unreadable server-side              |
| Token reads            | `js-cache-storage` in auth utils                                                | Runtime-mutating tokens; cache = stale auth        |
| shadcn inventory       | `unused-file` on `ui/combobox`, `drawer`, `progress`, `sheet`, `draggable-card` | Kept by design for the design system               |
| Colocated primitives   | `no-multi-comp` in `input-otp`, `input-group`                                   | Upstream shadcn convention                         |
| Concurrent UI flags    | `no-many-boolean-props` on notification sheets, confirmation modals             | Independent async states, not a status union       |
| Dynamic / crop images  | `nextjs-no-img-element` with eslint-disable                                     | Interactive editor or dynamic URLs                 |
| SSR-unsafe init        | `no-initialize-state` in canvas/DOM-measurement components                      | Cannot lazy-init without `useSyncExternalStore`    |
| Runtime deps           | `unused-dependency` on `sharp`                                                  | Required by Next.js image optimization at runtime  |
| Fallow sidecar         | `ignoreDependencies`: `@fallow-cli/fallow-cov`                                  | Runtime coverage sidecar; not statically imported  |
| ESLint preset          | `ignoreDependencies`: `eslint-config-next`                                      | Consumed by ESLint config, not application imports |
| Fallow shadcn exports  | `ignoreExports` in `.fallowrc.json` for design-system primitives                | Kept by design for the design system               |
| shadcn flat primitives | `components/ui/` mixed with `curator-sidebar/`                                  | Upstream shadcn layout; sidebar is app extension   |

Revisit exceptions only when the underlying constraint changes (e.g. cookie auth migration).

---

## Quality Gates

**All checks must pass before marking a task complete.**

```bash
npm run lint
npx tsc --noEmit
npx react-doctor@latest
pnpm components:audit      # Before large component PRs
pnpm hooks:audit             # Before large hook PRs
pnpm constants:audit           # Before large constants PRs
pnpm types:audit               # Before large type PRs
pnpm utils:audit               # Before large utils PRs
pnpm services:audit            # Before large service PRs
pnpm conventions:audit         # Component + hook + constants + types + utils + services audits
pnpm fallow:audit          # PR gate: new-only (introduced findings)
pnpm fallow:audit:all      # Pre-release: gate all + production-health on changed files
```

**Dual-gate policy:** PRs and `main` use `gate: new-only` (`.github/workflows/fallow.yml`). Pre-release checks use `pnpm fallow:audit:all` locally or the manual `Fallow Release` workflow (`.github/workflows/fallow-release.yml`). See [plan/process-fallow-release-gate-1.md](plan/process-fallow-release-gate-1.md).

[React Doctor](https://www.react.doctor/) performs deterministic static analysis across state & effects,
performance, architecture, security, and accessibility — and produces a health score for the codebase.
The score must **not regress** on changes you touch. Fix new issues and regressions; document deliberate
keeps per **Documented Exceptions** above rather than suppressing or working around rules.

[Fallow](https://docs.fallow.tools/) performs codebase intelligence analysis: unused code, duplication,
complexity hotspots, and architecture drift. `fallow audit` gates only **new** findings introduced by
the changeset (`gate: new-only` default). Fix introduced issues; model intentional keeps in `.fallowrc.json`
or with `@expected-unused` / `fallow-ignore-next-line` per **Documented Exceptions** above.

Any violation of lint or type-check is treated as a **failing change request** and must be resolved before merge.
Do not skip hooks (`--no-verify`) unless explicitly requested.
