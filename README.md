# template-clinic — Medical & Dental Booking Template

**Next.js 15 · TypeScript · Prisma 7 · Neon · Multilingual (SK/EN/DE/CS) · DACH Legal**

**Live demo:** [dentcare.vercel.app](https://dentcare.vercel.app) *(coming soon)*

Demo store: **DentCare Clinic** — professional dental clinic in Bratislava.

---

## What's included

- Appointment booking with slot conflict detection
- Doctor profiles with specialization field
- Procedure/service catalog with duration & price
- Insurance section (VZP, ČPZP, Union, Dôvera)
- Patient testimonials with admin replies
- Gallery (clinic interior photos)
- Working hours editor
- AI-powered admin panel (RAG, 7 tools)
- Multilingual: SK / EN / DE / CS
- DACH Legal: Impressum (§5 TMG) + Datenschutz (DSGVO) via admin
- GDPR Cookie Banner
- Stripe (optional paid consultations)

---

## Fork & rebrand in ~1 hour

1. Fork this repo
2. Set env vars (see `.env.example`)
3. `npx prisma migrate deploy && npx prisma db seed`
4. Update `prisma/seed.ts` with your clinic name, doctors, procedures
5. Deploy to Vercel + Neon

---

## Color customization

Primary color: `#0ea5e9` (clinic blue) — change in `src/app/globals.css` → `--color-gold`

```css
:root {
  --color-gold: #0ea5e9;       /* primary blue */
  --color-gold-dark: #0284c7;  /* darker blue */
  --color-gold-light: #e0f2fe; /* light blue */
  --color-bg: #f8fafc;         /* background */
}
```

---

## Tech stack

| Layer      | Tech                                   |
|------------|----------------------------------------|
| Framework  | Next.js 15 (App Router)                |
| Language   | TypeScript                             |
| Database   | Neon (PostgreSQL) + Prisma 7           |
| Auth       | Custom JWT (admin) + bcryptjs          |
| i18n       | next-intl (SK/EN/DE/CS)               |
| Styling    | CSS Modules + global CSS variables     |
| AI         | OpenAI embeddings + pgvector (RAG)     |
| Storage    | Vercel Blob                            |
| Payments   | Stripe (optional)                      |

---

## Environment variables

See `.env.example` for all required and optional variables.

Key variables:
```env
DATABASE_URL=postgresql://...
STORE_SLUG=dentcare
ADMIN_PASSWORD=your_secure_password
```

---

## Project structure

```
src/
  app/
    (store)/[locale]/    # Public storefront
    (admin)/admin/       # Admin panel
    api/                 # REST API routes
  components/
    sections/            # Page sections (Hero, Services, Team, Insurance...)
    ui/                  # Reusable UI components
  lib/                   # DB, auth, theme, types
messages/                # i18n translations (SK/EN/DE/CS)
prisma/
  schema.prisma          # Database schema
  seed.ts                # Demo data (DentCare Clinic)
  migrations/            # SQL migrations
```

---

## Verticals supported

This template is part of the **vendshop** template family:

| Template              | Demo vertical                |
|-----------------------|------------------------------|
| template-clinic       | Dental / Medical clinic      |
| template-services     | Barbershop / Beauty salon    |
| template-restaurant   | Restaurant / Food delivery   |
| template-ecommerce    | Online shop                  |

---

## License

MIT — free to use for commercial projects.

---

*Built with [vendshop-labs](https://github.com/vendshop-labs) template system.*
