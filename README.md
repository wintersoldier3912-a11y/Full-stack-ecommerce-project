ecom-core-system

Production-minded E-Commerce Core System + Admin Console — a full-stack MVP with storefront, cart, checkout (mocked payment), and a secure admin dashboard. This README explains how to run, test, and develop the project.

Table of contents

Project overview

Tech stack

Features (MVP)

Folder structure

Requirements

Environment variables (.env)

Quickstart — Docker (recommended)

Quickstart — Local (without Docker)

Scripts (npm)

Testing & CI

Seed data & admin credentials

API docs & OpenAPI-style routes

Acceptance checklist

Contributing

License

1 — Project overview

This repo contains a Next.js + TypeScript full-stack application implementing an e-commerce storefront and an admin console. The backend uses Prisma + PostgreSQL. The payment flow is simulated (no real payment providers). The project is set up for local development with Docker, includes migrations and seed data, unit and E2E tests, and a CI workflow that runs lint/tests/build.

2 — Tech stack

Frontend: Next.js (App Router) + TypeScript + Tailwind CSS

Backend: Next.js API routes (Node) + TypeScript + Prisma ORM

Database: PostgreSQL (migrations via Prisma)

Auth: Role-based auth (customer / admin), secure password hashing

Testing: Jest + React Testing Library (unit) and Playwright (E2E) or Cypress (configurable)

Devops: Docker + docker-compose, GitHub Actions CI

Lint/format: ESLint + Prettier

3 — MVP features

Public storefront

Product listing (search + category filter + pagination)

Product detail with images, stock qty

Cart (add/update/remove)

Checkout (collect shipping/contact + Mock Payment)

Order confirmation + customer order history

Admin console (admin role)

Product CRUD (multiple images support, local storage in dev)

Inventory management (adjust stock)

Order list & status workflow (Received → Processing → Shipped → Delivered → Cancelled)

Simple analytics panel (orders, revenue, product count)

Admin user management (create/deactivate admins)

Other

REST JSON APIs for products, auth, cart, orders, admin ops

Server-side validation, role checks, CSRF protections, basic request logging

Pagination for lists, unified API error format

4 — Folder structure (high-level)
/app                # Next.js app (pages/app router)
  /admin            # Admin console pages
  /components       # Shared React components
  /styles
/prisma             # prisma schema + migrations
/api                # optional standalone API folder (if used)
/lib                 # db, auth, utils, validations
/tests              # unit + e2e tests
/docker
/scripts             # helper scripts (migrate, seed, reset)
README.md
env.example
package.json
docker-compose.yml

5 — Requirements

Node.js 18+ (recommended)

pnpm / npm / yarn (npm instructions used below)

Docker & docker-compose (for Docker quickstart)

A Unix-like shell for scripts (Windows: use WSL or Git Bash recommended)

6 — Environment variables (.env)

Create a .env file (copy from env.example). Minimal variables used by the app:

# Database
DATABASE_URL="postgresql://postgres:postgres@db:5432/ecom?schema=public"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-long-random-string-change-this"
SESSION_COOKIE_NAME="ecom_session"

# Prisma
SHADOW_DATABASE_URL="postgresql://postgres:postgres@db:5433/ecom_shadow?schema=public"

# Email (mocked)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user"
SMTP_PASS="pass"

# Misc
NODE_ENV="development"


env.example in the repo contains the same variables with placeholders.

7 — Quickstart — Docker (recommended)

This will spin up the app + Postgres and automatically run migrations + seed on first run.

Copy env example:

cp env.example .env


Edit .env if needed.

Start services:

docker-compose up --build


On first start the app will:

apply Prisma migrations

run seed script to populate sample data (products, users, orders)

create a default admin user (see Credentials below)

Open the app:

Storefront: http://localhost:3000

Admin console: http://localhost:3000/admin
(Use the seeded admin credentials to sign in.)

Stop:

docker-compose down

8 — Quickstart — Local (without Docker)

Install dependencies:

npm ci


Start Postgres locally (or use Docker only for Postgres). Set DATABASE_URL in .env to point to your Postgres instance.

Run migrations and seed:

npm run migrate:dev
npm run seed


Start dev server:

npm run dev


Visit http://localhost:3000 (storefront) and http://localhost:3000/admin (admin console).

9 — Useful npm scripts

npm run dev — run Next.js in development mode

npm run build — build the app

npm run start — start built app

npm run migrate:dev — run Prisma migrate dev (apply migrations)

npm run migrate:deploy — run Prisma migrate deploy (CI/prod)

npm run seed — run seed script to populate DB

npm test — run unit tests (Jest)

npm run e2e — run end-to-end tests (Playwright/Cypress)

npm run lint — run ESLint

npm run format — run Prettier

npm run reset-db — reset DB + re-run migrations + seed (dev helper)

10 — Testing & CI

Unit tests use Jest + React Testing Library and should cover core logic (product model / cart / checkout form).

E2E tests use Playwright (or Cypress) and include the smoke test flow:

user signup → login → add product → checkout → verify order

admin login → update order status → verify change in customer view

CI (GitHub Actions) runs: npm ci, npm run lint, npm test, npm run build. E2E can be included in a separate workflow that brings up docker-compose for test environment.

11 — Seed data & admin credentials

Seed script creates:

20 products across 4 categories

5 sample customers

10 sample orders with varied statuses

1 default admin account

Default seeded admin credentials

Email: admin@example.com

Password: Password123!

(You can change these values in the seed script before running or reset after.)

12 — API docs & OpenAPI-style routes

A single markdown file docs/api.md contains OpenAPI-style route documentation (endpoints, request/response shapes, auth requirements). Key endpoints:

POST /api/auth/signup

POST /api/auth/login

POST /api/auth/logout

GET /api/products

GET /api/products/:id

POST /api/cart (or server-side cart endpoints)

POST /api/checkout (simulate payment)

GET /api/orders/:id (auth required)

GET /api/admin/orders (admin only)

PATCH /api/admin/orders/:id/status (admin only)

Admin product CRUD endpoints under /api/admin/products

13 — Acceptance checklist

The project aims to meet the following acceptance criteria. When completed, these items should be checked off in the PR description.

 Unit tests for product model and critical components (cart, checkout)

 E2E smoke test: signup → add to cart → checkout → order history; admin order status update verified

 Lint and format pass in CI (npm run lint, npm run format)

 docker-compose up brings up app + Postgres and seeds DB on first run

 README documents run/deploy/test/seed steps and required env vars

 OpenAPI-style API docs in docs/api.md

 Secure auth with role checks and password hashing

 Pagination on listings and unified API error format

 Admin product CRUD and order workflow implemented

 CI workflow runs lint, tests, and build successfully

14 — Contributing

Follow the commit milestone structure: small, focused commits per feature.

Run lint/tests before opening PRs.

Use CONTRIBUTING.md for branching and PR checklist (included in repo).
