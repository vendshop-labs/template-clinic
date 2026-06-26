# template-booking

> Next.js 15 booking template — barbershop, beauty salon, clinic, spa.
> Live demo: https://vendshop-template-services.vercel.app

## What's included
- Slot booking with conflict detection (no double-booking)
- Masters / staff management
- Services catalog + courses
- AI admin assistant (RAG, 7 tools — manage everything by chat)
- Working hours editor (per-day toggle + time picker)
- Gallery with WebP auto-conversion (Sharp)
- Testimonials with admin moderation
- Multilingual (SK/EN/UK/DE via next-intl)
- Admin panel: appointments, reviews, settings, logo, hero

## Tech stack
Next.js 15 App Router · TypeScript · Prisma 7 · Neon PostgreSQL · pgvector · Vercel Blob · Sharp · OpenAI · CSS Modules

## Fork & deploy in ~1 hour

1. Fork this repo → your GitHub account
2. Create Neon DB → copy `DATABASE_URL`
3. Copy `.env.example` → `.env.local` → fill in your values
4. `pnpm install && pnpm prisma migrate deploy && pnpm prisma db seed`
5. Deploy to Vercel → add env vars → connect domain
6. Open `/admin` → set your store name, logo, services, working hours

## Per-client customization
- **Branding**: logo, colors via CSS variables in `src/styles/tokens.css`
- **Services + staff**: edit `prisma/seed.ts`
- **Languages**: set `NEXT_PUBLIC_LOCALES` in env
- **Payments** (optional): add `STRIPE_SECRET_KEY`

## Feature flags

| Flag | Default | Description |
|------|---------|-------------|
| `NEXT_PUBLIC_ENABLE_BOOKING` | `true` | Online booking calendar |
| `NEXT_PUBLIC_ENABLE_WHATSAPP_BOOKING` | `true` | WhatsApp fallback booking |
| `NEXT_PUBLIC_ENABLE_PAYMENT` | `false` | Stripe online payment |
| `NEXT_PUBLIC_ENABLE_COURSES` | `false` | Video courses with access gate |
| `NEXT_PUBLIC_ENABLE_TEAM` | `true` | Team / masters section |
| `NEXT_PUBLIC_ENABLE_GALLERY` | `true` | Gallery section |
| `NEXT_PUBLIC_REVIEWS_MODE` | `static` | `static` or `dynamic` |
| `NEXT_PUBLIC_THEME` | `dark` | `dark`, `light`, `warm`, `navy` |

## Admin panel routes

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard — today's bookings, stats |
| `/admin/rezervacie` | Appointments — confirm, complete, cancel |
| `/admin/history` | Booking history with filters |
| `/admin/services` | Services catalog CRUD |
| `/admin/masters` | Staff management + photos |
| `/admin/courses` | Video courses CRUD |
| `/admin/reviews` | Testimonials moderation |
| `/admin/hero` | Hero image + headline editor |
| `/admin/theme` | Color theme + palette |
| `/admin/settings` | Store info, logo, gallery, working hours |
| `/admin/ai` | AI assistant chat (RAG over your data) |

## Public API

| Endpoint | Description |
|----------|-------------|
| `GET /api/services` | Service list |
| `GET /api/masters` | Staff list |
| `GET /api/availability?masterId=&date=&serviceId=` | Available time slots |
| `POST /api/appointments` | Create booking |

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `STORE_SLUG` — unique identifier for your store (e.g. `my-barbershop`)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token for file uploads
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_SECRET` — admin credentials
- `OPENAI_API_KEY` — optional, enables AI admin assistant
- `STRIPE_SECRET_KEY` — optional, enables online payments

## License
MIT — fork freely, deploy for clients, sell as service.
