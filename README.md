This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend and Admin Panel

The Laravel backend lives in `backend/` and owns reservation applications, private identity documents, payment records, reviews, and the Filament admin panel. The browser is not a source of truth for reservation state.

```bash
cd backend
php artisan serve --port=8000
php artisan test
```

The admin panel is available at [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin). Create a local admin account with:

```bash
php artisan make:filament-user
```

Copy `.env.example` to `.env` in the repository root and `backend/.env.example` to `backend/.env`. Set `NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000` to submit reservations directly to Laravel. Production backend configuration uses PostgreSQL; local tests may use the generated SQLite `.env`. The backend stores uploaded identity files on its private `local` disk; do not run `storage:link` for these files.

The public intake endpoint is `POST /api/reservations`. Payment gateway webhook, manual payment proof, customer status, review moderation, and queued WhatsApp endpoints are documented in [reservation-contract.md](docs/architecture/reservation-contract.md), with the data model in [reservation-erd.md](docs/architecture/reservation-erd.md).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
