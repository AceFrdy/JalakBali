# Jalak Bali Reservation Contract

## Monorepo

The repository contains two independently deployable applications:

```text
apps/
  web/       Next.js customer-facing interface
  backend/   Laravel API and Filament admin
```

During migration, the existing Next.js root and `backend/` directory remain compatible with this contract. The backend owns all reservation data; the web app is a client.

## Source of Truth

Laravel owns applications, customers, reservations, documents, payments, notifications, and reviews. PostgreSQL is the production database. SQLite is only a local development convenience and must not be used for production.

The browser must not be used as a source of truth. No reservation, payment, document, or review state may be read from `localStorage`.

## Status Model

### Application

- `draft`
- `submitted`
- `under_review`
- `approved`
- `completed`
- `rejected`
- `cancelled`

### Document verification

- `pending`
- `under_review`
- `verified`
- `requires_update`
- `rejected`

### Payment

- `pending`
- `processing`
- `paid`
- `failed`
- `expired`
- `refunded`
- `cancelled`

Gateway webhooks are authoritative. Browser redirects are informational only.

### Review moderation

- `pending`
- `approved`
- `rejected`

Reviews and review media remain private until moderation approves them.

## API Contract

- `POST /api/reservations` creates an application and uploads required documents.
- `GET /api/reservations/{bookingCode}` returns customer-safe status using a short-lived or unguessable access token.
- `POST /api/payments/webhook/{provider}` accepts a signed, idempotent provider event.
- `POST /api/reviews` creates a pending review after a completed reservation.
- `GET /api/reviews` returns approved public reviews only.

The owner notification is dispatched as a queued job after a successful application transaction. Its payload contains only the booking code, customer name, and optional authenticated admin URL.

## Storage Strategy

KTP, supporting documents, manual payment proof, and review media use a private Laravel disk or private S3-compatible bucket. Files are never placed in `public/` and are never exposed through public URLs. Admin downloads require Filament authentication and authorization; customer access uses an authenticated backend response or short-lived signed download URL.

## Authentication and Authorization

- Filament admin routes require authenticated admin users.
- Document downloads require an authorization policy for the owning application/document.
- Customer status access uses an unguessable access token stored hashed in the database; the raw token is returned only at application creation.
- Webhook access uses provider signature validation and idempotency keys.

## End-to-End Flow

```text
Customer -> Next.js -> Laravel API -> PostgreSQL + private storage
                                  -> queued owner notification
Customer <- status API <- Laravel
Payment provider -> signed webhook -> Laravel payment state
Admin -> Filament -> authenticated document download + verification
Customer -> review API -> pending moderation -> approved public review
```
