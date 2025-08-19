# FleetFusion Construction Management App

FleetFusion is a Next.js 15 application for managing construction projects, time tracking, daily logs, and documents. It provides a dashboard that surfaces key metrics such as active projects, pending tasks, hours worked today, and recent logs.

## Features
- **Project Management** – Track project details, status, and client information with rich cards and overviews.
- **Task Tracking** – Manage tasks per project and monitor pending items.
- **Time Tracking** – Capture daily time entries and generate payroll summaries.
- **Daily Logs** – Record onsite activity and attach photos for a permanent record.
- **Document Handling** – Upload project documents and keep files organized.

## Tech Stack
- [Next.js](https://nextjs.org/) 15 with the App Router
- [React](https://react.dev/) 19
- [Prisma](https://www.prisma.io/) ORM with PostgreSQL
- [Tailwind CSS](https://tailwindcss.com/) 4 and Radix UI components

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Set environment variables**
   - Create a `.env` file based on `.env.example` and set `DATABASE_URL`, `DIRECT_URL`, and `SHADOW_DATABASE_URL`.
3. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```
4. **Start development server**
   ```bash
   npm run dev
   ```

Additional commands:
- `npm run build` – build for production
- `npm run lint` – run ESLint

## Project Structure
- `app/` – Next.js routes and layouts
- `components/` – Reusable UI components and domain widgets
- `lib/` – Shared utilities
- `prisma/` – Prisma schema and migrations
- `public/` – Static assets

## Documentation
Detailed development guidelines, architecture notes, and workflow practices are in [docs/development.md](docs/development.md). Recommendations for future work are in [docs/recommendations.md](docs/recommendations.md).

## Contributing
Use the issue and pull request templates in the `.github` directory. Follow the development instructions in [AGENTS.md](AGENTS.md) before submitting changes.

