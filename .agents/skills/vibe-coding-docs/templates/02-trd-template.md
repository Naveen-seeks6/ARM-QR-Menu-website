# TRD — Technical Requirements Document

## Tech Stack
- **Frontend Framework**: [e.g. Next.js 14 App Router, React 18, Vite]
- **Styling / UI System**: [e.g. Tailwind CSS, shadcn/ui, Radix UI]
- **Backend Runtime / Framework**: [e.g. Next.js Route Handlers, Node.js/Express, Python/FastAPI]
- **Database Provider**: [e.g. PostgreSQL via Supabase / Neon]
- **Authentication**: [e.g. Supabase Auth (Email + Google OAuth) / Clerk / NextAuth]
- **Hosting / Deployment**: [e.g. Vercel (Frontend), Supabase (Backend + DB)]

## Third-Party Services & APIs
| Service | Purpose | Tier / Notes |
|---|---|---|
| [e.g. Stripe] | Subscription & checkout billing | Test mode / free tier |
| [e.g. Resend] | Transactional email delivery | Free tier (3,000 emails/mo) |
| [e.g. OpenAI] | AI embeddings & LLM completion | Pay-as-you-go |

## Key Libraries & Dependencies
- `[library-name]`: [e.g. Zod for runtime schema validation]
- `[library-name]`: [e.g. TanStack Query for data fetching/caching]
- `[library-name]`: [e.g. Lucide Icons for clean iconography]

## Environment Variables
List all variable names required across environments (do NOT include secret values):
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`

## Hard Constraints & Preferences
- [e.g. Must run on free-tier services initially]
- [e.g. Must support mobile screens with 100% responsive layout]
- [e.g. Zero external CSS dependencies outside Tailwind]
