## Contacts Domain — Architecture & Patterns (Generalized)

This document describes the architecture, file responsibilities, and data flow used by the `contacts` domain in this project. The patterns shown are intentionally generic so they can be applied to other domains (projects, tasks, documents, etc.). Use this as a template for implementing similar CRUD domains.

### Goal

Provide a small, well-organized domain that supports:
- Listing, filtering, and searching entities
- Viewing a detail page
- Creating and editing entities via server actions
- Client-UI components that are reusable across domains

### High-level structure

Typical folders and responsibilities for a domain named `X` (contacts -> X = contacts):

- `app/dashboard/x/` — App Router pages that compose the UI for list, new, detail, and edit views.
- `features/x/` — Small composed React/Server Components that fetch data and render the domain UI (e.g., `x-list`, `x-detail`, `x-edit`, `x-new`). Server components can call fetchers directly.
- `components/x/` — Presentational and form components used by the domain (e.g., `x-form`, `x-card`). Keep these UI-only and reusable.
- `lib/fetchers/x.ts` — Data access functions (read-only) that talk to the DB layer (Prisma). Return plain JS objects. Used by Server Components and pages.
- `lib/actions/x.ts` — Server Actions for mutate operations (create, update, delete). These are 'use server' functions that accept FormData and perform validation + DB writes + cache revalidation.
- `lib/validators/x.ts` — Validation schemas (zod) used to validate and parse incoming form data in server actions.
- `prisma/` — Data model (e.g., `Entity` or domain-specific model). The fetchers/actions use this model.

Files in the example repo and their mapping:

- `components/contacts/contact-form.tsx` — form UI using client hooks for form status and action state.
- `components/contacts/contact-card.tsx` — small presentational card component used in lists.
- `features/contacts/*` — composed server components: `contact-list`, `contact-detail`, `contact-edit`, `contact-new`.
- `lib/fetchers/contacts.ts` — read-side Prisma accessors like `getContacts`, `getContact`, and helpers per type.
- `lib/actions/contacts.ts` — server actions `createContact` and `updateContact` that validate via `contactSchema`, write to Prisma, then call `revalidatePath`.
- `lib/validators/contacts.ts` — `contactSchema` (zod) that defines the shape accepted by actions.
- `app/dashboard/contacts/*.tsx` — pages that wire the composed features into routes and provide forms and navigation.

### Data flow (create/update/list/detail)

1. UI (client) renders `ContactForm` which is a client component and uses `form` with action bound to a Server Action (Next App Router server actions via `form action=`).
2. On submit, browser sends a FormData POST to the server action function in `lib/actions/contacts.ts`.
3. Server action converts FormData to a POJO and validates with `contactSchema.safeParse`.
   - If invalid, return an error object that the client `useActionState` can read and display.
4. Valid input -> call Prisma to create/update the record.
5. After success, call `revalidatePath()` to invalidate the cached routes (list and detail pages).
6. Server Components (e.g., `ContactList`) call `getContacts()` which reads from DB and gets fresh data on next render after revalidation.

This is a robust pattern: client submits -> server action validates & mutates -> cache revalidation -> server components read updated data.

### Contracts

For each domain implement a small contract for fetchers and actions.

- Fetchers
  - getList(filters?): Promise<Array<Entity>>
  - getOne(id: string): Promise<Entity | null>

- Actions (server)
  - create(_: unknown, formData: FormData) -> { success?: true } | { error: string }
  - update(_: unknown, formData: FormData) -> { success?: true } | { error: string }

- Validators
  - zod schema that mirrors the fields the `Form` will send.

Error modes should be explicit and easy to render in the UI (e.g., return { error: 'Missing id' }).

### UI patterns

- Keep forms as client components so they can show loading/error state. Use `useFormStatus` for submission pending state and `useActionState` to read server action responses.
- Make small presentational components (cards, list items) that only take data props.
- Server components should own data fetching. They can get `id` from params and call fetchers directly.

### Suspense & the route `loading.tsx`

Next.js App Router supports both route-level `loading.tsx` files and React Suspense fallbacks for smaller UI regions. For the `contacts` domain we use a dedicated loading component at `app/dashboard/contacts/loading.tsx` that renders skeletons and compact placeholders. Key points:

- Route-level `loading.tsx` (for example `app/dashboard/contacts/loading.tsx`) is automatically used by Next.js during client-side transitions and initial async rendering for the route segment. It's a good place for a full-page or route-level skeleton UI.
- Use React `Suspense` when you want a partial fallback for a specific server component or region (for example, the contacts list). You can reuse the same `ContactsLoading` component as the `Suspense` fallback to keep visual consistency.
- Keep loading UIs lightweight and presentational (skeletons, spinners, placeholders). Avoid heavy logic in loading components.

Example pattern (from `app/dashboard/contacts/page.tsx`):

```tsx
import { Suspense } from 'react';
import ContactsLoading from './loading';
import { ContactList } from '@/features/contacts/contact-list';

export default async function ContactsPage() {
  return (
    <div>
      {/* ...filters/header... */}
      <Suspense fallback={<ContactsLoading />}>
        <ContactList /* server props */ />
      </Suspense>
    </div>
  );
}
```

When to use which:

- Prefer a `loading.tsx` when the whole route should show a placeholder during navigation or initial render. Next.js picks it up automatically.
- Use `Suspense` when only a sub-tree (like the list or a chart) is async and you want to show a smaller, local fallback while other parts of the page render immediately.

Testing & revalidation notes:

- Because loading UIs are read-only and purely presentational, keep tests minimal: assert the skeletons render and that they match accessibility expectations (e.g., no focus traps, appropriate aria-hidden where needed).
- Reuse the same loading component for both route-level `loading.tsx` and as a `Suspense` fallback to ensure consistent visuals and avoid duplication.

### Validation & Security

- Always validate server-side using a shared schema (`lib/validators/x.ts`). Do not trust client validation alone.
- For update actions, ensure you read and validate the `id` field separately (check presence and format) before writing.

### Cache invalidation

- Use `revalidatePath` (or similar per-framework APIs) to mark the list and detail pages stale after mutations. Invalidate all routes that could be affected by the change.

### Tests and Quality Gates

- Unit tests
  - Fetchers: stub Prisma and assert queries & returned transformed shape.
  - Validators: test acceptance and rejection cases.
  - Actions: call the server action with fake FormData and a mocked Prisma; assert behavior for success and errors.

- Integration / Smoke
  - Render the `ContactForm` in a test harness, simulate submission, assert that the action returns success and that `revalidatePath` was called (mocked).

- Quality gates to run on changes: build/typecheck, lint, unit tests.

### Edge cases & considerations

- Missing ID on update -> return a clear error.
- Partial optional fields -> use `?.toString()` when reading FormData entries and keep validators permissive where appropriate.
- Concurrency: Handle optimistic locking where necessary for critical domains; otherwise last-write-wins may be acceptable.

### How to apply this pattern to other domains

1. Copy `features/contacts/*` -> `features/X/*` and adapt names.
2. Copy `components/contacts/*` -> `components/X/*` and replace fields with domain-specific ones.
3. Implement `lib/fetchers/x.ts` with read-only Prisma functions for the new model.
4. Implement `lib/actions/x.ts` with create/update/delete server actions that use a `lib/validators/x.ts` zod schema.
5. Wire pages under `app/dashboard/x/` to use the feature components.

### Minimal checklist for adding a new domain

- [ ] Prisma model exists and migrated
- [ ] `lib/validators/x.ts` created
- [ ] `lib/fetchers/x.ts` created (read functions)
- [ ] `lib/actions/x.ts` created (mutating actions)
- [ ] `components/x/x-form.tsx` and `components/x/x-card.tsx` created
- [ ] `features/x/*` server components created
- [ ] `app/dashboard/x/*` pages created
- [ ] Tests for fetchers, validators, and actions

### Notes and small improvements

- Consider centralizing common form utilities if many domains share similar fields (address, phone, email).
- For long lists, add server-side pagination to `getList` and reflect UI controls in the list page.
- Use feature flags or soft deletes if domain requires retention or staged rollout.

---

Files referenced from the example (for quick mapping):

- `components/contacts/contact-form.tsx` — client-side form + Submit button using `useFormStatus` and `useActionState`.
- `components/contacts/contact-card.tsx` — small presentational card used by lists.
- `features/contacts/contact-list.tsx` — server component that calls `getContacts` and renders a grid of `ContactCard`.
- `features/contacts/contact-detail.tsx` — server component that calls `getContact` and renders a detail card.
- `features/contacts/contact-edit.tsx` / `contact-new.tsx` — compose `ContactForm` for edit/new flows.
- `lib/fetchers/contacts.ts` — `getContacts`, `getContact`, and typed helpers per type.
- `lib/actions/contacts.ts` — `createContact` and `updateContact`, validate with `contactSchema`, write to Prisma, `revalidatePath`.
- `lib/validators/contacts.ts` — `contactSchema` zod shape for server validation.

Requirements coverage

- Create docs file in `docs/` — Done
- Use included contacts files to describe architecture & generalize — Done

Completion status: Done — `docs/contacts-domain-architecture.md` added.
