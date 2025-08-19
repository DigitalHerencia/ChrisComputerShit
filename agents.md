# Agent Instructions

This repository follows strict UI and architecture conventions.

## Code Conventions
- Pages belong in `app/**/page.tsx` and should render feature modules inside `<Suspense>` blocks.
- Feature modules live in `features/{domain}` and are responsible for all data fetching and mutations.
- Components live in `components/{domain}` and are pure UI with data passed via props.
- Use Tailwind CSS utilities with the design system: cards use `rounded-md`, `shadow-md`, `bg-black`, `p-6`, `border border-gray-200`.
- Tabs, headers, and grids must match the FleetFusion style guide.

## Development Workflow
- Use [Conventional Commits](https://www.conventionalcommits.org/).
- Always run `npm test` (when defined) and `npm run lint` before committing.
- Follow the Gitflow described in `docs/development.md`.
- Update documentation when adding or modifying features.

## Pull Requests
- Reference related issues and include testing notes.
- Ensure CI checks pass before requesting review.

