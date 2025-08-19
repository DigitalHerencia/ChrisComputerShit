# Development Guide

This document explains how to set up the project, run it locally, and contribute changes.

## Environment Setup
- Node.js 18 or later
- PostgreSQL database (Neon recommended)
- Copy `.env.example` to `.env` and configure `DATABASE_URL`, `DIRECT_URL`, and `SHADOW_DATABASE_URL`.

Install dependencies:
```bash
npm install
```

Run database migrations:
```bash
npx prisma migrate dev
```

## Running Locally
```bash
npm run dev
```
The app will be available on `http://localhost:3000`.

## Testing & Linting
- `npm test` – runs tests (currently not defined; contributors should add tests when adding new features).
- `npm run lint` – runs ESLint. Ensure it passes before committing.

## Proposed Gitflow
1. Create an issue using one of the templates.
2. Branch from `main` using `feature/<issue-number>-short-description` or `fix/<issue-number>-short-description`.
3. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
4. Push your branch and open a pull request.
5. The PR must reference the issue number and include testing notes.
6. After review and successful checks, merge into `main`.

## Architecture Guidelines
- Pages live in `app/**/page.tsx` and render feature modules.
- Feature modules in `features/{domain}` handle data fetching and mutations.
- UI components in `components/{domain}` are pure and receive data via props.
- Style everything with Tailwind classes using the design system.
- Wrap async sections in `<Suspense>` with skeleton fallbacks.
- Cards use `rounded-md`, `shadow-md`, `bg-black`, `p-6`, and `border border-gray-200`.

## Issue & PR Workflow
- Bug reports and feature requests use the templates in `.github/ISSUE_TEMPLATE`.
- PRs must use `.github/pull_request_template.md` and describe changes, testing, and related issues.

## Further Reading
- [Recommendations](recommendations.md)

