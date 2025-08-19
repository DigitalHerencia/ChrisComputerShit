# 🧰 Chris’s Computer Sh*t 🏗️  
**A modern construction management dashboard built on Next.js 15, Prisma & Neon Postgres**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io/)
[![Neon](https://img.shields.io/badge/PostgreSQL-Neon-15A143?logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)
[![Conventional Commits](https://img.shields.io/badge/Commits-Conventional-FE5196.svg)](https://www.conventionalcommits.org/)
[![Open in VS Code](https://img.shields.io/badge/Dev-Open%20in%20VS%20Code-007ACC?logo=visualstudiocode)](https://code.visualstudio.com/)

> **FleetFusion** is a server‑first Next.js application for managing construction projects: daily logs, timesheets, tasks, documents, and more — optimized for foremen and superintendents who “don’t have time for nerd stuff.”  
> Directory layout, features, and tech choices are visible in the repo (see `app/`, `components/`, `lib/`, `prisma/`, `public/`).

---

## ✨ Features

- **Project Management** — Overview pages, client info, project status. 
- **Task Tracking** — Track to‑dos & inspections across jobs. 
- **Time Tracking** — Capture worker hours and summarize for payroll. 
- **Daily Logs** — Record onsite activity with photos.  
- **Document Handling** — Upload & organize project files. 

---

## 🧱 Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)  
- **DB & ORM:** PostgreSQL (Neon, serverless) + Prisma  
- **UI:** Tailwind CSS 4, Radix/shadcn‑style components  
- **Auth & Middleware:** Ready for platform auth + edge‑friendly patterns  
- **Tooling:** ESLint, Prettier, Vitest/Playwright (recommended)

---

## 📁 Project Structure

- app/ # Routes, layouts, server components
- components/ # Reusable UI & widgets
- lib/ # Utilities, helpers, client/server instantiation
- prisma/ # Prisma schema & migrations
- public/ # Static assets (icons, images)

---

## 🚀 Quick Start

1) Install deps
```
npm install
```

2) Environment (copy, then fill)
```
.env.example 
.env
```

3) Database: run migrations (dev)
```
npx prisma migrate dev
```

4) Start dev server
```
npm run dev
```
