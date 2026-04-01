# The Fix Collective

Modern, scalable ecommerce + community platform with four shops under one brand:

- The Fix Urban Roots
- The Fix Self-Care
- The Fix Stitch
- The Fix Survival Kits

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Node version

This repo currently runs on Node `>=18.13`. For best security/support (and to upgrade Next.js past the 13.x line), use Node 20+ (see `.nvmrc`).

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run start`: start production server
- `npm run db:generate`: generate Prisma client
- `npm run db:migrate`: run database migrations
- `npm run db:push`: push schema to DB (dev)
- `npm run lint`: run ESLint
- `npm run typecheck`: run TypeScript typechecking

## Payments and account

The app uses **Stripe** for payments and **NextAuth** for accounts.

1. Copy `.env.example` to `.env.local` and set:
   - `DATABASE_URL` (e.g. `file:./prisma/dev.db`)
   - `NEXTAUTH_URL` (e.g. `http://localhost:3000`) and `NEXTAUTH_SECRET`
   - Stripe keys: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - For webhooks: `STRIPE_WEBHOOK_SECRET` (use `stripe listen --forward-to localhost:3000/api/webhooks/stripe` to get it)

2. Run migrations: `npm run db:migrate` (if not already done).

3. Create an account at `/signup`, then sign in at `/login`. Order history and digital downloads are under **Account** (header) → **Order history**.

4. **Roles (admin / vendor / customer)**  
   - New signups are **customers** by default.  
   - **First admin:** after creating your account, promote your user in the database (SQLite example):  
     `UPDATE User SET role = 'ADMIN' WHERE email = 'you@example.com';`  
     (Use `npx prisma studio` or any SQLite client against `prisma/dev.db` if `DATABASE_URL` is `file:./prisma/dev.db`.)  
   - **Vendors:** customers can apply at **Account → Become a vendor**. An admin approves under **Account → Admin → Vendor requests**. Approved vendors get marketplace listing tools and a **Vendor** badge in **Community** (when posting).  
   - Admins can change roles under **Account → Admin → Users & roles**.

5. Digital downloads: add files to `public/downloads/{productId}.pdf` (or other format). The download API serves them to customers who have paid for that item.

## Stripe Payment Links (simple checkout)

Each product can use a **Stripe Payment Link** (one price per link, created in the [Stripe Dashboard](https://dashboard.stripe.com/payment-links)):

- Add URLs in **`src/config/paymentLinks.ts`** as `productId: "https://buy.stripe.com/..."`, **or**
- Set `stripePaymentLink` on a product in `src/data/products.ts`.

When set, product cards and product pages show **Buy now** (opens the link) plus **Add to cart** for combining multiple items. Multi-item carts still use **Cart → Proceed to payment** (Checkout Session).

## Blank page / nothing loads

1. **Stop the dev server**, delete the Next cache, start again:
   ```bash
   rm -rf .next && npm run dev
   ```
2. **Confirm `.env.local`** matches `.env.example` (especially `NEXTAUTH_URL=http://localhost:3000` and a real `NEXTAUTH_SECRET`). A typo or stray quote can break all env loading.
3. **If you changed `NEXTAUTH_SECRET`**, old session cookies no longer match. Clear site data for `localhost` in the browser (or use a private/incognito window), then reload.
4. Check the **terminal** where `npm run dev` runs and the browser **Console** (F12 → Console) for red errors.

## Port already in use (`EADDRINUSE :::3000`)

Another process (often a previous `npm run dev`) is still using port 3000. Either stop that process, or start on another port:

```bash
npm run dev:3001
```

Then open `http://localhost:3001` and set `NEXTAUTH_URL` to match (e.g. `http://localhost:3001`).

## Database / Prisma errors

If pages that use the database show errors or the community feed is empty with a “migrations” message:

1. Ensure **`DATABASE_URL`** in `.env.local` is set (see `.env.example`; local SQLite is fine for development).
2. Apply the schema:

```bash
npm run db:migrate
```

