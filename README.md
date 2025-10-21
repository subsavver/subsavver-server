# SubSavver — Backend Documentation

> Central backend documentation for the SubSavver project. Use this file as the single-source-of-truth for setup, architecture, APIs, database, cron jobs, deployment, and contribution guidelines.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started (Local)](#getting-started-local)
4. [Environment Variables](#environment-variables)
5. [Database & Schema](#database--schema)
6. [API Reference](#api-reference)

   * Auth
   * Users
   * Subscriptions
   * Categories
   * Payments
   * Webhooks
   * Reminders
7. [Background Jobs & Cron](#background-jobs--cron)
8. [Email / Notifications](#email--notifications)
9. [Error Handling & HTTP Status Codes](#error-handling--http-status-codes)
10. [Security Best Practices](#security-best-practices)
11. [Logging, Metrics & Monitoring](#logging-metrics--monitoring)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Development Conventions](#development-conventions)
15. [Open Issues / TODOs](#open-issues--todos)
16. [Contribution Guide](#contribution-guide)

---

## Project Overview

SubSavver helps users track recurring subscriptions and payment renewals, sends reminders, and stores subscription metadata (name, tier, provider, price, renewalDate, etc.). The backend exposes a REST API consumed by the frontend (Next.js or similar) and integrates with payment providers and email services.

## Architecture

* **Node.js + TypeScript** — express or similar framework
* **Prisma** as ORM (or Prisma-like DB client) connecting to **Postgres** (recommended) or MySQL
* **Cron jobs** for reminders (node-cron / BullMQ if scaling)
* **Mailer** (SendGrid / Mailgun / SMTP)
* **Payment provider** integrations (Stripe / PayPal / Razorpay)
* **Queue** for background work (BullMQ / Redis)
* **Logging** via Winston / Pino, metrics exported to Prometheus

## Getting Started (Local)

1. Clone the repo

```bash
git clone git@github.com:your-org/subsavver.git
cd subsavver
```

2. Install dependencies

```bash
pnpm install # or npm install / yarn
```

3. Copy env

```bash
cp .env.example .env
# fill values in .env
```

4. Run database migrations

```bash
npx prisma migrate dev --name init
```

5. Start dev server

```bash
pnpm dev # or npm run dev
```

6. Optional: run worker/cron

```bash
pnpm start:worker
pnpm start:cron
```

## Environment Variables

Populate `.env` with at least the following values:

```
# App
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:4000

# Database (Postgres example)
DATABASE_URL=postgresql://user:pass@localhost:5432/subsavver?schema=public

# Prisma (if used)

# JWT / Auth
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=7d

# Mailer
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
MAIL_FROM=no-reply@subsavver.com

# Payment provider (example: Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Redis (if using queue)
REDIS_URL=redis://localhost:6379

# Cron/Reminders
REMIND_BEFORE_DAYS=3

# Logging/Monitoring
SENTRY_DSN=

```

## Database & Schema

A Prisma-style simplified schema to show main tables. Adapt for your DB/ORM of choice.

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  subscriptions UserSubscription[]
}

model Category {
  id    String @id @default(uuid())
  name  String @unique
  slug  String @unique
  icon  String?
}

model Subscription {
  id           String   @id @default(uuid())
  title        String
  provider     String
  price        Float
  currency     String
  billingCycle String   // monthly, yearly, etc
  categoryId   String?
  category     Category? @relation(fields: [categoryId], references: [id])
  createdAt    DateTime  @default(now())
}

model UserSubscription {
  id             String   @id @default(uuid())
  userId         String
  subscriptionId String
  renewalDate    DateTime
  reminderDays   Int      @default(3)
  active         Boolean  @default(true)
  createdAt      DateTime @default(now())

  user         User         @relation(fields: [userId], references: [id])
  subscription Subscription @relation(fields: [subscriptionId], references: [id])
}

model Payment {
  id             String   @id @default(uuid())
  userId         String
  userSubscriptionId String?
  amount         Float
  currency       String
  status         String   // pending, succeeded, failed
  provider       String   // stripe, paypal, razorpay
  providerData   Json?
  createdAt      DateTime @default(now())
}

model Reminder {
  id             String @id @default(uuid())
  userId         String
  userSubscriptionId String
  remindAt       DateTime
  sent           Boolean @default(false)
  sentAt         DateTime?
}
```

## API Reference

Below are the key endpoints. Use `Authorization: Bearer <token>` where applicable.

### Auth

* `POST /api/auth/register` — register (email, password, name)
* `POST /api/auth/login` — login (email + password) -> returns JWT
* `POST /api/auth/refresh` — refresh token (if implemented)
* `POST /api/auth/forgot-password` — request password reset
* `POST /api/auth/reset-password` — reset with token

### Users

* `GET /api/users/me` — get current user
* `PATCH /api/users/me` — update profile

### Categories

* `GET /api/categories` — list categories
* `POST /api/categories` — create category (admin)
* `GET /api/categories/:id` — get category
* `PATCH /api/categories/:id` — update category
* `DELETE /api/categories/:id` — delete category

> **Note:** Implement pagination for `GET /api/categories` if many categories.

### Subscriptions (catalog)

* `GET /api/subscriptions` — list subscription templates/catalog
* `POST /api/subscriptions` — create subscription template (admin)
* `GET /api/subscriptions/:id` — details
* `PATCH /api/subscriptions/:id` — update
* `DELETE /api/subscriptions/:id` — delete

### User Subscriptions (user-owned)

* `GET /api/user-subscriptions` — list user's subscriptions
* `POST /api/user-subscriptions` — add a subscription instance (userId, subscriptionId or custom title, price, renewalDate, billingCycle, reminderDays)
* `GET /api/user-subscriptions/:id` — get one
* `PATCH /api/user-subscriptions/:id` — update (renewalDate, active, reminderDays)
* `DELETE /api/user-subscriptions/:id` — remove

### Payments

* `POST /api/payments/create` — create payment intent (provider-specific payload)
* `POST /api/payments/webhook` — provider webhook endpoint (verify signature)
* `GET /api/payments/:id` — payment details
* `GET /api/user-payments` — list payments for current user

### Reminders & Cron-controlled

* `GET /api/reminders` — list scheduled reminders (admin/debug)
* `POST /api/reminders/trigger` — manual trigger for testing (protected)

### Webhooks

* `POST /api/webhooks/stripe` — stripe webhook
* `POST /api/webhooks/paypal` — paypal webhook

## Background Jobs & Cron

* Use `node-cron` or a queue worker. Example cron: run every minute/hour to scan `UserSubscription` for `renewalDate` within `now` + `REMIND_BEFORE_DAYS` and create/send `Reminder` entries/emails.

* For scale, use Redis + Bull/BullMQ and schedule jobs per subscription.

Example flow:

1. Cron job runs hourly
2. Query subscriptions where `renewalDate` is between `now` and `now + REMIND_BEFORE_DAYS`
3. If reminder not sent, enqueue job to send email / push notification
4. Mark reminder as `sent` and log result

## Email / Notifications

* Centralize email templates in `/emails` (handle i18n later).
* Support transactional emails: reminder, payment success, payment failed, subscription added, password reset.
* Use a mailer service adapter pattern to allow swapping providers.

## Error Handling & HTTP Status Codes

Standardize errors with an error middleware. Use consistent shape:

```json
{
  "status": "error",
  "message": "Detailed human-friendly message",
  "code": "NOT_FOUND" // optional machine code
}
```

Common status codes:

* `200` OK
* `201` Created
* `400` Bad Request (validation error)
* `401` Unauthorized
* `403` Forbidden
* `404` Not Found
* `409` Conflict (e.g., duplicate resource)
* `422` Unprocessable Entity
* `500` Internal Server Error

## Security Best Practices

* Hash passwords with bcrypt/argon2 and never store plaintext
* Validate and sanitize inputs (use `zod`/`yup`/`joi`/`class-validator`)
* Rate-limit auth endpoints (express-rate-limit)
* Store JWT secret in env; use short lived tokens
* Verify webhooks using provider signatures
* Use HTTPS in production
* Principle of least privilege for DB credentials
* Regular dependency scans (npm audit / Snyk)

## Logging, Metrics & Monitoring

* Structured logging (JSON) via Pino/Winston
* Capture errors to Sentry
* Expose basic Prometheus metrics (uptime, job queue length, reminders sent)
* Health endpoint: `GET /api/health`

## Testing

* Unit tests: Jest + ts-jest
* Integration tests: Supertest hitting a test instance or in-memory DB
* E2E: optional Playwright tests for frontend/back-to-back flows
* CI: run lint, typecheck, tests on PRs

## Deployment

* Dockerize service; use Docker Compose for local dev (app + db + redis)
* Use a cloud provider (Heroku / DigitalOcean / AWS Elastic Beanstalk / ECS / Fly)
* Apply migrations in CI/CD or during startup with caution (`prisma migrate deploy`)
* Use environment-specific values in secrets manager

## Development Conventions

* Commit messages: conventional commits (feat:, fix:, chore:, docs:)
* Branching: feature/*, fix/*, hotfix/*
* Linting: ESLint + Prettier
* Types: strict TypeScript settings
* API responses: consistent shape (wrap in `{ data, meta, error }`)

## Open Issues / TODOs

* [ ] Implement **categories** endpoint (CRUD) including validation and admin checks.
* [ ] Implement **payment** feature: create payment intents, handle provider webhooks, link payments to user subscriptions.
* [ ] Add tests for reminder cron job scoping edge-cases (timezones, daylight saving).
* [ ] Improve rate-limiting and IP-based protections.
* [ ] Add a queue worker (BullMQ) to scale email sending and webhook processing.
* [ ] Add idempotency for webhooks and payment processing.
* [ ] Add role-based access control (admin vs user).

## Example: Payment Flow (Stripe)

1. Client requests `POST /api/payments/create` with `userSubscriptionId` and desired `amount`.
2. Backend creates a Stripe PaymentIntent and returns `client_secret` to client.
3. Client confirms payment with Stripe SDK.
4. Stripe sends `payment_intent.succeeded` webhook to `/api/webhooks/stripe`.
5. Backend verifies signature, marks `Payment` as `succeeded`, and optionally extends `UserSubscription.renewalDate`.

## Example: Cron job pseudo-code

```ts
// runs every hour
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const target = addDays(now, parseInt(process.env.REMIND_BEFORE_DAYS || '3'));

  const due = await prisma.userSubscription.findMany({
    where: {
      renewalDate: { gte: now, lte: target },
      active: true,
    },
    include: { user: true, subscription: true }
  });

  for (const us of due) {
    const alreadyReminded = await prisma.reminder.findFirst({ where: { userSubscriptionId: us.id, sent: true } });
    if (alreadyReminded) continue;

    // enqueue email job
    await mailQueue.add('sendReminder', { userId: us.userId, userSubscriptionId: us.id });
  }
});
```

## FAQ / Gotchas

* **Timezone handling:** store all datetimes in UTC. Convert to user's timezone only for display and when scheduling local reminders store `timezone` per user if needed.
* **Duplicate reminders:** ensure idempotent checks (unique constraint or `reminder` record) before sending.
* **High volume email sending:** use a provider with good deliverability; consider transactional email limits and warmup.

## Contribution Guide

1. Fork the repo
2. Create a feature branch: `feature/your-feature`
3. Run tests and lint locally
4. Open a PR with description, screenshots (if needed), and link to related issue

---

If you'd like, I can also generate:

* A separate `API.md` that includes full route examples and request/response samples (JSON + curl)
* `PRISMA_SCHEMA.md` or actual `prisma/schema.prisma` file
* A `CHANGES.md` with implementation steps for the payments feature and categories endpoint

---

*Generated on: 2025-10-21*
